
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get((result) => { console.log(result); });  // Log existing storage data to the console
    InitStorage();
});

// Initialize default storage settings
async function InitStorage() {
    const result = await chrome.storage.sync.get();
    chrome.storage.sync.set({   // Set a default value if not set yet
        'moveForwardTime': (result.moveForwardTime === undefined) ? 5 : result.moveForwardTime,   // Time to move forward
        'moveBackwardTime': (result.moveBackwardTime === undefined) ? 5 : result.moveBackwardTime,    // Time to move backward
        'themeColor': (result.themeColor === undefined) ? "#f47521" : result.themeColor,  // Set website theme color
        'blurredThumbnails': (result.blurredThumbnails === undefined) ? true : result.blurredThumbnails, // Blur episode thumbnails
        'showPlayerThumbnail': (result.blurredThumbnails === undefined) ? true : result.showPlayerThumbnail,  // Progress bar thumbnail
        'avatarFavicon': (result.avatarFavicon === undefined) ? false : result.avatarFavicon, // Use avatar as favicon
        'soundMultiplier': (result.soundMultiplier === undefined) ? 10 : result.soundMultiplier,   // Increase video player's sound
        'crpOpeningSkipper': (result.crpOpeningSkipper === undefined) ? true : result.crpOpeningSkipper,  // Use CRP opening skipper
        'openingDuration': (result.openingDuration === undefined) ? 90 : result.openingDuration,   // Opening duration to skip (1:30 here)
        'crpSkipper': (result.crpSkipper === undefined) ? { enabled: true, openingDuration: 90 } : result.crpSkipper,
    });
}

function ResetStorage() {
    chrome.storage.sync.clear();
    InitStorage();
}

// Listen for messages from popup or content-script, and return the corresponding result
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

        const { action, type, parameters } = request;

        switch (action) {

            // Generic functions from message-api.js
            case "getStorage":
                chrome.storage.sync.get([type], (result) => { sendResponse({ response: result[type] }) });
                break;
            case "sendToContentScripts":
                chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
                    sendResponse(await chrome.tabs.sendMessage(tabs[0].id, { type, parameters }));
                });
                break;

            // Other specific actions
            case "resetStorage":
                ResetStorage();
                break;
            case "downloadFile":
                chrome.downloads.download({ url, filename } = parameters);
                break;

            case "getOpeningTimes":
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { type: "getOpeningTimes", videoDuration: request.videoDuration });
                });
                break;
            case "definePlayerOpenings":
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { type: "definePlayerOpenings", openingTimes: request.openingTimes });
                });
                break;

            default:
                sendResponse({ message: null });    // If the request type is unknown, return null
        }
        return true;    // Tell Chrome that response is sent asynchronously
    }
);