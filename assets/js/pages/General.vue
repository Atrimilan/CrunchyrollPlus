<template>
<div class="crp-page">

    <div v-for="item in listItems" :key="item.id" :class="['item', item.locker]" :id="item.id">
        <div class="content">

            <div class="text">
                <p class="crp_text">{{ i18n(`generalItem_${item.id}`) }}</p>
            </div>

            <div class="tool">
                <ColorInput v-if="item.id==='themeColor'" :color=themeColor @selected="themeColorSelected($event)" @isChoosing="themeColorChoosing($event)" />
                <SwitchButton v-else-if="item.id==='blurring'" :isChecked=blurringState @switched="toggleBlurring($event)" />
                <SwitchButton v-else-if="item.id==='avatarFavicon'" :isChecked=avatarFaviconState @switched="toggleAvatarFavicon($event)" />
            </div>
            
        </div>
        <div class="separator">
            <div class="highlighter"></div>
        </div>
    </div>

</div>
</template>


<script>
import MessageAPI from '../classes/message-api.js';
import ColorInput from "./components/ColorInput.vue";
import SwitchButton from "./components/SwitchButton.vue";

export default {
    name: "General",
    components: {
        ColorInput,
        SwitchButton
    },
    data() {
        return {
            listItems: [
                { id: "themeColor" },
                { id: "blurring" },
                { id: "avatarFavicon" },
            ],
            blurringState: false,
            avatarFaviconState: false,
            themeColor: ""
        };
    },
    methods: {
        i18n(message) {
            return chrome.i18n.getMessage(message);
        },
        themeColorChoosing(color){
            // Show changes dynamically, without saving to chrome storage
            MessageAPI.sendToContentScripts("themeColorUpdate", { themeColor: color });
        },
        themeColorSelected(color){
            // Save final selection to chrome storage
            chrome.storage.sync.set({ themeColor: color });
        },
        toggleBlurring(status) {
            // Toggle thumbnails blurring dynamically
            // And save status to chrome storage
            MessageAPI.sendToContentScripts("toggleThumbnails", { state: status });
            chrome.storage.sync.set({ blurredThumbnails: status });
        },
        toggleAvatarFavicon(status) {
            MessageAPI.sendToContentScripts("toggleAvatarFavicon", { state: status });
            chrome.storage.sync.set({ avatarFavicon: status });
        }
    },
    mounted() {
        // Components need to be initialized in the Popup to their current status
        // They must be initialized asynchronously, <input> are not updated if the result is not awaited
        (async () => {
            this.themeColor = await MessageAPI.getStorage("themeColor");
            this.blurringState = await MessageAPI.getStorage("blurredThumbnails");
            this.avatarFaviconState = await MessageAPI.getStorage("avatarFavicon");
        })();
    }
};
</script>

<style scoped lang="scss">

@import "../../sass/list-items.scss";

</style>