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
      setTimeout(function () {
        debugger;
      }, 0); // Pause page after 0 ms

      break;
  }
}, false);
/******/ })()
;