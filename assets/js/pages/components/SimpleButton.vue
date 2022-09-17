<template>
    <div class="button">
        <img v-if="image !== ''" draggable="false" :src="src" />
    </div>
</template>

<script>
export default {
    name: "SimpleButton",
    props: {
        image: String,
    },
    data() {
        return {
            src: chrome.runtime.getURL(this.image),
        }
    },
};
</script>

<style scoped lang="scss">
.button {
    border: 0;
    width: 40px;
    height: 20px;
    background: linear-gradient(45deg, #dd0000, #ff684b);
    transition: filter 0.5s ease, opacity 0.1s ease;
    border-radius: 20px;
    cursor: pointer;

    display: flex;
    align-items: center;

    img {
        height: 70%;
        margin: auto;
    }

    &:hover {
        filter: hue-rotate(120deg);
    }

    &:active {
        opacity: 0.7;
    }
}
</style>