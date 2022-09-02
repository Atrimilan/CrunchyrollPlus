/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*************************************************!*\
  !*** ./assets/js/content-scripts/crp-player.js ***!
  \*************************************************/
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
var video = document.getElementById('player0');
var playerParent = document.getElementById('velocity-controls-package');
var controlsContainer = null; // Because the #vilosControlsContainer div is not loaded yet

var playerObserver = null;
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
              LoadCrpTools(); // Load CrunchyrollPlus controls if controlsContainer has child nodes

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
        LoadCrpTools(); // Load CrunchyrollPlus controls if controlsContainer has child nodes
      }
    });
  });
  controlsContainerObserver.observe(controlsContainer, config);
} // CrunchyrollPlus controls initializer


function LoadCrpTools() {
  if (controlsContainer.firstChild.hasChildNodes()) {
    // Controls on the left of the player
    var leftControls = controlsContainer.querySelector("[data-testid='vilos-play_pause_button']").parentNode.parentNode; // let rightControls = controlsContainer.querySelector("#settingsControl").parentNode;
    // Move backward button

    var moveBackward = CreateCrpTool('moveBackward', ['crpTools'], 'moveBackward.svg');
    moveBackward.addEventListener("click", function () {
      chrome.runtime.sendMessage({
        type: "time"
      }, function (response) {
        video.currentTime -= ~~response.message;
      });
    }); // Move forward button

    var moveForward = CreateCrpTool('moveForward', ['crpTools'], 'moveForward.svg');
    moveForward.addEventListener("click", function () {
      chrome.runtime.sendMessage({
        type: "time"
      }, function (response) {
        video.currentTime += ~~response.message;
      });
    }); // Sound booster button (https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaElementSource)

    var soundBooster = CreateCrpTool('soundBoosterOff', ['crpTools'], 'soundBoosterOff.svg');
    soundBooster.addEventListener("click", function () {
      var audioCtx = new AudioContext();
      var source = audioCtx.createMediaElementSource(video);
      var gainNode = audioCtx.createGain();
      gainNode.gain.value = 5;
      source.connect(gainNode);
      gainNode.connect(audioCtx.destination);
    }); // Append all CrunchyrollPlus controls

    leftControls.appendChild(moveBackward);
    leftControls.appendChild(moveForward);
    leftControls.appendChild(soundBooster);
  }
} // Create a default CrunchyrollPlus control


function CreateCrpTool(id, classList, imageWithExtension) {
  var _crpTool$classList;

  var crpTool = document.createElement("button");

  (_crpTool$classList = crpTool.classList).add.apply(_crpTool$classList, _toConsumableArray(classList));

  crpTool.id = id;
  crpTool.appendChild(CreateCrpImg("".concat(id, "Img"), imageWithExtension));
  crpTool.addEventListener("click", function (event) {
    event.stopPropagation(); // Prevent click propagation (it would pause/resume the video)
  });
  return crpTool;
} // Create an image (for a CrunchyrollPlus control)


function CreateCrpImg(id, imageWithExtension) {
  var crpImg = document.createElement('img');
  crpImg.id = id;
  crpImg.src = chrome.runtime.getURL("images/controls/".concat(imageWithExtension)); // Requires web_accessible_resources in the manifest

  return crpImg;
} // Messages received from Popup


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("%cMessage received from Popup", "color: #ff0000");

  if (request.type === "moveForward") {
    console.log("Move forward");
    chrome.runtime.sendMessage({
      type: "time"
    }, function (response) {
      video.currentTime += ~~response.message;
    });
  } else if (request.type === "moveBackward") {
    console.log("Move backward");
    chrome.runtime.sendMessage({
      type: "time"
    }, function (response) {
      video.currentTime -= ~~response.message;
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