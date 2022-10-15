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
import PageStyle from '../classes/page-style.js';

var video = document.getElementById('player0');

var playerParent = null;
var playerObserver = null;  // Observer

var controlsContainer = null;   // Null for now, because the #vilosControlsContainer div is not loaded yet
var controlsContainerObserver = null;   // Observer

var themeColor;

// Asynchronous player initializer
(async function InitPlayer() {
    
    // Initialize styles
    themeColor = await MessageAPI.getStorage('themeColor');
    PageStyle.set("togglePlayerThumbnail", { state: await MessageAPI.getStorage("showPlayerThumbnail") });
    setLoadingSpinnerColor(themeColor);

    // Initialize player controls
    initPlayerTools();

    // Start oberving video player
    observeVideoPlayer();
})();

// Video player observer
function observeVideoPlayer() {
    const config = { attributes: false, childList: true, subtree: false };

    playerObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {

            if (mutation.addedNodes.length > 0) {
                Array.from(mutation.addedNodes).map((node) => {
                    if (node.id == 'vilosControlsContainer') {
                        controlsContainer = node;

                        console.clear();
                        console.log("%c[Crunchyroll PLUS]", `color: #ea2600`);

                        if (controlsContainer.firstChild.hasChildNodes()) {
                            loadCrpTools(); // Load CrunchyrollPlus controls if controlsContainer has child nodes
                        }
                        observeControlsContainer(); // Start observing controls when vilosControlsContainer is loaded

                        // Init opening skippers through the Skipper Manager
                        // (Skipper need to be appended to the parentNode to be displayed in fullscreen)
                        SkipperManager.initOpeningSkipper(video, controlsContainer.parentNode);
                    }
                });
            }
            if (mutation.removedNodes.length > 0) {
                Array.from(mutation.removedNodes).map((node) => {
                    if (node.id == 'vilosControlsContainer' && controlsContainerObserver != null) {
                        controlsContainerObserver.disconnect(); // Stop observing controls when vilosControlsContainer is destroyed
                    }
                });
            }
        });
    });

    // Crunchyroll seems to instanciate and destroy the video player multiple time, this will probably need to be revisited later
    if (!!(playerParent = document.getElementById('velocity-controls-package'))) {  // Get node and check if it is not null
        playerObserver.observe(playerParent, config);
    }
}

// Default Crunchyroll controls observer
var isMenuOpen = false;
function observeControlsContainer() {
    const config = { attributes: false, childList: true, subtree: false };

    controlsContainerObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type == 'childList' && mutation.addedNodes.length > 0) {
                if (mutation.addedNodes[0].hasChildNodes()) {
                    isMenuOpen = true;
                    loadCrpTools();
                } else {
                    isMenuOpen = false;
                    destroyCrpTools();
                }
            }
        });
    });
    controlsContainerObserver.observe(controlsContainer, config);
}

var moveBackward, moveForward, soundBooster;

// Crunchyroll PLUS player initializer (colors, buttons, etc.)
async function initPlayerTools() {
    const toolClasses = ['crpTools', "r-1ozmr9b"];

    // Move backward button
    moveBackward = new PlayerTool('moveBackward', toolClasses, 'moveBackward.svg').tool;
    const moveBackwardTime = await MessageAPI.getStorage('moveBackwardTime');
    moveBackward.addEventListener("click", () => { video.currentTime -= ~~moveBackwardTime; });

    // Move forward button
    moveForward = new PlayerTool('moveForward', toolClasses, 'moveForward.svg').tool;
    const moveForwardTime = await MessageAPI.getStorage('moveForwardTime');
    moveForward.addEventListener("click", () => { video.currentTime += ~~moveForwardTime; });

    // Sound booster button (https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaElementSource)
    soundBooster = new PlayerTool('soundBoosterOff', toolClasses,
        soundBoosterEnabled ? 'soundBoosterOn.svg' : 'soundBoosterOff.svg', { size: 27 }).tool;
    const soundMultiplier = await MessageAPI.getStorage('soundMultiplier');
    soundBooster.addEventListener("click", () => {
        if (!soundBoosterInitialized) {
            initSoundBooster();
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
}

function loadCrpTools() {
    // Controls on the left of the player
    const leftControls = controlsContainer.querySelector("[data-testid='vilos-volume_container']").parentNode.parentNode;
    // const rightControls = controlsContainer.querySelector("#settingsControl").parentNode;

    leftControls.appendChild(moveBackward);
    leftControls.appendChild(moveForward);
    leftControls.appendChild(soundBooster);

    SkipperManager.openingSkippersVisible(true);

    changePlayBarColor(themeColor);
    changeVolumeSelectorColor(themeColor);
}

function destroyCrpTools() {
    SkipperManager.openingSkippersVisible(false);
}

var soundBoosterInitialized = false, soundBoosterEnabled = false;
var audioCtx = null, gainNode = null, source = null;

// Initialize sound booster variables
function initSoundBooster() {
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
    // Note: playerPointer and watchedTime "style" properties cannot be changed because it is automatically updated by the player
    // This is why child nodes are created, while their parent's visibility is set to "hidden"
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
}

var volumeObserver = null;

// Change the volume knob color (requires a MutationObserver because it is not initially loaded)
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
            PageStyle.set("togglePlayerThumbnail", { state: parameters.state });
            break;
    }
    return true;    // Tell Chrome that response is sent asynchronously
});

var loadSpinner = document.querySelectorAll('div[data-testid="vilos-loading"] path');

// Change loading spinner color to the stored theme color
function setLoadingSpinnerColor(themeColor) {
    loadSpinner.forEach(element => { element.style.stroke = themeColor });
};