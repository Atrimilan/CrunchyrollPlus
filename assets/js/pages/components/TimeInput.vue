<template>
    <div>
        <input
            type="number"
            id="minutes"
            placeholder="--"
            :value="minutes"
            @input="dynamicCheckValue($event)"
            @change="notifySelected($event)"
            @focus="$event.target.select()"
        />
        <span> : </span>
        <input
            type="number"
            id="seconds"
            placeholder="--"
            :value="seconds"
            @input="dynamicCheckValue($event)"
            @change="notifySelected($event)"
            @focus="$event.target.select()"
        />
    </div>
</template>
    
<script>
export default {
    name: "TimeInput",
    props: {
        timeInSeconds: Number,
    },
    data() {
        return {
            seconds: ("0" + (this.timeInSeconds % 60)).slice(-2),
            minutes: ( "0" + (this.timeInSeconds - (this.timeInSeconds % 60)) / 60).slice(-2),
        };
    },
    methods: {
        dynamicCheckValue(input) {
            if (input.target.id == "minutes"){
                this.minutes = input.target.value > 59 ? 59 : input.target.value;
            }
            else {
                this.seconds = input.target.value > 59 ? 59 : input.target.value;
            }
        },
        notifySelected(input) {
            if (input.target.id == "minutes"){
                this.minutes = input.target.value == "" ? "00" : ("0" + input.target.value).slice(-2);
            }
            else {
                this.seconds = input.target.value == "" ? "00" : ("0" + input.target.value).slice(-2);
            }
            const finalTime = (parseInt(this.minutes) * 60 + parseInt(this.seconds));
            this.$emit("selected", finalTime);
        },
    },
    watch: {
        // Value needs to be watched, because it is asynchronously updated from the MainPopup
        timeInSeconds: function(val, oldVal) {
            // When new value is received, initialize time input
            this.seconds = ("0" + (val % 60)).slice(-2);
            this.minutes = ("0" + (val - (val % 60)) / 60).slice(-2);
        }
    }
};
</script>

<style scoped lang="scss">
div {
    background: whitesmoke;
    border-radius: 20px;
    width: 60px;
    height: 20px;
    text-align: center;

    span {
        font-weight: bold;
        color: #32353c;
    }
    input[type="number"] {
        width: 20px;
        background: transparent;
        font-weight: bold;
        color: #32353c;
        font-family: monospace, monospace;
        font-size: 14px;
        border: 0;
        outline: 0;

        &#minutes {
            text-align: right;
        }
        &#seconds {
            text-align: left;
        }
        &::-webkit-inner-spin-button {
            appearance: none;
        }
        &::selection {
            background-color: #ff3b15;
            color: whitesmoke;
        }
    }
}
</style>