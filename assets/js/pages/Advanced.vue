<template>
    <div class="crp-page">
    
        <div v-for="item in listItems" :key="item.id" :class="['item', item.locker]" :id="item.id">
            <div class="content">
    
                <div class="text">
                    <p class="crp_text">{{ i18n(`advancedItem_${item.id}`) }}</p>
                </div>
    
                <div class="tool">
                    <SimpleButton v-if="item.id==='downloadSubtitles'" image="" @onClick=downloadSubtitles() />
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
import SimpleButton from './components/SimpleButton.vue';

export default {
    name: "Advanced",
    components: {
        SimpleButton
    },
    data() {
        return {
            listItems: [
                { id: "downloadSubtitles" }
            ],
        };
    },
    methods: {
        i18n(message) {
            return chrome.i18n.getMessage(message);
        },
        downloadSubtitles() {
            MessageAPI.sendToContentScripts("downloadSubtitles");  // Start download from page content-script
        }
    }
};
</script>

<style scoped lang="scss">

@import "../../sass/list-items.scss";

</style>