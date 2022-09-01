/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*************************************************!*\
  !*** ./assets/js/content-scripts/crp-player.js ***!
  \*************************************************/
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
var playerParent = document.getElementById('velocity-controls-package');
var controlsContainer = null; // Because the #vilosControlsContainer div is not loaded yet

var controlsContainerObserver = null;
ObserveVideoPlayer(); // Video player observer

function ObserveVideoPlayer() {
  var config = {
    attributes: false,
    childList: true,
    subtree: false
  };
  var playerObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type == 'childList') {
        if (mutation.addedNodes.length > 0) {
          Array.from(mutation.addedNodes).map(function (node) {
            if (node.id == 'vilosControlsContainer') {
              controlsContainer = node;

              if (controlsContainer.firstChild.hasChildNodes()) {
                LoadCrpTools(); // Load CrunchyrollPlus controls if controlsContainer has child nodes
              }

              console.clear();
              console.log("%cCrunchyroll PLUS", "color: #f47521");
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
} // Default Crunchyroll controls observer


function ObserveControlsContainer() {
  var config = {
    attributes: false,
    childList: true,
    subtree: false
  };
  controlsContainerObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type == 'childList' && mutation.addedNodes.length > 0) {
        if (controlsContainer.firstChild.hasChildNodes()) {
          LoadCrpTools(); // Load CrunchyrollPlus controls if controlsContainer has child nodes
        }
      }
    });
  });
  controlsContainerObserver.observe(controlsContainer, config);
} // CrunchyrollPlus controls initializer


function LoadCrpTools() {
  var div = document.createElement("div");
  div.classList.add('crpPlayer');
  div.id = 'crunchyrollPlusDiv';
  controlsContainer.children[0].children[0].children[1].children[2].children[0].appendChild(div);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("%cMessage received from Popup", "color: #ff0000");

  if (request.type === "moveForward") {
    console.log("Move forward");
    chrome.runtime.sendMessage({
      type: "time"
    }, function (response) {
      document.getElementById('player0').currentTime += ~~response.message;
    });
  } else if (request.type === "moveBackward") {
    console.log("Move backward");
    chrome.runtime.sendMessage({
      type: "time"
    }, function (response) {
      document.getElementById('player0').currentTime -= ~~response.message;
    });
  } else {
    console.log(null);
  }
});
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
/******/ })()
;