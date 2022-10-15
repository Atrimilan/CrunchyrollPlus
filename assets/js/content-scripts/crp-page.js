import MessageAPI from '../classes/message-api.js';
import API from '../classes/crp-api.js';
import PageStyle from '../classes/page-style.js';

// Keyboard input events listener
document.addEventListener('keydown', async (event) => {
    var name = event.key;
    var code = event.code;
    switch (name) { // Temporary development shortcuts
        case "c":
            console.clear(); break;
        case "s":
            timeout = setTimeout(() => { debugger; }, 0); break;
        case "t":
            const openingDuration = await MessageAPI.getStorage("openingDuration");
            const res = await API.OPENINGS(1420, openingDuration); console.log(res);
    }
}, false);

/* 
 * Initialize CrunchyrollPlus
 * Load data from the chrome storage
 */
(async function InitPage() {
    PageStyle.set("toggleThumbnails", {
        state: await MessageAPI.getStorage("blurredThumbnails")
    });
    PageStyle.set("toggleAvatarFavicon", {
        themeColorStyle,
        state: await MessageAPI.getStorage("avatarFavicon")
    });
    PageStyle.set("updateThemeColor", {
        themeColorStyle,
        color: await MessageAPI.getStorage("themeColor")
    });
})();

/*
 * Listen for background-script messages
 */
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        const { type, parameters } = request;

        switch (type) {
            case "toggleThumbnails":
                PageStyle.set("toggleThumbnails", { state: parameters.state });
                break;
            case "toggleAvatarFavicon":
                PageStyle.set("toggleAvatarFavicon", { state: parameters.state });
                break;
            case "themeColorUpdate":
                PageStyle.set("updateThemeColor", { themeColorStyle, color: parameters.themeColor });
                break;
            case "downloadSubtitles":
                API.SUBTITLES.then((subtitles) => { downloadFile(subtitles.url, `subtitles.${subtitles.format}`); });
                break;
            case "detectOpenings":
                detectOpenings(parameters, sendResponse);   // Pass the sendResponse callback as parameter
                break;
        }
        return true;    // Tell Chrome that response is sent asynchronously
    }
);

// File can only be downloaded from the background script
// -> File format seems not working for security reasons
function downloadFile(url, filename) {
    MessageAPI.sendToBackground("downloadFile", { parameters: { url, filename } })
}

async function detectOpenings({ openingDuration, videoDuration }, sendResponse) {
    const openings = await API.OPENINGS(videoDuration, openingDuration);
    sendResponse({ response: openings });
}