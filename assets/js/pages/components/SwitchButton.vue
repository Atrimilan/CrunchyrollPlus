<template>
    <label class="switch">
        <input type="checkbox" v-model="isChecked" @change="notifySwitch()" />
        <span class="slider"></span>
    </label>
</template>

<script>
export default {
    name: "SwitchButton",
    props: {
        isChecked: Boolean,
    },
    methods: {
        notifySwitch() {
            this.$emit("switched", this.isChecked);
        },
    },
};
</script>

<style scoped lang="scss">
// Simple switch by Ibrahim Bilal: https://codepen.io/ibrahim-bilal/pen/zYWveOb

@mixin prefix($name, $value) {
    @each $vendor in ("-webkit-", "-moz-", "-ms-", "-o-", "") {
        #{$vendor}#{$name}: #{$value};
    }
}

.switch {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 20px;

    input {
        opacity: 0;
        width: 0;
        height: 0;

        &:checked + .slider {
            background-color: #ff3b15;

            &::before {
                filter: drop-shadow(0px 0px 2px #9d250e);
                @include prefix(transform, translateX(20px));
            }
        }
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #32353c;
        border-radius: 50px;
        @include prefix(transition, 0.3s);

        &::before {
            border-radius: 50%;
            position: absolute;
            content: "";
            height: 15px;
            width: 15px;
            left: 2px;
            bottom: 2.5px;
            background-color: whitesmoke;
            filter: drop-shadow(0px 0px 2px #131416);
            @include prefix(transition, 0.3s);
        }
    }
}
</style>