<template>
    <div id="banner">
        <div id="back-button" @click="$emit('back')">
            <img :src="icon" />
        </div>
        <div id="title">
            <h1 class="crp_h1">{{this.title}}</h1>
        </div>
    </div>
</template>

<script>
export default {
    name: "BackButton",
    props: {
        title: String
    },
    data() {
        return {
            icon: chrome.runtime.getURL(`images/popup/back.svg`),
        };
    }
};
</script>

<style scoped lang="scss">
* {
    margin: 0;
}

#banner{
    position: absolute;
    top: 0;
    width: 100%;
    height: 52px;

    #back-button, #title {
        display: flex;              //
        justify-content: center;    // Centered horizontally
        align-items: center;        // Centered vertically
        height: 100%;
        width: 100%;
    }

    #back-button{
        top: 0;
        position: absolute;
        height: 52px;   // Override the
        width: 30px;    // previous "100%"
        cursor: pointer;

        img{
            height: 75%;
            width: 75%;
            opacity: 0.7;
            transition: opacity 0.2s ease, width 0.2s ease, height 0.2s ease;
        }
        &:hover {   // Enlarge & highlight button on hover
            img{
                height: 90%;
                width: 90%;
                opacity: 1;
            }
        }
    }
}
</style>