// Opening skipper when a silent time is long enough for an opening
// Default opening duration: 90seconds (can be changed in the Popup)

var crpSkipper, timer;

export default class Skipper {
    constructor(index, parentNode) {

        crpSkipper = document.createElement('div');
        crpSkipper.id = "crpSkipper_" + index;
        crpSkipper.className = "crpSkipper";

        var text = document.createElement('p');
        text.innerText = chrome.i18n.getMessage("player_openingSkipper"); // Get translated text from locales
        text.className = "crpSkipperText";

        timer = document.createElement('p');
        timer.id = "crpSkipperTimer_" + index;
        timer.className = "crpSkipperTimer";

        crpSkipper.appendChild(text);
        crpSkipper.appendChild(timer);
        parentNode.appendChild(crpSkipper);
    }

    get crpSkipper() { return crpSkipper; }
    get timer() { return timer; }
}; 