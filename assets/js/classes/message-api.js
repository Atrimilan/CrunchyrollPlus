// Exchange messages between Popup, Content-scripts and Background-script

export default class MessageAPI {

    // Get synced storage from background
    static async getStorage(type) {
        return (await chrome.runtime.sendMessage({ action: "getStorage", type })).response;
    }

    // Send a message to content-scripts through the background
    // -> A content-script cannot communicate directly with another one due to CORS restrictions
    static async sendToContentScripts(type, parameters) {
        return (await chrome.runtime.sendMessage({ action: "sendToContentScripts", type, parameters })).response;
    }
};
