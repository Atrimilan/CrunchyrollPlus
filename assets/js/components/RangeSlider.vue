<template>
    <input type="range" ref="slider" :min=min :max=max :value=value @input="updateSlider($event)" @change="notifySelected($event)"/>
</template>

<script>
export default {
    name: "RangeSlider",
    props: {
        value: Number,
        max: Number,
        min: Number
    },
    methods: {
        notifySelected(selection) {
            this.$emit("selected", selection.target.value);
        },
        updateSlider(selection) {
            var slider = selection.target;
            var gradientValue = (slider.value - slider.min) / (slider.max - slider.min) * 100;
            
            slider.style.background = `linear-gradient(to right,
                #dc2400 0%, #ff9782 ${gradientValue}%,
                #32353c ${gradientValue}%, #32353c 100%)`;
                
            this.$emit("isChoosing", selection.target.value);
        }
    },
    watch: {
        // Value needs to be watched, because it is asynchronously updated from the MainPopup
        value: function(val, oldVal) {
            // When new value is received, initialize slider background
            var gradientValue = (this.value - this.min) / (this.max - this.min) * 100;
            this.$refs.slider.style.background = `linear-gradient(to right,
                #dc2400 0%, #ff9782 ${gradientValue}%,
                #32353c ${gradientValue}%, #32353c 100%)`;
        }
    }
};
</script>

<style scoped lang="scss">
input[type="range"] {
    background: #32353c;  // Default background until it is updated by the script
    & {
        -webkit-appearance: none;
        width: 100px;
        height: 10px;
        border-radius: 50px;
    }
    &::-webkit-slider-runnable-track {
        height: 10px;
        -webkit-appearance: none;
    }
    &::-webkit-slider-thumb {
        width: 20px;
        height: 20px;
        margin-top: -5px;
        border-radius: 50%;
        -webkit-appearance: none;
        cursor: pointer;
        background: whitesmoke;
        box-shadow: 0 0 2px black;
    }
}
</style>