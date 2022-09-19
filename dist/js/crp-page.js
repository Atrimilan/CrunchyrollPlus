/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/js/classes/crp-api.js":
/*!**************************************!*\
  !*** ./assets/js/classes/crp-api.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ API)
/* harmony export */ });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/* Inspired by https://github.com/ThomasTavernier/Improve-Crunchyroll, by Thomas Tavernier (...but more readable to me 😅) */
var API = /*#__PURE__*/function () {
  function API() {
    _classCallCheck(this, API);
  }

  _createClass(API, null, [{
    key: "TOKEN",
    get: function get() {
      var cxApiParams = fetch(window.location.href).then(function (response) {
        return response.text();
      }).then(function (text) {
        var initialState = JSON.parse(text.match(/(?<=window.__INITIAL_STATE__ = ){.*}/)[0]);
        var locale = initialState.localization.locale;
        var appConfig = JSON.parse(text.match(/(?<=window.__APP_CONFIG__ = ){.*}/)[0]);
        var accountAuthClientId = appConfig.cxApiParams.accountAuthClientId;
        var apiDomain = appConfig.cxApiParams.apiDomain;
        return {
          apiDomain: apiDomain,
          accountAuthClientId: accountAuthClientId,
          locale: locale
        };
      })["catch"](function (error) {
        console.log("%cCannot get cxApiParams", 'color:red;font-weight:bold');
      });
      var token = cxApiParams.then(function (_ref) {
        var apiDomain = _ref.apiDomain,
            accountAuthClientId = _ref.accountAuthClientId,
            locale = _ref.locale;
        return fetch("".concat(apiDomain, "/auth/v1/token"), {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            // OAuth2 content type
            'Authorization': "Basic ".concat(window.btoa("".concat(accountAuthClientId, ":"))) // User ID encrypted in Base64

          },
          body: 'grant_type=etp_rt_cookie' // This cookie is required

        }).then(function (response) {
          return response.json();
        }).then(function (_ref2) {
          var token_type = _ref2.token_type,
              access_token = _ref2.access_token,
              expires_in = _ref2.expires_in;
          return {
            'Authorization': "".concat(token_type, " ").concat(access_token),
            apiDomain: apiDomain,
            locale: locale
          };
        })["catch"](function (error) {
          console.log("%cCannot get access_token", 'color:red;font-weight:bold');
        });
      });
      return token;
    }
  }, {
    key: "CMS",
    get: function get() {
      var cms = this.TOKEN.then(function (_ref3) {
        var Authorization = _ref3.Authorization,
            apiDomain = _ref3.apiDomain,
            locale = _ref3.locale;
        return fetch("".concat(apiDomain, "/index/v2"), {
          headers: {
            Authorization: Authorization
          }
        }).then(function (response) {
          return response.json();
        }).then(function (_ref4) {
          var _ref4$cms_beta = _ref4.cms_beta,
              bucket = _ref4$cms_beta.bucket,
              signature = _ref4$cms_beta.signature,
              policy = _ref4$cms_beta.policy,
              key_pair_id = _ref4$cms_beta.key_pair_id;
          return {
            apiDomain: apiDomain,
            bucket: bucket,
            searchParams: {
              locale: locale,
              Signature: signature,
              Policy: policy,
              'Key-Pair-Id': key_pair_id
            }
          };
        })["catch"](function (error) {
          console.log("%cCannot get cms_beta", 'color:red;font-weight:bold');
        });
      }).then(function (response) {
        return response;
      });
      return cms;
    }
  }, {
    key: "EPISODE",
    get: function get() {
      var episodeData = this.CMS.then(function (_ref5) {
        var apiDomain = _ref5.apiDomain,
            bucket = _ref5.bucket,
            sP = _ref5.searchParams;
        var sp = window.location.pathname.split('/'); // Split "<locale>/watch/<EPISODEID>/"

        var episodeId = sp[sp.length - 2]; // Extract the episode ID

        return fetch("".concat(apiDomain, "/cms/v2").concat(bucket, "/objects/").concat(episodeId, "?locale=").concat(sP.locale, "&Signature=").concat(sP.Signature, "&Policy=").concat(sP.Policy, "&Key-Pair-Id=").concat(sP['Key-Pair-Id'])).then(function (response) {
          return response.json();
        }).then(function (_ref6) {
          var items = _ref6.items;
          return {
            items: items[0],
            apiDomain: apiDomain,
            bucket: bucket,
            sP: sP
          };
        })["catch"](function (error) {
          console.log("%cCannot get current episode data", 'color:red;font-weight:bold');
        });
      }).then(function (response) {
        return response;
      });
      return episodeData;
    }
  }, {
    key: "STREAM",
    get: function get() {
      // We need to get the Episode first, to extract the Stream ID
      var streamData = this.EPISODE.then(function (_ref7) {
        var items = _ref7.items,
            apiDomain = _ref7.apiDomain,
            bucket = _ref7.bucket,
            sP = _ref7.sP;

        var sp2 = items.__links__.streams.href.split('/'); // Split ":/cms/v2/<bucket>/videos/<STREAMID>/streams


        var streamId = sp2[sp2.length - 2]; // Extract the streamId ID

        /* It would be nice to find the Stream ID in another way */

        return fetch("".concat(apiDomain, "/cms/v2").concat(bucket, "/videos/").concat(streamId, "/streams?\n            locale=").concat(sP.locale, "&Signature=").concat(sP.Signature, "&Policy=").concat(sP.Policy, "&Key-Pair-Id=").concat(sP['Key-Pair-Id'])).then(function (response) {
          return response.json();
        }).then(function (response) {
          return {
            stream: response,
            subtitleLocaleKey: sP.locale
          };
        })["catch"](function (error) {
          console.log("%cCannot get current episode data", 'color:red;font-weight:bold');
        });
      }).then(function (response) {
        return response;
      });
      return streamData;
    }
  }, {
    key: "SUBTITLES",
    get: function get() {
      var subtitles = this.STREAM.then(function (_ref8) {
        var stream = _ref8.stream,
            subtitleLocaleKey = _ref8.subtitleLocaleKey;
        return stream.subtitles[subtitleLocaleKey]; // Locale identifier is used as a JSON key ("subtitleLocaleKey" here)
      }).then(function (_ref9) {
        var format = _ref9.format,
            locale = _ref9.locale,
            url = _ref9.url;
        return {
          format: format,
          locale: locale,
          url: url
        };
      });
      return subtitles;
    }
  }]);

  return API;
}();



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
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
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
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***********************************************!*\
  !*** ./assets/js/content-scripts/crp-page.js ***!
  \***********************************************/
