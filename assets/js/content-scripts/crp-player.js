/*
 * Notes about the default Crunchyroll video player [id: velocity-controls-package]
 *
 * It contains 3 divs :
 * • First one is the video itselft
 * • Second one is the controls container [id: vilosControlsContainer]
 *   - It is not loaded immediately in the DOM
 *   - It is not visible until you hover over the video player
 * • Third one appears above the two previous ones when you hover over the video player, it's a vignette effect
 */

import PlayerTool from '../classes/player-tool.js';
import MessageAPI from '../classes/message-api.js';
import SkipperManager from '../classes/skipper-manager.js';


var video = document.getElementById('player0');

var playerParent = null;
var playerObserver = null;  // Observer

var controlsContainer = null;   // Null for now, because the #vilosControlsContainer div is not loaded yet
var controlsContainerObserver = null;   // Observer

ObserveVideoPlayer();

// Video player observer
function ObserveVideoPlayer() {
    const config = { attributes: false, childList: true, subtree: false };

    playerObserver = new MutationObserver(function (mutations) {

        mutations.forEach(function (mutation) {

            if (mutation.type == 'childList') {
                if (mutation.addedNodes.length > 0) {
                    Array.from(mutation.addedNodes).map(function (node) {

                        if (node.id == 'vilosControlsContainer') {
                            controlsContainer = node;

                            //console.clear();
                            console.log("%cCrunchyroll PLUS", `color: #ea2600`);

                            if (controlsContainer.firstChild.hasChildNodes()) {
                                LoadCrpTools(); // Load CrunchyrollPlus controls if controlsContainer has child nodes
                            }
                            ObserveControlsContainer(); // Start observing controls when vilosControlsContainer is loaded

                            // Init opening skippers through the Skipper Manager
                            // (Skipper need to be appended to the parentNode to be displayed in fullscreen)
                            SkipperManager.initOpeningSkipper(video, controlsContainer.parentNode);
                        }
                    });
                }
                if (mutation.removedNodes.length > 0) {
                    Array.from(mutation.removedNodes).map(function (node) {

                        if (node.id == 'vilosControlsContainer' && controlsContainerObserver != null) {
                            controlsContainerObserver.disconnect(); // Stop observing controls when vilosControlsContainer is destroyed
                        }
                    });
                }
            }
        });
    });

    // Crunchyroll seems to instanciate and destroy the video player multiple time, this will probably need to be revisited later
    if (!!(playerParent = document.getElementById('velocity-controls-package'))) {  // Get node and check if it is not null
        playerObserver.observe(playerParent, config);
    }
}

var isMenuOpen = false;

// Default Crunchyroll controls observer
function ObserveControlsContainer() {
    const config = { attributes: false, childList: true, subtree: false };

    controlsContainerObserver = new MutationObserver(function (mutations) {

        mutations.forEach(function (mutation) {
            if (mutation.type == 'childList' && mutation.addedNodes.length > 0) {
                if (mutation.addedNodes[0].hasChildNodes()) {
                    isMenuOpen = true;
                    LoadCrpTools();
                } else {
                    isMenuOpen = false;
                    DestroyCrpTools();
                }
            }
        });
    });
    controlsContainerObserver.observe(controlsContainer, config);
}

// CrunchyrollPlus controls initializer
async function LoadCrpTools() {

    // Controls on the left of the player
    const leftControls = controlsContainer.querySelector("[data-testid='vilos-play_pause_button']").parentNode.parentNode;
    // const rightControls = controlsContainer.querySelector("#settingsControl").parentNode;

    const toolClasses = ['crpTools', "r-1ozmr9b"];

    // Move backward button
    var moveBackward = new PlayerTool('moveBackward', toolClasses, 'moveBackward.svg').tool;
    leftControls.appendChild(moveBackward);
    const moveBackwardTime = await MessageAPI.getStorage('moveBackwardTime');
    moveBackward.addEventListener("click", () => { video.currentTime -= ~~moveBackwardTime; });

    // Move forward button
    var moveForward = new PlayerTool('moveForward', toolClasses, 'moveForward.svg').tool;
    leftControls.appendChild(moveForward);
    const moveForwardTime = await MessageAPI.getStorage('moveForwardTime');
    moveForward.addEventListener("click", () => { video.currentTime += ~~moveForwardTime; });

    // Sound booster button (https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaElementSource)
    var soundBooster = new PlayerTool('soundBoosterOff', toolClasses,
        soundBoosterEnabled ? 'soundBoosterOn.svg' : 'soundBoosterOff.svg').tool;
    leftControls.appendChild(soundBooster);
    const soundMultiplier = await MessageAPI.getStorage('soundMultiplier');
    soundBooster.addEventListener("click", () => {
        if (!soundBoosterInitialized) {
            InitSoundBooster();
        }
        if (!soundBoosterEnabled) { // If disabled, boost gain with stored sound multiplier
            gainNode.gain.value = 1 + soundMultiplier / 10;
            soundBoosterEnabled = true;
            soundBooster.firstChild.src = chrome.runtime.getURL(`images/controls/soundBoosterOn.svg`);
        }
        else {  // If enabled, set gain value to 1
            gainNode.gain.value = 1;
            soundBoosterEnabled = false;
            soundBooster.firstChild.src = chrome.runtime.getURL(`images/controls/soundBoosterOff.svg`);
        }
    });

    SkipperManager.openingSkippersVisible(true);

    // Change playbar color to the stored theme color
    const themeColor = await MessageAPI.getStorage('themeColor');
    if (!!themeColor && isMenuOpen) {   // themeColor not null and menu is still open
        changePlayBarColor(themeColor);
        changeVolumeSelectorColor(themeColor);
    }
}

