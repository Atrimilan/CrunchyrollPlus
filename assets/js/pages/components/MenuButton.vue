<template>
    <div :id="buttonId" class="menu-button" @click="notifyClick()" >
        <div class="illustration">
            <img id="icon" :src="icon" />
        </div>
        <div class="text">
            <p>{{ buttonValue }}</p>
        </div>
    </div>
</template>
    
<script>
export default {
    name: "MenuButton",
    props: {
        buttonValue: String,
        buttonIcon: String,
        buttonId: String,
    },
    methods: {
        notifyClick(){
            this.$emit("buttonClick", this.buttonId);   // Click is delegated because the ID cannot be accessed directly from the parent
        }
    },
    data(){
        return {
            icon: chrome.runtime.getURL(`images/popup/${this.buttonIcon}`),
        }
    },
};
</script>

<style scoped lang="scss">
$ease: 0.4s ease;

.menu-button {
    height: 45px;
    width: 100%;
    text-align: center;
    border: none;
    background-image: linear-gradient(45deg, red, #ffc400);
    cursor: pointer;
    border-radius: 50px;
    position: relative;
    margin-bottom: 3%;

    transition: filter $ease, box-shadow $ease, transform $ease;

    .illustration {
        height: 40px;
        display: flex;
        align-items: center;
        margin-left: 10px;
        height: 100%;
        position: absolute;
        img {
            height: 50%;

            transition: height $ease;
        }
    }

    .text {
        height: 100%;
        display: flex;
        align-items: center;
        p {
            width: 100%;
            text-align: center;
            color: #2a2a2a;
            font-size: 16px;
            font-weight: bold;
            font-family: "Lato", Helvetica Neue, helvetica, sans-serif;

            transition: color $ease, font-size $ease;
        }
    }

    &:hover {
        box-shadow: 0px 0px 10px 3px #ff5900;   // Affected by the filter!
        filter: hue-rotate(-40deg);
        p {
            color: white;
            font-size: 18px;
        }
        img {
            height: 60%;
        }
    }

    // Special buttons individual modifications
    &#advanced {
        background-image: linear-gradient(45deg, #fb00ff, #ff6766);
        &:hover {
            box-shadow: 0px 0px 10px 3px #f646d2;   // Affected by the filter!
        }
    }
    &#settings {
        background-image: linear-gradient(45deg, #47a6ff, #66ffa3);
        &:hover {
            box-shadow: 0px 0px 10px 3px #2efffc;   // Affected by the filter!
        }
    }
}
</style>