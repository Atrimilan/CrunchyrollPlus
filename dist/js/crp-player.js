/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*************************************************!*\
  !*** ./assets/js/content-scripts/crp-player.js ***!
  \*************************************************/
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// Add JQuery to the page
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
document.getElementsByTagName('head')[0].appendChild(script);
chrome.runtime.sendMessage({
  type: "time"
}, function (response) {
  console.log(response.message);
});
waitForElementLoaded('#velocity-controls-package').then(function () {
  ObservePage(); // Observe the page when velocity-controls-package is loaded
}); // It could also be written this way :
// (async () => {
//     await waitForElementLoaded('#velocity-controls-package');
//     ObservePage();
// })();
// Wait for given milliseconds

function delay(time) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, time);
  });
} // Wait for an given element to be loaded - https://stackoverflow.com/a/61511955


function waitForElementLoaded(selector) {
  return new Promise(function (resolve) {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    var observer = new MutationObserver(function (mutations) {
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
  var targetNode = document.getElementById('velocity-controls-package'); // Observed node

  var config = {
    attributes: false,
    childList: true,
    subtree: false
  }; // MutationObserver configuration

  console.log("Page started observing");
  var pageObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (!videoPlayerLoaded) {
        // If the video player is not loaded...
        var _iterator = _createForOfIteratorHelper(mutation.addedNodes),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var node = _step.value;

            if (node.id == "vilosControlsContainer") {
              // ...check if it is added...
              videoPlayerLoaded = true;
              ObserveVideoPlayer();
              console.log("Video player found");
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      } else {
        // If the video player is loaded...
        var _iterator2 = _createForOfIteratorHelper(mutation.removedNodes),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _node = _step2.value;

            if (_node.id == "vilosControlsContainer") {
              // ...check if it is removed...
              videoPlayerObserver.disconnect(); // ...and stop observing it if it is

              videoPlayerLoaded = false;
              console.log("Player video destroyed");
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    });
  });
  pageObserver.observe(targetNode, config); // Start observation, to stop use "pageObserver.disconnect();"
}

function ObserveVideoPlayer() {
  var targetNode = document.getElementById('vilosControlsContainer'); // Observed node

  var config = {
    attributes: false,
    childList: true,
    subtree: false
  }; // MutationObserver configuration

  videoPlayerObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type == 'childList') {
        var _iterator3 = _createForOfIteratorHelper(mutation.addedNodes),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var node = _step3.value;

            if (node.className == "css-1dbjc4n r-r3j1r2 r-13awgt0") {
              // On destroy, Crunchyroll creates a node with className "css-1dbjc4n r-rx5rfo r-13awgt0" (not the same name !)
              var div = document.createElement("div");
              div.classList.add('crpPlayer');
              div.id = 'crunchyrollPlusDiv';
              var menu = document.getElementsByClassName('css-1dbjc4n r-1awozwy r-18u37iz');

              var _iterator4 = _createForOfIteratorHelper(menu),
                  _step4;

              try {
                for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                  var el = _step4.value;

                  if (el.className == "css-1dbjc4n r-1awozwy r-18u37iz") {
                    el.appendChild(div);
                  }
                }
              } catch (err) {
                _iterator4.e(err);
              } finally {
                _iterator4.f();
              }
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
    });
  }); // Crunchyroll seems to instanciate and destroy the video player multiple time, so we need to check if it still exists
  // Otherwise, we would get multiple observer on the same node

  if (document.getElementById('vilosControlsContainer')) {
    videoPlayerObserver.observe(targetNode, config); // Start observation, to stop use "observer.disconnect();"
  }
}

delay(1000).then(function () {
  console.clear();
  var color = '#f47521';
  console.log("%cCrunchyroll PLUS", "color: ".concat(color));
});
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
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
/******/ })()
;