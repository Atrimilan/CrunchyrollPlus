<template>
<div class="wrapper">
    <header>
        <img src="images/icons/crp_icon_128.png" alt="CrunchyrollPlus icon" class="icon" />
        <img src="images/icons/crp_logo_512.png" alt="CrunchyrollPlus logo" class="logo" />
    </header>

    
    <div class="wrapper">
        <h1 class="crp_h1">Hello</h1>
        <p class="crp_text">This is a test.</p>
        <p class="crp_text">And a second one.</p>
        <!--<button @click="changeColor()" id="changeColor">TEST</button>
        <input type="text" id="time" />-->

        <DynamicInput colorType="themeColor" />
        <SwitchButton @switched="onSwitch($event)" />
    </div>

    <footer>
        <div id="footer-text">
            <a id="github-link" target="_blank" href="https://github.com/Atrimilan/CrunchyrollPlus">GitHub</a>
            <p id="author" href="https://github.com/Atrimilan/CrunchyrollPlus">Milan NICOLAS</p>
        </div>
    </footer>
</div>
</template>

<script>
import DynamicInput from "./DynamicColorInput.vue";
import SwitchButton from "./SwitchButton.vue";
export default {
    name: "MainPopup",
    components: {
        DynamicInput,
        SwitchButton
    },
    data() {
        return {
        };
    },
    methods: {
        onSwitch(status) {
            if (status){
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {type: "hideThumbnails"});
                });
            }
            else {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {type: "showThumbnails"});
                });
            }
        },
    },
};
</script>