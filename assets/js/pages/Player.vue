<template>
<div class="player">
    <table>
    <tbody>
    <tr>
        <td><span class="crp_text">Show progress bar thumbnail: </span><SwitchButton :isChecked=playerThumbnailState @switched="togglePlayerThumbnail($event)" /></td>
    </tr>

    <tr>
        <td> 
            <div class="sliderWithInfo">
                <span class="crp_text">Sound booster gain:</span> <RangeSlider ref="soundMultiplier" :min=0 :max=40 :value=soundMultiplier @selected="soundMultiplierSelected($event)" @isChoosing="soundMultiplierChoosing($event)" />
                <InfoArea :text=soundGainInfo />
            </div>
        </td>
    </tr>

    <tr>
        <td><span class="crp_text">Duration for opening skipper:</span> <TimeInput :timeInSeconds=openingDuration @selected="setOpeningDuration($event)"/></td>
    </tr>
    </tbody>
    </table>
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
            playerThumbnailState: true,
            soundMultiplier: 0,
            soundGainInfo: 1,
            openingDuration: 85 // 1:25 in seconds
        };
    },
    methods: {
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
.player {
    position: absolute; // For better transitions in Popup.vue
    width: 96%;         // it won't need "mode='out-in', entering and leaving can happen at the same time
}

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