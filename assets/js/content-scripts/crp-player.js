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

/****************/ sendToPageTest("multiply", { a: 5, b: 2 }); /****************/
/****************/ sendToPageTest("divide", { a: 3, b: 6 }); /****************/

                            InitOpeningSkipper();
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

    openingSkippersVisible(true);

    // Change playbar color to the stored theme color
    const themeColor = await MessageAPI.getStorage('themeColor');
    if (!!themeColor) { // Not null
        changePlayBarColor(themeColor);
    }
}

// CRP controls destroyer
function DestroyCrpTools() {
    openingSkippersVisible(false);
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
    crpPointer.id = "crpPointer";
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
/*
// Create a default CrunchyrollPlus control
function CreateCrpTool(id, classList, imageWithExtension) {
    var crpTool = document.createElement("button");
    crpTool.classList.add(...classList);
    crpTool.id = id;
    crpTool.appendChild(CreateCrpImg(`${id}Img`, imageWithExtension));

    crpTool.addEventListener("click", function (event) {
        event.stopPropagation();    // Prevent click propagation (it would pause/resume the video)
    });

    return crpTool;
}

// Create an image (for a CrunchyrollPlus control)
function CreateCrpImg(id, imageWithExtension) {
    var crpImg = document.createElement('img');
    crpImg.id = id;
    crpImg.src = chrome.runtime.getURL(`images/controls/${imageWithExtension}`);    // Requires web_accessible_resources in the manifest
    return crpImg;
}*/

// Messages received from Popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    const { type, parameters } = request;

    switch (type) {
        case "togglePlayerThumbnail":
            togglePlayerThumbnail(request.state);
            break;
        case "definePlayerOpenings":
            startListeningVideoPlayer(request.openingTimes);
            break;
    }
});

// Load data from the chrome storage, and call needed functions
(function InitPage() {
    chrome.runtime.sendMessage({ action: "showPlayerThumbnail" }, function (response) {
        togglePlayerThumbnail(response.message);
    });
})();

var playerThumbnailStyle = CreateStyleElement("playerThumbnailStyle");

// Create style element and add it to the DOM
function CreateStyleElement(id) {
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

async function InitOpeningSkipper() {
    // Check if CRP skipper is enabled first
    const crpSkipper = await MessageAPI.getStorage("crpOpeningSkipper");

    if (crpSkipper) {
        // Openings need to be detected from main page content-script
        // to avoid CORS restrictions when accessing subtitles links
        chrome.runtime.sendMessage({ action: "getOpeningTimes", videoDuration: video.duration });

        // Hide default opening skipper
        var defaultSkipper = CreateStyleElement("hideDefaultSkipper");
        defaultSkipper.innerHTML = `
        div[data-testid="skipButton"] {
            display: none;
        }
        #skipButton {
            display: none;
        }`;
    };
}

// Create a skipper button and start detecting openings in the episode
// (when the time between 2 subtitles is long enough for an opening)
function createOpeningSkippers() {
    const opDuration = new Date(openingDuration * 1000).toISOString().substring(14, 19);    // Convert seconds to mm:ss

    openingList.forEach((op, index) => {
        var crpSkipper = document.createElement('div');
        crpSkipper.id = "crpSkipper_" + index;
        crpSkipper.className = "crpSkipper";
        crpSkipper.style.visibility = 'collapse';

        var crpSkipperText = document.createElement('p');
        crpSkipperText.innerText = chrome.i18n.getMessage("player_openingSkipper");
        crpSkipperText.className = "crpSkipperText";

        var crpSkipperTimer = document.createElement('p');
        crpSkipperTimer.id = "crpSkipperTimer_" + index;
        crpSkipperTimer.className = "crpSkipperTimer";
        crpSkipperTimer.innerText = `(${opDuration})`;

        crpSkipper.appendChild(crpSkipperText);
        crpSkipper.appendChild(crpSkipperTimer);
        controlsContainer.parentNode.appendChild(crpSkipper);   // Not to the body, because it's not displayed in fullscreen

        crpSkipper.addEventListener('mouseover', () => { crpSkipper.style.opacity = 1; });   // On hover, don't hide the skipper
        crpSkipper.addEventListener('mouseout', () => { });
        crpSkipper.addEventListener('click', () => { video.currentTime += ~~skipperTimer; });   // On click, skip the opening

        op.skipperId = crpSkipper.id;
        op.skipperTimerId = crpSkipperTimer.id;
        op.handler = "none";
    });
}

var openingList = null;
var openingDuration = 90;   // Default value, but will be replaced asynchronously
var skipperTimer = 90;

// Listen to the video player timeupdate, and display the opening skipper if it is the right time
async function startListeningVideoPlayer(openings) {
    openingList = openings; // Now used as a global variable

    openingDuration = await MessageAPI.getStorage("openingDuration");

    createOpeningSkippers();    // Create buttons

    video.addEventListener("timeupdate", async function () {
        var currentTime = Math.round(this.currentTime);

        openingList.forEach((op) => {
            var crpSkipper = document.getElementById(op.skipperId);

            // If an opening is playing
            if (currentTime >= op.start && currentTime < op.end) {

                // Update skipper timer
                skipperTimer = op.end - currentTime > openingDuration ? openingDuration : op.end - currentTime;
                var skipperTimerMMSS = new Date(skipperTimer * 1000).toISOString().substring(14, 19);   // Convert seconds to mm:ss

                document.getElementById(op.skipperTimerId).innerHTML = `(${skipperTimerMMSS})`;

                if (op.handler === "none") {    // If not handled yet
                    op.handler = "autoTimeout";                 // Handle it
                    crpSkipper.style.visibility = "visible";    // Display the skipper
                    crpSkipper.style.opacity = 1;

                    var timeLeft = (op.end - currentTime) * 1000;       // Define a timeout of 4 seconds, or less if the time
                    var timeout = (timeLeft > 4000) ? 4000 : timeLeft;  // to the end of the opening is reached before

                    setTimeout(() => {
                        op.handler = "mouseMovements";    // Change handler, and hide/show the skipper wether the controls are
                        crpSkipper.style.opacity = isMenuOpen ? 1 : 0;  // displayed or not at this moment 
                    }, timeout);
                }
            }
            // If no opening is playing, collapse the skipper
            else if (currentTime >= op.end || currentTime < op.start && op.handler !== "none") {
                op.handler = "none";                        // No more handler
                crpSkipper.style.opacity = 0;

                // Collapse the button when the opening is not playing
                setTimeout(() => { crpSkipper.style.visibility = 'collapse'; }, 300);   // Timeout of 0.3s for opacity transition
            }
        });
    }, false);
}

// Called on mouse moved (when controls are shown/hidden to be exact)
function openingSkippersVisible(state) {
    if (openingList !== null) { // Do not execute if openings hasn't been detected yet

        openingList.forEach((op) => {
            var crpSkipper = document.getElementById(op.skipperId);

            // Opening is playing
            if (op.handler === "mouseMovements") {
                crpSkipper.style.opacity = state ? 1 : 0;
            }
            // Opening is not playing
            /*    else if (op.handler === "none") {
                    crpSkipper.style.opacity = 0;
                    setTimeout(() => { crpSkipper.style.visibility = 'collapse'; }, 300);   // Timeout of 0.3s for opacity transition
                }*/
        });
    }
}

async function sendToPageTest(type, parameters) {
    const response = await MessageAPI.sendToContentScripts(type, parameters);
    console.log("- Send To Page Test -");
    console.log(type + " , " + [parameters].toString());
    console.log("result: " + response);
}