// CRP controls destroyer
function DestroyCrpTools() {
    SkipperManager.openingSkippersVisible(false);
}

var soundBoosterInitialized = false, soundBoosterEnabled = false;
var audioCtx = null, gainNode = null, source = null;

// Initialize sound booster variables
function InitSoundBooster() {
    audioCtx = new AudioContext();
    source = audioCtx.createMediaElementSource(video);
    gainNode = audioCtx.createGain();
    gainNode.gain.value = 1;
    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    soundBoosterInitialized = true;
}

// Change the playbar color (watched time bar and reticle)
function changePlayBarColor(themeColor) {

    var playerPointer = document.querySelector('div[data-testid="vilos-knob"]');
    playerPointer.style.visibility = "hidden";

    var crpPointer = document.createElement('div');
    crpPointer.className = "crpKnob";
    crpPointer.style.backgroundColor = themeColor;

    playerPointer.appendChild(crpPointer);

    var watchedTime = document.querySelector('div[data-testid="vilos-scrub_bar"]').children[0].children[0].children[0]
        .children[1].children[0].children[0];  // They should hire someone to add ids wherever they are missing !
    watchedTime.style.visibility = "hidden";

    var crpWatchedTime = document.createElement('div');
    crpWatchedTime.id = "crpWatchedTime";
    crpWatchedTime.style.backgroundColor = themeColor;

    watchedTime.appendChild(crpWatchedTime);

    // playerPointer and watchedTime "style" properties cannot be changed because it is automatically updated by the player
    // This is why child nodes are created, while their parent's visibility is set to "hidden"
}

var volumeObserver = null;
// Change the volume knob color
// (Requires a MutationObserver because it is not initially loaded)
function changeVolumeSelectorColor(themeColor) {
    const volumeButton = controlsContainer.querySelector("[data-testid='vilos-volume_container']");
    const config = { attributes: false, childList: true, subtree: false };

    volumeObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type == 'childList' && mutation.addedNodes.length > 0) {
                var knob = volumeButton.querySelector("[data-testid='vilos-knob']");
                knob.style.visibility = "hidden";

                var crpVolPointer = document.createElement('div');
                crpVolPointer.className = "crpKnob";
                crpVolPointer.style.backgroundColor = themeColor;

                knob.appendChild(crpVolPointer);
            }
        });
    });
    volumeObserver.observe(volumeButton, config);
}

// Messages received from Popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    const { type, parameters } = request;

    switch (type) {
        case "togglePlayerThumbnail":
            togglePlayerThumbnail(parameters.state);
            break;
        case "definePlayerOpenings":
            //  startListeningVideoPlayer(request.openingTimes);
            break;
    }
    return true;    // Tell Chrome that response is sent asynchronously
});

// Load data from the chrome storage, and call needed functions
(function InitPage() {
    chrome.runtime.sendMessage({ action: "showPlayerThumbnail" }, function (response) {
        togglePlayerThumbnail(response.message);
    });
})();

var playerThumbnailStyle = createStyleElement("playerThumbnailStyle");

// Create style element and add it to the DOM
function createStyleElement(id) {
    var myStyle = document.createElement('style');
    myStyle.id = id;
    document.getElementsByTagName('head')[0].appendChild(myStyle);

    return myStyle;
}

