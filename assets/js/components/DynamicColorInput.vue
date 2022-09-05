<template>
    <input type="color" id="{{colorType}}" @input="input" @change="change" v-model="color" />
</template>

<script>
export default {
    name: "DynamicColorInput",
    props: {
        colorType: String,
    },
    data() {
        return {
            color: "",
        };
    },
    methods: {
        input(color) {
            // Show changes dynamically, without saving to chrome storage
            this.color = color.target.value;
        },
        change(color) {
            // Save finale change to chrome storage
            chrome.storage.sync.set({ themeColor: color.target.value });
        },
    },
    mounted() {
        // Async function: <input> is not updated if the result is not awaited
        (async () => {
            // Get color from the chrome storage, corresponding to the color type given in the props
            const result = await chrome.runtime.sendMessage({ type: this.colorType, });
            this.color = result.message;
        })();
    },
};
</script>

<style scoped lang="scss">
input[type="color"] {
	border: 0;
    background-color: #555;
	width: 48px;
	height: 21px;
    padding: 2px;
    margin: 0;
    border-radius: 10px;
    &::-webkit-color-swatch-wrapper {
        padding: 2px;
        border-radius: 10px;
    }
    &::-webkit-color-swatch {
        border: 0;
        border-radius: 10px;
    }
}
</style>