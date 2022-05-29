
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get((result) => { console.log(result); });  // Print existing storage data
    InitStorage();
});

function InitStorage(){
    chrome.storage.sync.get((result) => {
        chrome.storage.sync.set({ time: (result.time === undefined) ? 15 : result.time });  // Set default time = 15 if not set
    });
}

function ClearStorage(){
    chrome.storage.sync.clear();
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        
        console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");

        if (request.type === "time") {
            chrome.storage.sync.get(['time'], (result) => {
                console.log("Get time : " + result.time + " seconds");
                sendResponse({ message: result.time });
            });
            return true;    // Must write this, otherwise "Unchecked runtime.lastError: The message port closed before a response was received."
        }
        else {
            sendResponse({ message: null });    // If the request type is unknown, return null
            return true;
        }
    }
);