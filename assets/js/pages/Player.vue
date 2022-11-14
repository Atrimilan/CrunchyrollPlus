<template>
<div class="crp-page">
    
    <div v-for="item in listItems" :key="item.id" :class="['item', item.locker]" :id="item.id">
        <div class="content">

            <div class="text">
                <p class="crp_text" :id=item.id>{{ i18n(`playerItem_${item.id}`) }}</p>
            </div>

            <div class="tool">
                <SwitchButton v-if="item.id==='playerThumbnail'" :isChecked=playerThumbnailState @switched="togglePlayerThumbnail($event)" />
                <FloatSlider v-else-if="item.id==='soundMultiplier'" :min=0 :max=40 :value="soundMultiplier" @selected="soundMultiplierSelected($event)" />
                <SwitchButton v-if="item.id==='crpOpeningSkipper'" :isChecked=crpOpeningSkipper @switched="toggleCRPSKipper($event)" />
                <TimeInput v-else-if="item.id==='openingDuration'" :timeInSeconds=openingDuration @selected="setOpeningDuration($event)"/>
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
import SwitchButton from "./components/SwitchButton.vue";
import FloatSlider from "./components/FloatSlider.vue";
import TimeInput from "./components/TimeInput.vue";

export default {
    name: "Player",
    components: {
        SwitchButton,
        FloatSlider,
        TimeInput
    },
    data() {
        return {
            listItems: [
                { id: "playerThumbnail" },
                { id: "soundMultiplier" },
                { id: "crpOpeningSkipper" },
                { id: "openingDuration" },
            ],
            playerThumbnailState: true,
            soundMultiplier: 0,
            crpOpeningSkipper: true,
            openingDuration: 90 // 1:30 in seconds
        };
    },
    methods: {
        i18n(message) {
            return chrome.i18n.getMessage(message);
        },
        async togglePlayerThumbnail(status) {
            chrome.storage.sync.set({ showPlayerThumbnail: status });
            await MessageAPI.sendToContentScripts("togglePlayerThumbnail", { state: status });
        },
        soundMultiplierSelected(value){
            chrome.storage.sync.set({ soundMultiplier: value });
        },
        toggleCRPSKipper(status) {
            this.crpOpeningSkipper = status;
            chrome.storage.sync.set({ crpSkipper: { enabled: status, openingDuration: 90 } });
        },
        setOpeningDuration(value){
            chrome.storage.sync.set({ crpSkipper: { enabled: true, openingDuration: value } });
        }
    },
    mounted() {
        // Components need to be initialized in the Popup to their current status
        // They must be initialized asynchronously, <input> are not updated if the result is not awaited
        (async () => {
            this.playerThumbnailState = await MessageAPI.getStorage("showPlayerThumbnail");
            this.soundMultiplier = parseInt(await MessageAPI.getStorage("soundMultiplier"));
            const { enabled, openingDuration } = await MessageAPI.getStorage("crpSkipper");
            this.crpOpeningSkipper = enabled;
            this.openingDuration = parseInt(openingDuration);
        })();
    },
    watch: {
        crpOpeningSkipper: function(val) {
            // Enable openingDuration list item
            this.listItems.forEach(item => {
                if (item.id === "openingDuration") {
                    item.locker = val ? "" : "locked";
                }
            });
        }
    }
};
</script>

<style scoped lang="scss">
    
@import "../../sass/list-items.scss";

</style>