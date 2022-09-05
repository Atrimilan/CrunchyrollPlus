
<!-- Switch button made by Aaron Iker: https://codepen.io/aaroniker/pen/rNNLQVe?editors=1100 -->

<template>
    <label class="switch">
        <input type="checkbox" v-model="isChecked" @change="notifyParent()"/>
        <div><span></span></div>
    </label>
</template>

<script>
export default {
    name: "SwitchButton",
    data(){
        return {
            isChecked: false,
        };
    },
    methods: {
        notifyParent() {
            console.log("Notify : " + this.isChecked);
            this.$emit("switched", this.isChecked);
        },
    },
};
</script>

<style scoped lang="scss">
.switch {
    --line: #555;
    --dot: #ff2b01;
    --circle: #888;
    --duration: 0.3s;
    cursor: pointer;
    input {
        display: none;
        & + div {
            position: relative;
            &:before,
            &:after {
                --s: 1;
                content: "";
                position: absolute;
                height: 4px;
                top: 7.5px;
                width: 24px;
                background: var(--line);
                transform: scaleX(var(--s));
                transition: transform var(--duration) ease;
            }
            &:before {
                --s: 0;
                left: 0;
                transform-origin: 0 50%;
                border-radius: 2px 0 0 2px;
            }
            &:after {
                left: 22px;
                transform-origin: 100% 50%;
                border-radius: 0 2px 2px 0;
            }
            span {
                padding-left: 56px;
                line-height: 24px;
                color: var(--text);
                &:before {
                    --x: 0;
                    --b: var(--circle);
                    --s: 4px;
                    content: "";
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    box-shadow: inset 0 0 0 var(--s) var(--b);
                    transform: translateX(var(--x));
                    transition: box-shadow var(--duration) ease,
                        transform var(--duration) ease;
                }
                &:not(:empty) {
                    padding-left: 64px;
                }
            }
        }
        &:checked {
            & + div {
                &:before {
                    --s: 1;
                }
                &:after {
                    --s: 0;
                }
                span {
                    &:before {
                        --x: 28px;
                        --s: 12px;
                        --b: var(--dot);
                    }
                }
            }
        }
    }
}
</style>