// Exchange messages between Popup, Content-scripts and Background-script

export default class MessageAPI {

    // Get synced storage from background
    static async getStorage(valueToReturn) {
        return await this.sendToBackground("getStorage", { type: valueToReturn });
    }

    // Send a message to content-scripts through the background
    // -> A content-script cannot communicate directly with another one due to CORS restrictions
    static async sendToContentScripts(type, parameters) {
        return await this.sendToBackground("sendToContentScripts", { type, parameters });
    }

    // Send a message to the background script
    // Type & Parameters are optional
    static async sendToBackground(action, { type, parameters }) {
        return (await chrome.runtime.sendMessage({ action, type, parameters })).response;
    }
};
