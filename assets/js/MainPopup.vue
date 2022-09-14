<template>
<div class="popup">
    <header>
        <img src="images/icons/crp_icon_128.png" alt="CrunchyrollPlus icon" class="icon" />
        <img src="images/icons/crp_logo_512.png" alt="CrunchyrollPlus logo" class="logo" />
    </header>

    
    <div class="wrapper">
        <h1 class="crp_h1">{{ i18n("Hello") }}</h1>
        <p class="crp_text">{{ i18n("configuration") }}</p>
        
        <table>
        <tbody>
        <tr>
            <td>Main theme color: <ColorInput :color=themeColor @selected="themeColorSelected($event)" @isChoosing="themeColorChoosing($event)" /></td>
        </tr>

        <tr>
            <td>Blur episode thumbnails: <SwitchButton :isChecked=blurringState @switched="toggleBlurring($event)" /></td>
        </tr>

        <tr>
            <td>Use avatar as favicon: <SwitchButton :isChecked=avatarFaviconState @switched="toggleAvatarFavicon($event)" /></td>
        </tr>

        <tr>
            <td>Hide progress bar thumbnail: <SwitchButton :isChecked=playerThumbnailState @switched="togglePlayerThumbnail($event)" /></td>
        </tr>

        <tr>
            <td> 
                <div class="sliderWithInfo">
                    Sound booster gain: <RangeSlider ref="soundMultiplier" :min=0 :max=40 :value=soundMultiplier @selected="soundMultiplierSelected($event)" @isChoosing="soundMultiplierChoosing($event)" />
                    <InfoArea :text=soundGainInfo />
                </div>
            </td>
        </tr>

        <tr>
            <td>Duration for opening skipper: <TimeInput :timeInSeconds=openingDuration @selected="setOpeningDuration($event)"/></td>
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
import ColorInput from "./components/ColorInput.vue";
import SwitchButton from "./components/SwitchButton.vue";
import RangeSlider from "./components/RangeSlider.vue";
import InfoArea from "./components/InfoArea.vue";
import TimeInput from "./components/TimeInput.vue";
export default {
    name: "MainPopup",
    components: {
        ColorInput,
        SwitchButton,
        RangeSlider,
        InfoArea,
        TimeInput
    },
    data() {
        return {
            blurringState: false,
            playerThumbnailState: true,
            avatarFaviconState: false,
            themeColor: "",
            soundMultiplier: 0,
            soundGainInfo: 1,
            openingDuration: 85 // 1:25 in seconds
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
        togglePlayerThumbnail(status) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {type: "togglePlayerThumbnail", state: status});
            });
            chrome.storage.sync.set({ showPlayerThumbnail: status });
        },
        toggleAvatarFavicon(status) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {type: "toggleAvatarFavicon", state: status});
            });
            chrome.storage.sync.set({ avatarFavicon: status });
        },
        soundMultiplierChoosing(value){
            this.soundGainInfo = value / 10  + 1;
        },
        soundMultiplierSelected(value){
            chrome.storage.sync.set({ soundMultiplier: value });
        },
        setOpeningDuration(value){
            chrome.storage.sync.set({ openingDuration: value });
        },
        // Internationalization
        i18n(message){
            return chrome.i18n.getMessage(message);
        }
    },
    mounted() {
        // SwitchButton, ColorInput, etc. need to be initialized in the Popup to their current status
        // They must be initialized asynchronously, <input> are not updated if the result is not awaited
        (async () => {
            this.themeColor = (await chrome.runtime.sendMessage({ type: "themeColor" })).message;
            this.blurringState = (await chrome.runtime.sendMessage({ type: "blurredThumbnails" })).message;
            this.playerThumbnailState = (await chrome.runtime.sendMessage({ type: "showPlayerThumbnail" })).message;
            this.avatarFaviconState = (await chrome.runtime.sendMessage({ type: "avatarFavicon" })).message;
            this.soundMultiplier = parseInt((await chrome.runtime.sendMessage({ type: "soundMultiplier" })).message);
            this.soundGainInfo = this.soundMultiplier / 10  + 1;
            this.openingDuration = parseInt((await chrome.runtime.sendMessage({ type: "openingDuration" })).message);
        })();
    }
};
</script>

<style scoped lang="scss">
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