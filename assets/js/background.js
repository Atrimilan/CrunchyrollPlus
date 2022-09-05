
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get((result) => { console.log(result); });  // Print existing storage data
    InitStorage();
});

// Initialize default storage settings
function InitStorage() {
    chrome.storage.sync.get((result) => {
        chrome.storage.sync.set({
            time: (result.time === undefined) ? 5 : result.time,    // Set default time = 5 if not set
            themeColor: (result.themeColor === undefined) ? "#f47521" : result.themeColor,
            blurredThumbnails: (result.blurredThumbnails === undefined) ? false : result.blurredThumbnails,
        });
    });
}

function ClearStorage() {
    chrome.storage.sync.clear();
}

// Listen for messages from popup or content-script, and return the corresponding result
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");

        if (request.type === "time") {
            chrome.storage.sync.get(['time'], (result) => {
                //console.log("Get time : " + result.time + " seconds");
                sendResponse({ message: result.time });
            });
            return true;    // Must write this, otherwise "Unchecked runtime.lastError: The message port closed before a response was received."
        }
        else if (request.type === "themeColor") {
            chrome.storage.sync.get(['themeColor'], (result) => { sendResponse({ message: result.themeColor }); });
            return true;
        }
        else {
            sendResponse({ message: null });    // If the request type is unknown, return null
            return true;
        }
    }
);