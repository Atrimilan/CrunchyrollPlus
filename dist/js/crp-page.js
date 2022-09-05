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
}, false);
var blurredThumbnailStyle = null; // Messages received from Popup

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "showThumbnails") {
    document.getElementById('blurredThumbnailStyle').remove();
  } else if (request.type === "hideThumbnails") {
    if (blurredThumbnailStyle == null) {
      InitThumbnailBlurrer();
    }

    document.getElementsByTagName('head')[0].appendChild(blurredThumbnailStyle);
  } else {
    console.log(null);
  }
}); // Create CSS style to blur images

function InitThumbnailBlurrer() {
  blurredThumbnailStyle = document.createElement('style');
  blurredThumbnailStyle.id = "blurredThumbnailStyle";
  blurredThumbnailStyle.innerHTML = ".prev-next-episodes img,.episode-list img,.erc-up-next-section img {\n        filter: blur(20px);\n        -webkit-filter: blur(20px);\n        -moz-filter: blur(20px);\n        -o-filter: blur(20px);\n        -ms-filter: blur(20px);\n    }";
}
/******/ })()
;