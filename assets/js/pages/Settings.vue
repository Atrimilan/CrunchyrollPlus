<template>
    <div class="settings">
    
        <div class="item" v-for="item in listItems" :key="item.id">
            <div class="content">
    
                <div class="text">
                    <p class="crp_text">{{ i18n(`settingsItem_${item.id}`) }}</p>
                </div>
    
                <div class="tool">
                    <SimpleButton v-if="item.id==='reset'" image="images/miscellaneous/bin.svg" />
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

export default {
    name: "General",
    components: {
        SimpleButton
    },
    data() {
        return {
            listItems: [
                { id: "reset" },
            ],
        };
    },
    methods: {
        i18n(message) {
            return chrome.i18n.getMessage(message);
        },
    }
};
</script>

<style scoped lang="scss">
@import "../../sass/list-items.scss";

.settings {
    position: absolute; // For better transitions (won't need "mode='out-in', entering/leaving can happen at the same time)
    width: 96%;
}
</style>