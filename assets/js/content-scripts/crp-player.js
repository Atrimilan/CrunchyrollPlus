
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

let video = document.getElementById('player0');

let playerParent = null;
let playerObserver = null;  // Observer

let controlsContainer = null;   // Null for now, because the #vilosControlsContainer div is not loaded yet
let controlsContainerObserver = null;   // Observer

ObserveVideoPlayer();

// Video player observer
function ObserveVideoPlayer() {
    const config = { attributes: false, childList: true, subtree: false };

    let playerObserver = new MutationObserver(function (mutations) {

        mutations.forEach(function (mutation) {

            if (mutation.type == 'childList') {
                if (mutation.addedNodes.length > 0) {
                    Array.from(mutation.addedNodes).map(function (node) {

                        if (node.id == 'vilosControlsContainer') {
                            controlsContainer = node;

                            LoadCrpTools(); // Load CrunchyrollPlus controls if controlsContainer has child nodes

                            console.clear();
                            console.log("%cCrunchyroll PLUS", `color: #f47521`);

                            ObserveControlsContainer(); // Start observing controls when vilosControlsContainer is loaded
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

// Default Crunchyroll controls observer
function ObserveControlsContainer() {
    const config = { attributes: false, childList: true, subtree: false };

    controlsContainerObserver = new MutationObserver(function (mutations) {

        mutations.forEach(function (mutation) {

            if (mutation.type == 'childList' && mutation.addedNodes.length > 0) {
                LoadCrpTools(); // Load CrunchyrollPlus controls if controlsContainer has child nodes
            }
        });
    });
    controlsContainerObserver.observe(controlsContainer, config);
}

// CrunchyrollPlus controls initializer
function LoadCrpTools() {

    if (controlsContainer.firstChild.hasChildNodes()) {
        // Controls on the left of the player
        let leftControls = controlsContainer.querySelector("[data-testid='vilos-play_pause_button']").parentNode.parentNode;
        // let rightControls = controlsContainer.querySelector("#settingsControl").parentNode;

        // Move backward button
        let moveBackward = CreateCrpTool('moveBackward', ['crpTools', "r-1ozmr9b"], 'moveBackward.svg');
        moveBackward.addEventListener("click", () => {
            chrome.runtime.sendMessage({ type: "moveBackwardTime" }, function (response) {
                video.currentTime -= ~~response.message;
            });
        });

        // Move forward button
        let moveForward = CreateCrpTool('moveForward', ['crpTools', "r-1ozmr9b"], 'moveForward.svg');
        moveForward.addEventListener("click", () => {
            chrome.runtime.sendMessage({ type: "moveForwardTime" }, function (response) {
                video.currentTime += ~~response.message;
            });
        });

        // Sound booster button (https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaElementSource)
        let soundBooster = CreateCrpTool('soundBoosterOff', ['crpTools', "r-1ozmr9b"], 'soundBoosterOff.svg');
        soundBooster.addEventListener("click", () => {
            const audioCtx = new AudioContext();
            let source = audioCtx.createMediaElementSource(video);
            const gainNode = audioCtx.createGain();
            gainNode.gain.value = 5;
            source.connect(gainNode);
            gainNode.connect(audioCtx.destination);
        });

        // Append all CrunchyrollPlus controls
        leftControls.appendChild(moveBackward);
        leftControls.appendChild(moveForward);
        leftControls.appendChild(soundBooster);

        // Change playbar color to the stored theme color
        chrome.runtime.sendMessage({ type: "themeColor" }, function (response) {
            if (!!response.message) {
                changePlayBarColor(response.message);
            }
        });
    }
}

// Change the playbar color (watched time bar and reticle)
function changePlayBarColor(themeColor) {

    let playerPointer = document.querySelector('[data-testid="vilos-knob"]');
    playerPointer.style.visibility = "hidden";

    let crpPointer = document.createElement('div');
    crpPointer.id = "crpPointer";
    crpPointer.style.backgroundColor = themeColor;

    playerPointer.appendChild(crpPointer);


    let watchedTime = document.querySelector('[data-testid="vilos-scrub_bar"]').children[0].children[0].children[0]
        .children[1].children[0].children[0];  // They should hire someone to add ids wherever they are missing !
    watchedTime.style.visibility = "hidden";

    let crpWatchedTime = document.createElement('div');
    crpWatchedTime.id = "crpWatchedTime";
    crpWatchedTime.style.backgroundColor = themeColor;

    watchedTime.appendChild(crpWatchedTime);
    
    // playerPointer and watchedTime "style" properties cannot be changed because it is automatically updated by the player
    // This is why a child is created, while parent visibility is set to "hidden"
}

// Create a default CrunchyrollPlus control
function CreateCrpTool(id, classList, imageWithExtension) {
    let crpTool = document.createElement("button");
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
    let crpImg = document.createElement('img');
    crpImg.id = id;
    crpImg.src = chrome.runtime.getURL(`images/controls/${imageWithExtension}`);    // Requires web_accessible_resources in the manifest
    return crpImg;
}

// Messages received from Popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Nothing yet
});

/*
chrome.runtime.sendMessage({ type: "time" }, function (response) {
    console.log(response.message);
});
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "moveForward"}, function(response) {
        console.log(response);
    });
});

// Wait for an given element to be loaded - https://stackoverflow.com/a/61511955
// USE : waitForElementLoaded('#myDivId').then(result => { console.log(result); });
// OR : (async () => { var result = await waitForElementLoaded('#myDivId'); })();
function waitForElementLoaded(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

// Wait for given milliseconds
// USE : delay(1000).then(() => { ... });
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
*/