<!-- RangeSlider displaying its float value in an InfoArea -->
<template>
    <div>
        <RangeSlider
            :min="min"
            :max="max"
            :value="value"
            @selected="this.$emit('selected', $event)"
            @isChoosing="text = 1 + $event / 10"
        />
        <InfoArea :text="text.toFixed(1)" />
    </div>
</template>

<script>
import RangeSlider from "./RangeSlider.vue";
import InfoArea from "./InfoArea.vue";

export default {
    name: "FloatSlider",
    components: {
        RangeSlider,
        InfoArea,
    },
    props: {
        value: Number,
        max: Number,
        min: Number,
    },
    data() {
        return {
            text: 1 + this.value / 10,
            infoArea: this.text,
        };
    },
    watch: {
        // Value needs to be watched, because it is asynchronously updated from the MainPopup
        value: function (val, oldVal) {
            this.text = 1 + val / 10;
        },
    },
};
</script>

<style scoped lang="scss">
div {
    width: fit-content;
    > * {
        display: inline-block;
        vertical-align: middle;
    }
    :deep(textarea) {
        margin-left: 5px;
    }
}
</style>