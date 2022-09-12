
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get((result) => { console.log(result); });  // Log existing storage data to the console
    //ResetStorage();
    InitStorage();
});

// Initialize default storage settings
function InitStorage() {
    chrome.storage.sync.get((result) => {
        chrome.storage.sync.set({   // Set a default value if not set yet
            moveForwardTime: (result.moveForwardTime === undefined) ? 5 : result.moveForwardTime,   // Time to move forward
            moveBackwardTime: (result.moveBackwardTime === undefined) ? 5 : result.moveBackwardTime,    // Time to move backward
            themeColor: (result.themeColor === undefined) ? "#f47521" : result.themeColor,  // Set website theme color
            blurredThumbnails: (result.blurredThumbnails === undefined) ? false : result.blurredThumbnails, // Blur episode thumbnails
            avatarFavicon: (result.avatarFavicon === undefined) ? false : result.avatarFavicon, // Use avatar as favicon
            soundMultiplier: (result.soundMultiplier === undefined) ? 10 : result.soundMultiplier,   // Increase video player's sound
            openingDuration: (result.openingDuration === undefined) ? 85 : result.openingDuration,   // Opening duration to skip
        });
    });
}

function ResetStorage() {
    chrome.storage.sync.clear();
}

// Listen for messages from popup or content-script, and return the corresponding result
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.type) {
            case "moveForwardTime":
                chrome.storage.sync.get(['moveForwardTime'], (result) => { sendResponse({ message: result.moveForwardTime }); });
                break;
            case "moveBackwardTime":
                chrome.storage.sync.get(['moveBackwardTime'], (result) => { sendResponse({ message: result.moveBackwardTime }); });
                break;
            case "themeColor":
                chrome.storage.sync.get(['themeColor'], (result) => { sendResponse({ message: result.themeColor }); });
                break;
            case "blurredThumbnails":
                chrome.storage.sync.get(['blurredThumbnails'], (result) => { sendResponse({ message: result.blurredThumbnails }); });
                break;
            case "avatarFavicon":
                chrome.storage.sync.get(['avatarFavicon'], (result) => { sendResponse({ message: result.avatarFavicon }); });
                break;
            case "soundMultiplier":
                chrome.storage.sync.get(['soundMultiplier'], (result) => { sendResponse({ message: result.soundMultiplier }); });
                break;
            case "openingDuration":
                chrome.storage.sync.get(['openingDuration'], (result) => { sendResponse({ message: result.openingDuration }); });
                break;
            default:
                sendResponse({ message: null });    // If the request type is unknown, return null
        }
        return true;    // Must return true, otherwise "Unchecked runtime.lastError: The message port closed before a response was received."
    }
);