<template>
    <input type="color" v-model="currentColor" @input="notifyIsChoosing($event)" @change="notifySelected($event)" />
</template>

<script>
export default {
    name: "ColorInput",
    props: {
        color: String,
    },
    data(){
        return {
            currentColor: "#f47521",    // Default color
        }
    },
    methods: {
        notifyIsChoosing(color) {
            this.$emit("isChoosing", color.target.value);
        },
        notifySelected(color) {
            this.$emit("selected", color.target.value);
        },
    },
    watch: {
        // Value needs to be watched, because it is asynchronously updated from the MainPopup
        color: function(val, oldVal) {
            this.currentColor = val;
        }
    }
};
</script>

<style scoped lang="scss">
input[type="color"] {
    border: 0;
    background-color: #32353c;
    width: 40px;
    height: 20px;
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