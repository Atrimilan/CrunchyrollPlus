<template>
<div class="general">
    <table>
    <tbody class=".crp_text">
    <tr>
        <td><span class="crp_text">Main theme color:</span> <ColorInput :color=themeColor @selected="themeColorSelected($event)" @isChoosing="themeColorChoosing($event)" /></td>
    </tr>

    <tr>
        <td><span class="crp_text">Blur episode thumbnails:</span> <SwitchButton :isChecked=blurringState @switched="toggleBlurring($event)" /></td>
    </tr>

    <tr>
        <td><span class="crp_text">Use avatar as favicon:</span> <SwitchButton :isChecked=avatarFaviconState @switched="toggleAvatarFavicon($event)" /></td>
    </tr>
    </tbody>
    </table>
</div>
</template>


<script>
import ColorInput from "./components/ColorInput.vue";
import SwitchButton from "./components/SwitchButton.vue";
export default {
    name: "General",
    components: {
        ColorInput,
        SwitchButton,
    },
    data() {
        return {
            blurringState: false,
            avatarFaviconState: false,
            themeColor: ""
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
        }
    },
    mounted() {
        // Components need to be initialized in the Popup to their current status
        // They must be initialized asynchronously, <input> are not updated if the result is not awaited
        (async () => {
            this.themeColor = (await chrome.runtime.sendMessage({ type: "themeColor" })).message;
            this.blurringState = (await chrome.runtime.sendMessage({ type: "blurredThumbnails" })).message;
            this.avatarFaviconState = (await chrome.runtime.sendMessage({ type: "avatarFavicon" })).message;
        })();
    }
};
</script>

<style scoped lang="scss">
.general {
    position: absolute; // For better transitions in Popup.vue
    width: 96%;         // it won't need "mode='out-in', entering and leaving can happen at the same time
}
</style>