function togglePlayerThumbnail(state) {
    if (state) {
        playerThumbnailStyle.innerHTML = ``;
    } else {
        // CSS to hide the progress bar thumbnail
        playerThumbnailStyle.innerHTML = `
        div[class="css-1dbjc4n r-1awozwy r-1777fci"] {
            visibility: hidden;
        }`;
    }
}

// Wait for given milliseconds
// USE : delay(1000).then(() => { ... });
/*function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}*/

// Change loading spinner color to the stored theme color
var loadSpinner = document.querySelectorAll('div[data-testid="vilos-loading"] path');
(function setLoadingSpinnerColor() {
    chrome.runtime.sendMessage({ action: "themeColor" }, function (response) {
        if (!!response.message) {
            loadSpinner.forEach(element => {
                element.style.stroke = response.message;
            });
        }
    });
})();

// ----------------------------- //
//  Opening skippers management  //
// ----------------------------- //
/*
var openingList = [];
var crpSkipperList = [];

async function initOpeningSkipper() {

    // Check if CRP skippers are enabled, and get the duration of an opening
    var { enabled, openingDuration } = await MessageAPI.getStorage("crpSkipper");

    if (enabled) {
        // Hide default opening skipper
        var defaultSkipper = createStyleElement("hideDefaultSkipper");
        defaultSkipper.innerHTML = `
        div[data-testid="skipButton"] {
            display: none;
        }
        #skipButton {
            display: none;
        }`;

        // Openings need to be detected from main page content-script to avoid CORS restrictions when accessing subtitles links
        const opList = (await MessageAPI.sendToContentScripts("detectOpenings", { openingDuration, videoDuration: video.duration }));

        // Create a new skipper for each opening
        opList.forEach((op, index) => {
            const skipper = new Skipper(index, controlsContainer.parentNode);
            crpSkipperList.push(skipper.crpSkipper);

            op.skipperId = skipper.crpSkipper.id;
            op.skipperTimerId = skipper.timer.id;
            op.handler = "none";
        });

        startListeningVideoPlayer(opList, openingDuration);
    };
}

// Listen to the video player timeupdate, and display the opening skipper if it is the right time
function startListeningVideoPlayer(openings, opDuration) {
    openingList = openings; // Now used as a global variable
    var remainingTimeSec;

    video.addEventListener("timeupdate", function () {
        var time = Math.round(this.currentTime);

        openingList.forEach((op, index) => {
            const crpSkipper = crpSkipperList[index];   // Get Skipper
            const { start, end, skipperTimerId } = op;  // Get OP data

            if (time >= start && time < end) {  // If this opening is playing
                remainingTimeSec = end - time > opDuration ? opDuration : end - time;
                const remainingTime = new Date(remainingTimeSec * 1000).toISOString().substring(14, 19);
                crpSkipper.querySelector('#' + skipperTimerId).innerText = `(${remainingTime})`;

                if (op.handler === "none") { enableSkipper() }  // Enable if not handled yet
            }
            else if (op.handler !== "none") { disableSkipper() }// Disable if handled while opening has ended


            function enableSkipper() {
                op.handler = "initializing";    // Prevent the skipper from being handled multiple times at once
                crpSkipper.style.visibility = "visible";
                crpSkipper.style.opacity = 1;   // Force the skipper to be displayed for a moment

                addSkipperEvents(); // Skipper mouse events

                const timeout = (((end - time) * 1000) > 4000) ? 4000 : ((end - time) * 1000);  // Timeout (max: 4s)
                setTimeout(() => {
                    crpSkipper.style.opacity = isMenuOpen ? 1 : 0;
                    op.handler = "mouseMovements"; // Skipper is now handled by mouse movements
                }, timeout);
            }

            function disableSkipper() {
                op.handler = "none";    // Stop handling
                coolCollapse(crpSkipper);
            }

            function addSkipperEvents() {
                crpSkipper.addEventListener('click', () => { video.currentTime += ~~remainingTimeSec });    // Skip the opening
                crpSkipper.addEventListener('mouseover', () => { crpSkipper.style.opacity = 1 });   // Don't hide on hover
            }
        });
    }, false);
}

// Toggle skipper if an opening is playing
function openingSkippersVisible(state) {
    openingList.forEach((op, index) => {
        const crpSkipper = crpSkipperList[index];

        if (op.handler === "mouseMovements") {
            crpSkipper.style.opacity = state ? 1 : 0;
        }
        else if (op.handler === "none") {
            coolCollapse(crpSkipper);
        }
    });
}

// Wait for opacity transition (0.3s), then collapse the visibility
function coolCollapse(skipper){
    skipper.style.opacity = 0;
    setTimeout(() => { skipper.style.visibility = 'collapse'; }, 300);
}*/