// Keyboard input events listener
document.addEventListener('keydown', function (event) {
  var name = event.key;
  var code = event.code;

  switch (name) {
    case "c":
      console.clear(); // Clear the console

      break;

    case "s":
      timeout = setTimeout(function () {
        debugger;
      }, 0); // Pause page after 0 ms

      break;

    case "t":
      // Test API
      var API = __webpack_require__(/*! ../classes/crp-api.js */ "./assets/js/classes/crp-api.js");

      API["default"].CMS.then(function (response) {
        console.log(response);
      });
  }
}, false); // ----------------------------------------------------------------------------------------------------

var blurredThumbnailStyle = CreateStyleElement("blurredThumbnailStyle");
var themeColorStyle = CreateStyleElement("themeColorStyle");
var favicons = null;
var userAvatar = null; // Create style element and add it to the DOM

function CreateStyleElement(id) {
  var myStyle = document.createElement('style');
  myStyle.id = id;
  document.getElementsByTagName('head')[0].appendChild(myStyle);
  return myStyle;
} // Messages received from Popup


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.type) {
    case "toggleThumbnails":
      toggleThumbnails(request.state);
      break;

    case "themeColorUpdate":
      themeColorUpdate(request.themeColor);
      break;

    case "toggleAvatarFavicon":
      toggleAvatarFavicon(request.state);
      break;

    case "downloadSubtitles":
      var API = __webpack_require__(/*! ../classes/crp-api.js */ "./assets/js/classes/crp-api.js");

      API["default"].SUBTITLES.then(function (subtitles) {
        downloadFile(subtitles.url, "subtitles.".concat(subtitles.format));
      });
      break;
  }
}); // Load data from the chrome storage, and call needed functions

