/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/js/background.js":
/*!*********************************!*\
  !*** ./assets/js/background.js ***!
  \*********************************/
/***/ (() => {

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.get(function (result) {
    console.log(result);
  }); // Log existing storage data to the console

  InitStorage();
}); // Initialize default storage settings

function InitStorage() {
  chrome.storage.sync.get(function (result) {
    chrome.storage.sync.set({
      // Set a default value if not set yet
      moveForwardTime: result.moveForwardTime === undefined ? 5 : result.moveForwardTime,
      // Time to move forward
      moveBackwardTime: result.moveBackwardTime === undefined ? 5 : result.moveBackwardTime,
      // Time to move backward
      themeColor: result.themeColor === undefined ? "#f47521" : result.themeColor,
      // Set website theme color
      blurredThumbnails: result.blurredThumbnails === undefined ? true : result.blurredThumbnails,
      // Blur episode thumbnails
      showPlayerThumbnail: result.blurredThumbnails === undefined ? true : result.showPlayerThumbnail,
      // Progress bar thumbnail
      avatarFavicon: result.avatarFavicon === undefined ? false : result.avatarFavicon,
      // Use avatar as favicon
      soundMultiplier: result.soundMultiplier === undefined ? 10 : result.soundMultiplier,
      // Increase video player's sound
      openingDuration: result.openingDuration === undefined ? 85 : result.openingDuration // Opening duration to skip (1:25 here)

    });
  });
}

function ResetStorage() {
  chrome.storage.sync.clear();
  InitStorage();
} // Listen for messages from popup or content-script, and return the corresponding result


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.type) {
    case "moveForwardTime":
      chrome.storage.sync.get(['moveForwardTime'], function (result) {
        sendResponse({
          message: result.moveForwardTime
        });
      });
      break;

    case "moveBackwardTime":
      chrome.storage.sync.get(['moveBackwardTime'], function (result) {
        sendResponse({
          message: result.moveBackwardTime
        });
      });
      break;

    case "themeColor":
      chrome.storage.sync.get(['themeColor'], function (result) {
        sendResponse({
          message: result.themeColor
        });
      });
      break;

    case "blurredThumbnails":
      chrome.storage.sync.get(['blurredThumbnails'], function (result) {
        sendResponse({
          message: result.blurredThumbnails
        });
      });
      break;

    case "showPlayerThumbnail":
      chrome.storage.sync.get(['showPlayerThumbnail'], function (result) {
        sendResponse({
          message: result.showPlayerThumbnail
        });
      });
      break;

    case "avatarFavicon":
      chrome.storage.sync.get(['avatarFavicon'], function (result) {
        sendResponse({
          message: result.avatarFavicon
        });
      });
      break;

    case "soundMultiplier":
      chrome.storage.sync.get(['soundMultiplier'], function (result) {
        sendResponse({
          message: result.soundMultiplier
        });
      });
      break;

    case "openingDuration":
      chrome.storage.sync.get(['openingDuration'], function (result) {
        sendResponse({
          message: result.openingDuration
        });
      });
      break;

    case "resetConfig":
      ResetStorage();
      console.log("CLEAR");
      break;

    default:
      sendResponse({
        message: null
      });
    // If the request type is unknown, return null
  }

  return true; // Must return true, otherwise "Unchecked runtime.lastError: The message port closed before a response was received."
});

/***/ }),

/***/ "./assets/sass/default_popup.scss":
/*!****************************************!*\
  !*** ./assets/sass/default_popup.scss ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./assets/sass/crp-player.scss":
/*!*************************************!*\
  !*** ./assets/sass/crp-player.scss ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./assets/sass/crp-page.scss":
/*!***********************************!*\
  !*** ./assets/sass/crp-page.scss ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/dist/js/background": 0,
/******/ 			"dist/css/crp-page": 0,
/******/ 			"dist/css/crp-player": 0,
/******/ 			"dist/css/default_popup": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["dist/css/crp-page","dist/css/crp-player","dist/css/default_popup"], () => (__webpack_require__("./assets/js/background.js")))
/******/ 	__webpack_require__.O(undefined, ["dist/css/crp-page","dist/css/crp-player","dist/css/default_popup"], () => (__webpack_require__("./assets/sass/default_popup.scss")))
/******/ 	__webpack_require__.O(undefined, ["dist/css/crp-page","dist/css/crp-player","dist/css/default_popup"], () => (__webpack_require__("./assets/sass/crp-player.scss")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["dist/css/crp-page","dist/css/crp-player","dist/css/default_popup"], () => (__webpack_require__("./assets/sass/crp-page.scss")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;