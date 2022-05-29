
chrome.runtime.sendMessage({ type: "time" }, function (response) {
    console.log(response.message);
});


waitForElementLoaded('#velocity-controls-package').then(() => {
    ObservePage();  // Observe the page when velocity-controls-package is loaded
});
// It could also be written this way :
// (async () => {
//     await waitForElementLoaded('#velocity-controls-package');
//     ObservePage();
// })();


// Wait for given milliseconds
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

// Wait for an given element to be loaded - https://stackoverflow.com/a/61511955
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

var videoPlayerLoaded = false;
var videoPlayerObserver;

function ObservePage() {
    const targetNode = document.getElementById('velocity-controls-package');    // Observed node
    const config = { attributes: false, childList: true, subtree: false };      // MutationObserver configuration

    console.log("Page started observing");

    var pageObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {

            if (!videoPlayerLoaded) {    // If the video player is not loaded...
                for (let node of mutation.addedNodes) {

                    if (node.id == "vilosControlsContainer") {  // ...check if it is added...
                        videoPlayerLoaded = true;
                        ObserveVideoPlayer();

                        console.log("Video player found");
                    }
                }
            }
            else {  // If the video player is loaded...
                for (let node of mutation.removedNodes) {

                    if (node.id == "vilosControlsContainer") {  // ...check if it is removed...
                        videoPlayerObserver.disconnect(); // ...and stop observing it if it is
                        videoPlayerLoaded = false;

                        console.log("Player video destroyed");
                    }
                }
            }
        });
    });
    pageObserver.observe(targetNode, config);   // Start observation, to stop use "pageObserver.disconnect();"
}

function ObserveVideoPlayer() {
    const targetNode = document.getElementById('vilosControlsContainer');   // Observed node
    const config = { attributes: false, childList: true, subtree: false };  // MutationObserver configuration

    videoPlayerObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {

            if (mutation.type == 'childList') {
                for (let node of mutation.addedNodes) {

                    if (node.className == "css-1dbjc4n r-r3j1r2 r-13awgt0") {    // On destroy, Crunchyroll creates a node with className "css-1dbjc4n r-rx5rfo r-13awgt0" (not the same name !)
                        var div = document.createElement("div");
                        div.classList.add('crpPlayer');
                        div.id = 'crunchyrollPlusDiv';

                        var menu = document.getElementsByClassName('css-1dbjc4n r-1awozwy r-18u37iz');
                        for (let el of menu) {
                            if (el.className == "css-1dbjc4n r-1awozwy r-18u37iz") {
                                el.appendChild(div);
                            }
                        }
                    }
                }
            }
        });
    });

    // Crunchyroll seems to instanciate and destroy the video player multiple time, so we need to check if it still exists
    // Otherwise, we would get multiple observer on the same node
    if (document.getElementById('vilosControlsContainer')) {
        videoPlayerObserver.observe(targetNode, config);    // Start observation, to stop use "observer.disconnect();"
    }
}

delay(0000).then(() => {
    console.clear();
    let color = '#f47521';
    console.log("%cCrunchyroll PLUS", `color: ${color}`);
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.type === "moveForward") {
            console.log("Move forward");

            chrome.runtime.sendMessage({ type: "time" }, function (response) {
                document.getElementById('player0').currentTime += ~~response.message;
            });
        }
        else if (request.type === "moveBackward") {
            console.log("Move backward");

            chrome.runtime.sendMessage({ type: "time" }, function (response) {
                document.getElementById('player0').currentTime -= ~~response.message;
            });
        }
        else {
            console.log(null);
        }
    }
);