<template>
<div class="crp-page">
    
    <div class="item" v-for="item in listItems" :key="item.id">
        <div class="content">

            <div class="text">
                <p class="crp_text" :id=item.id>{{ i18n(`playerItem_${item.id}`) }}</p>
            </div>

            <div class="tool">
                <SwitchButton v-if="item.id==='playerThumbnail'" :isChecked=playerThumbnailState @switched="togglePlayerThumbnail($event)" />
                <div v-else-if="item.id==='soundMultiplier'" class="sliderWithInfo">
                    <RangeSlider ref="soundMultiplier" :min=0 :max=40 :value=soundMultiplier @selected="soundMultiplierSelected($event)" @isChoosing="soundMultiplierChoosing($event)" />
                    <InfoArea :text="soundGainInfo.toFixed(1)" />
                </div>
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
import SwitchButton from "./components/SwitchButton.vue";
import RangeSlider from "./components/RangeSlider.vue";
import InfoArea from "./components/InfoArea.vue";
import TimeInput from "./components/TimeInput.vue";
export default {
    name: "Player",
    components: {
        SwitchButton,
        RangeSlider,
        InfoArea,
        TimeInput
    },
    data() {
        return {
            listItems: [
                { id: "playerThumbnail" },
                { id: "soundMultiplier" },
                { id: "openingDuration" },
            ],
            playerThumbnailState: true,
            soundMultiplier: 0,
            soundGainInfo: 1,
            openingDuration: 85 // 1:25 in seconds
        };
    },
    methods: {
        i18n(message) {
            return chrome.i18n.getMessage(message);
        },
        togglePlayerThumbnail(status) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {type: "togglePlayerThumbnail", state: status});
            });
            chrome.storage.sync.set({ showPlayerThumbnail: status });
        },
        soundMultiplierChoosing(value){
            this.soundGainInfo = value / 10  + 1;
        },
        soundMultiplierSelected(value){
            chrome.storage.sync.set({ soundMultiplier: value });
        },
        setOpeningDuration(value){
            chrome.storage.sync.set({ openingDuration: value });
        }
    },
    mounted() {
        // Components need to be initialized in the Popup to their current status
        // They must be initialized asynchronously, <input> are not updated if the result is not awaited
        (async () => {
            this.playerThumbnailState = (await chrome.runtime.sendMessage({ type: "showPlayerThumbnail" })).message;
            this.soundMultiplier = parseInt((await chrome.runtime.sendMessage({ type: "soundMultiplier" })).message);
            this.soundGainInfo = this.soundMultiplier / 10  + 1;
            this.openingDuration = parseInt((await chrome.runtime.sendMessage({ type: "openingDuration" })).message);
        })();
    }
};
</script>

<style scoped lang="scss">
    
@import "../../sass/list-items.scss";

.sliderWithInfo {
    width: fit-content;
    > * {
        display: inline-block;
        vertical-align: middle;
    }
    :deep(textarea) {
        margin-left: 5px;
    }
}
</style>