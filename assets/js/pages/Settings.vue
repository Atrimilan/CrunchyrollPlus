<template>
    <div class="crp-page">
    
        <div v-for="item in listItems" :key="item.id" :class="['item', item.locker]" :id="item.id">
            <div class="content">
    
                <div class="text">
                    <p class="crp_text">{{ i18n(`settingsItem_${item.id}`) }}</p>
                </div>
    
                <div class="tool">
                    <SimpleButton v-if="item.id==='reset'" image="images/miscellaneous/bin.svg" @onClick=resetConfig() />
                    <InfoArea v-if="item.id==='version'" text="1.0.0" />
                </div>
                
            </div>
            <div class="separator">
                <div class="highlighter"></div>
            </div>
        </div>
        
    </div>
</template>


<script>
import SimpleButton from "./components/SimpleButton.vue";
import InfoArea from "./components/InfoArea.vue";

export default {
    name: "Settings",
    components: {
        SimpleButton,
        InfoArea
    },
    data() {
        return {
            listItems: [
                { id: "reset" },
                { id: "version" },
            ],
        };
    },
    methods: {
        i18n(message) {
            return chrome.i18n.getMessage(message);
        },
        resetConfig(){
            // Reset all Crunchyroll Plus customizations
            chrome.runtime.sendMessage({ type: "resetStorage" });
        }
    }
};
</script>

<style scoped lang="scss">

@import "../../sass/list-items.scss";

</style>