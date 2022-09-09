<template>
<div class="popup">
    <header>
        <img src="images/icons/crp_icon_128.png" alt="CrunchyrollPlus icon" class="icon" />
        <img src="images/icons/crp_logo_512.png" alt="CrunchyrollPlus logo" class="logo" />
    </header>

    
    <div class="wrapper">
        <h1 class="crp_h1">Hello</h1>
        <p class="crp_text">This is a test.</p>
        <p class="crp_text">And a second one.</p>

        <table>
        <tbody>
        <tr>
        <td><ColorInput :color=themeColor @selected="themeColorSelected($event)" @isChoosing="themeColorChoosing($event)" /></td>
        <td><SwitchButton :isChecked=blurringState @switched="toggleBlurring($event)" /></td>
        <td><SwitchButton :isChecked=avatarFaviconState @switched="toggleAvatarFavicon($event)" /></td>
        </tr>
        </tbody>
        </table>
        
    </div>

    <footer>
        <div id="footer-text">
            <a id="github-link" target="_blank" href="https://github.com/Atrimilan/CrunchyrollPlus">GitHub</a>
            <a id="author" target="_blank" href="https://github.com/Atrimilan/CrunchyrollPlus">Milan NICOLAS</a>
        </div>
    </footer>
</div>
</template>

<script>
import ColorInput from "./ColorInput.vue";
import SwitchButton from "./SwitchButton.vue";
export default {
    name: "MainPopup",
    components: {
        ColorInput,
        SwitchButton
    },
    data() {
        return {
            blurringState: false,
            avatarFaviconState: false,
            themeColor: "",
        };
    },
    methods: {
        themeColorChoosing(color){
            // Show changes dynamically, without saving to chrome storage
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {type: "themeColorUpdate", themeColor: color});
            });
        },
        themeColorSelected(color){
            // Save final selection to chrome storage
            chrome.storage.sync.set({ themeColor: color });
        },
        toggleBlurring(status) {
            // Toggle thumbnails blurring dynamically
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {type: "toggleThumbnails", state: status});
            });
            // And save status to chrome storage
            chrome.storage.sync.set({ blurredThumbnails: status });
        },
        toggleAvatarFavicon(status) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {type: "toggleAvatarFavicon", state: status});
            });
            chrome.storage.sync.set({ avatarFavicon: status });
        },
    },
    mounted() {
        // SwitchButton, ColorInput, etc. need to be initialized in the Popup to their current status
        // They must be initialized asynchronously, <input> are not updated if the result is not awaited
        (async () => {
            this.themeColor = (await chrome.runtime.sendMessage({ type: "themeColor" })).message;
            this.blurringState = (await chrome.runtime.sendMessage({ type: "blurredThumbnails" })).message;
            this.avatarFaviconState = (await chrome.runtime.sendMessage({ type: "avatarFavicon" })).message;
        })();
    }
};
</script>