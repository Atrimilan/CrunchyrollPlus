/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
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
}
/******/ })()
;