(function InitPage() {
  chrome.runtime.sendMessage({
    type: "blurredThumbnails"
  }, function (response) {
    toggleThumbnails(response.message);
  });
  chrome.runtime.sendMessage({
    type: "themeColor"
  }, function (response) {
    themeColorUpdate(response.message);
  });
  chrome.runtime.sendMessage({
    type: "avatarFavicon"
  }, function (response) {
    toggleAvatarFavicon(response.message);
  });
})(); // ----------------------------------------------------------//
// Functions called on page initialization and edit in Popup //
// ----------------------------------------------------------//


function toggleThumbnails(state) {
  if (state) {
    // CSS to blur images
    blurredThumbnailStyle.innerHTML = "\n        .prev-next-episodes img,.episode-list img,.erc-up-next-section img {\n            filter: blur(20px);\n            -webkit-filter: blur(20px);\n            -moz-filter: blur(20px);\n            -o-filter: blur(20px);\n            -ms-filter: blur(20px);\n        }";
  } else {
    blurredThumbnailStyle.innerHTML = "";
  }
}

function themeColorUpdate(color) {
  // CSS to change theme color
  // Cannot change the player bar color, because the default color is given in a style="" property
  themeColorStyle.innerHTML = "\n    .erc-logo .logo-icon {\n        fill: ".concat(color, ";\n    }\n    ::selection,\n    .erc-current-media-info .show-title-link,\n    .info-tag--is-six--oJ2yw,\n    svg[data-t=\"loader-svg\"] > path,\n    .erc-user-menu-nav-item.state-active,\n    .navigation-link.state-active > span,\n    .erc-menu-item-title.state-active,\n    .submenu-item-title.state-active > h5,\n    .activate-device-nav-link > span,\n    .button--is-type-one-weak--KLvCX {\n        color: ").concat(color, ";\n    }\n    .progress-bar__progress--PhR3h,\n    .button--is-type-one--3uIzT,\n    .tabs-item--is-active--66UFY:after,\n    .carousel-tabs__tab--is-active--OWPNm > div:before {\n        background-color: ").concat(color, ";\n    }\n    .button--is-type-one--3uIzT:hover {\n        background-color: ").concat(increaseBrightness(color, 20), ";\n    }\n    .button--is-type-one-weak--KLvCX:hover {\n        color: ").concat(increaseBrightness(color, 20), ";\n    } \n    ");
  /* Home gradient lines :
  .feed-divider--is-even--dCcSs {
      background-image: linear-gradient(to var(--cr-start-direction),${increaseBrightness(color, 75)},${color});
  }
  */
  // https://stackoverflow.com/a/33385707

  function increaseBrightness(color, percent) {
    var ctx = document.createElement('canvas').getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    var color = ctx.getImageData(0, 0, 1, 1);
    var r = color.data[0] + Math.floor(percent / 100 * 255);
    var g = color.data[1] + Math.floor(percent / 100 * 255);
    var b = color.data[2] + Math.floor(percent / 100 * 255);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }
}

function toggleAvatarFavicon(state) {
  // Init favicon nodes
  if (favicons == null) {
    favicons = document.querySelectorAll('link[rel][type="image/png"]');
  }

  if (state) {
    // Init user avatar asynchronously
    if (userAvatar == null) {
      waitForElementLoaded('div[class="erc-header-avatar"] img[class="content-image__image--7tGlg"]').then(function (myImg) {
        userAvatar = myImg.src; // Then set user avatar as favicon

        favicons.forEach(function (favicon) {
          favicon.href = userAvatar;
        });
      });
    } else {
      // Set user avatar as favicon
      favicons.forEach(function (favicon) {
        favicon.href = userAvatar;
      });
    }
  } else {
    // Set default favicon
    favicons.forEach(function (favicon) {
      favicon.href = "https://static.crunchyroll.com/cxweb/assets/img/favicons/favicon-".concat(favicon.sizes, ".png");
    });
  }
} // Promise for document.querySelector(selector) : https://stackoverflow.com/a/61511955


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
} // File can only be downloaded from the background script 


function downloadFile(url, filename) {
  chrome.runtime.sendMessage({
    type: "downloadFile",
    url: url,
    filename: filename
  }); // But format seems not working for security reasons
}
})();

/******/ })()
;