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
var themeColorStyle = CreateStyleElement("themeColorStyle"); // Create style element and add it to the DOM

function CreateStyleElement(id) {
  var myStyle = document.createElement('style');
  myStyle.id = id;
  document.getElementsByTagName('head')[0].appendChild(myStyle);
  return myStyle;
} // Messages received from Popup


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.type) {
    case "showThumbnails":
      showThumbnails();
      break;

    case "hideThumbnails":
      hideThumbnails();
      break;

    case "themeColorUpdate":
      themeColorUpdate(request.themeColor);
      break;
  }
});
InitPage(); // Load data from the chrome storage, and call needed functions

function InitPage() {
  chrome.runtime.sendMessage({
    type: "blurredThumbnails"
  }, function (response) {
    response.message ? hideThumbnails() : showThumbnails();
  });
  chrome.runtime.sendMessage({
    type: "themeColor"
  }, function (response) {
    themeColorUpdate(response.message);
  });
} // ----------------------------------------------------------//
// Functions called on page initialization and edit in Popup //
// ----------------------------------------------------------//


function hideThumbnails() {
  // CSS to blur images
  blurredThumbnailStyle.innerHTML = "\n    .prev-next-episodes img,.episode-list img,.erc-up-next-section img {\n        filter: blur(20px);\n        -webkit-filter: blur(20px);\n        -moz-filter: blur(20px);\n        -o-filter: blur(20px);\n        -ms-filter: blur(20px);\n    }";
}

function showThumbnails() {
  blurredThumbnailStyle.innerHTML = "";
}

function themeColorUpdate(color) {
  // CSS to change theme color
  // Cannot change the player bar color, because the default color is given in a style="" property
  themeColorStyle.innerHTML = "\n    .erc-logo .logo-icon {\n        fill: ".concat(color, ";\n    }\n    .erc-current-media-info .show-title-link {\n        color: ").concat(color, ";\n    }\n    ::selection {\n        background: #23252b;\n        color: ").concat(color, ";\n    }\n    ");
}
/******/ })()
;