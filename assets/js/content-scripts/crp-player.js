
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

let playerParent = document.getElementById('velocity-controls-package');
let controlsContainer = null;   // Because the #vilosControlsContainer div is not loaded yet

let playerObserver = null;
let controlsContainerObserver = null;

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
    playerObserver.observe(playerParent, config);
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
        let moveBackward = CreateCrpTool('moveBackward', ['crpTools'], 'moveBackward.svg');
        moveBackward.addEventListener("click", () => {
            chrome.runtime.sendMessage({ type: "time" }, function (response) {
                video.currentTime -= ~~response.message;
            });
        });

        // Move forward button
        let moveForward = CreateCrpTool('moveForward', ['crpTools'], 'moveForward.svg');
        moveForward.addEventListener("click", () => {
            chrome.runtime.sendMessage({ type: "time" }, function (response) {
                video.currentTime += ~~response.message;
            });
        });

        // Sound booster button (https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaElementSource)
        let soundBooster = CreateCrpTool('soundBoosterOff', ['crpTools'], 'soundBoosterOff.svg');
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
    }
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
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log("%cMessage received from Popup", `color: #ff0000`);

        if (request.type === "moveForward") {
            console.log("Move forward");

            chrome.runtime.sendMessage({ type: "time" }, function (response) {
                video.currentTime += ~~response.message;
            });
        }
        else if (request.type === "moveBackward") {
            console.log("Move backward");

            chrome.runtime.sendMessage({ type: "time" }, function (response) {
                video.currentTime -= ~~response.message;
            });
        }
        else {
            console.log(null);
        }
    }
);


/*
chrome.runtime.sendMessage({ type: "time" }, function (response) {
    console.log(response.message);
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