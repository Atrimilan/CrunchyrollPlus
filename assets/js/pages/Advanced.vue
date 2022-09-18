<template>
    <div class="crp-page">
    
        <div class="item" v-for="item in listItems" :key="item.id">
            <div class="content">
    
                <div class="text">
                    <p class="crp_text">{{ i18n(`settingsItem_${item.id}`) }}</p>
                </div>
    
                <div class="tool">
                    <!-- ... -->
                </div>
                
            </div>
            <div class="separator">
                <div class="highlighter"></div>
            </div>
        </div>
        
    </div>
</template>


<script>
export default {
    name: "General",
    components: {
        /* ... */
    },
    data() {
        return {
            listItems: [
                { id: null },
                { id: null },
                { id: null },
            ],
        };
    },
    methods: {
        i18n(message) {
            return chrome.i18n.getMessage(message);
        }
    }
};
</script>

<style scoped lang="scss">

@import "../../sass/list-items.scss";

</style>