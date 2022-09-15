<template>
    <div id="back" @click="$emit('back')">
        <img id="icon" :src="icon" />
    </div>
</template>

<script>
export default {
    name: "BackButton",
    data() {
        return {
            icon: chrome.runtime.getURL(`images/popup/back.svg`),
        };
    },
};
</script>

<style scoped lang="scss">
#back {
    position: absolute;
    width: 10%;
    img {
        vertical-align: middle;
        height: 52px;
        width: 80%;

        opacity: 0.7;
        transition: opacity 0.2s ease, width 0.2s ease;
    }

    &:hover {
        cursor: pointer;
        img {
            opacity: 1;
            width: 85%;
        }
    }
}
</style>