
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get((result) => { console.log(result); });  // Log existing storage data to the console
    InitStorage();
});

// Initialize default storage settings
function InitStorage() {
    chrome.storage.sync.get((result) => {
        chrome.storage.sync.set({   // Set a default value if not set yet
            moveForwardTime: (result.moveForwardTime === undefined) ? 5 : result.moveForwardTime,
            moveBackwardTime: (result.moveBackwardTime === undefined) ? 5 : result.moveBackwardTime,
            themeColor: (result.themeColor === undefined) ? "#f47521" : result.themeColor,
            blurredThumbnails: (result.blurredThumbnails === undefined) ? false : result.blurredThumbnails,
        });
    });
}

/*function ResetStorage() {
    chrome.storage.sync.clear();
    InitStorage();
}
ResetStorage();*/

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
            default:
                sendResponse({ message: null });    // If the request type is unknown, return null
        }
        return true;    // Must return true, otherwise "Unchecked runtime.lastError: The message port closed before a response was received."
    }
);