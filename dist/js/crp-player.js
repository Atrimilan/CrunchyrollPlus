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
var playerParent = null;
var playerObserver = null; // Observer

var controlsContainer = null; // Null for now, because the #vilosControlsContainer div is not loaded yet

var controlsContainerObserver = null; // Observer

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
              //                  console.clear();

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
  }); // Crunchyroll seems to instanciate and destroy the video player multiple time, this will probably need to be revisited later

  if (!!(playerParent = document.getElementById('velocity-controls-package'))) {
    // Get node and check if it is not null
    playerObserver.observe(playerParent, config);
  }
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

    var moveBackward = CreateCrpTool('moveBackward', ['crpTools', "r-1ozmr9b"], 'moveBackward.svg');
    moveBackward.addEventListener("click", function () {
      chrome.runtime.sendMessage({
        type: "moveBackwardTime"
      }, function (response) {
        video.currentTime -= ~~response.message;
      });
    }); // Move forward button

    var moveForward = CreateCrpTool('moveForward', ['crpTools', "r-1ozmr9b"], 'moveForward.svg');
    moveForward.addEventListener("click", function () {
      chrome.runtime.sendMessage({
        type: "moveForwardTime"
      }, function (response) {
        video.currentTime += ~~response.message;
      });
    }); // Sound booster button (https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaElementSource)

    var soundBooster = CreateCrpTool('soundBoosterOff', ['crpTools', "r-1ozmr9b"], soundBoosterEnabled ? 'soundBoosterOn.svg' : 'soundBoosterOff.svg');
    soundBooster.addEventListener("click", function () {
      if (!soundBoosterInitialized) {
        InitSoundBooster();
      }

      if (!soundBoosterEnabled) {
        // If disabled, boost gain with stored sound multiplier
        chrome.runtime.sendMessage({
          type: "soundMultiplier"
        }, function (response) {
          gainNode.gain.value = 1 + response.message / 10;
          soundBoosterEnabled = true;
          soundBooster.firstChild.src = chrome.runtime.getURL("images/controls/soundBoosterOn.svg");
        });
      } else {
        // If enabled, set gain value to 1
        gainNode.gain.value = 1;
        soundBoosterEnabled = false;
        soundBooster.firstChild.src = chrome.runtime.getURL("images/controls/soundBoosterOff.svg");
      }
    }); // Append all CrunchyrollPlus controls

    leftControls.appendChild(moveBackward);
    leftControls.appendChild(moveForward);
    leftControls.appendChild(soundBooster); // Change playbar color to the stored theme color

    chrome.runtime.sendMessage({
      type: "themeColor"
    }, function (response) {
      if (!!response.message) {
        changePlayBarColor(response.message);
      }
    });
  }
}

var soundBoosterInitialized = false,
    soundBoosterEnabled = false;
var audioCtx = null,
    gainNode = null,
    source = null; // Initialize sound booster variables

function InitSoundBooster() {
  audioCtx = new AudioContext();
  source = audioCtx.createMediaElementSource(video);
  gainNode = audioCtx.createGain();
  gainNode.gain.value = 1;
  source.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  soundBoosterInitialized = true;
} // Change the playbar color (watched time bar and reticle)


function changePlayBarColor(themeColor) {
  var playerPointer = document.querySelector('div[data-testid="vilos-knob"]');
  playerPointer.style.visibility = "hidden";
  var crpPointer = document.createElement('div');
  crpPointer.id = "crpPointer";
  crpPointer.style.backgroundColor = themeColor;
  playerPointer.appendChild(crpPointer);
  var watchedTime = document.querySelector('div[data-testid="vilos-scrub_bar"]').children[0].children[0].children[0].children[1].children[0].children[0]; // They should hire someone to add ids wherever they are missing !

  watchedTime.style.visibility = "hidden";
  var crpWatchedTime = document.createElement('div');
  crpWatchedTime.id = "crpWatchedTime";
  crpWatchedTime.style.backgroundColor = themeColor;
  watchedTime.appendChild(crpWatchedTime); // playerPointer and watchedTime "style" properties cannot be changed because it is automatically updated by the player
  // This is why child nodes are created, while their parent's visibility is set to "hidden"
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
  switch (request.type) {
    case "togglePlayerThumbnail":
      togglePlayerThumbnail(request.state);
      break;
  }
}); // Load data from the chrome storage, and call needed functions

(function InitPage() {
  chrome.runtime.sendMessage({
    type: "showPlayerThumbnail"
  }, function (response) {
    togglePlayerThumbnail(response.message);
  });
})();

var playerThumbnailStyle = CreateStyleElement("playerThumbnailStyle"); // Create style element and add it to the DOM

function CreateStyleElement(id) {
  var myStyle = document.createElement('style');
  myStyle.id = id;
  document.getElementsByTagName('head')[0].appendChild(myStyle);
  return myStyle;
}

function togglePlayerThumbnail(state) {
  if (state) {
    // CSS to hide the progress bar thumbnail
    playerThumbnailStyle.innerHTML = "\n        div[class=\"css-1dbjc4n r-1awozwy r-1777fci\"] {\n            visibility: hidden;\n        }";
  } else {
    playerThumbnailStyle.innerHTML = "";
  }
}
/*
// Wait for given milliseconds
// USE : delay(1000).then(() => { ... });
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
*/
// Change loading spinner color to the stored theme color


var loadSpinner = document.querySelectorAll('div[data-testid="vilos-loading"] path');

(function setLoadingSpinnerColor() {
  chrome.runtime.sendMessage({
    type: "themeColor"
  }, function (response) {
    if (!!response.message) {
      loadSpinner.forEach(function (element) {
        element.style.stroke = response.message;
      });
    }
  });
})();
/******/ })()
;