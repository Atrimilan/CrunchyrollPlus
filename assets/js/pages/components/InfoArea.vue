<template>
    <textarea :style="width !== null ? `width: ${width}px;` : ''" readonly :value="text"></textarea>
</template>
    
<script>
export default {
    name: "InfoArea",
    props: {
        text: String,
        width: Number,  // Optional
    }
};
</script>

<style scoped lang="scss">
textarea {
    display: block;
    box-sizing: border-box;
    width: 40px; 
    height: 20px;
    resize: none;
    overflow: hidden;

    border: 0;
    outline: 0;
    background: #32353c;
    border-radius: 20px;
    color: whitesmoke;
    font-weight: bold;
    font-family: monospace, monospace;
    font-size: 14px;
    padding: 1.5px;
    text-align-last: center;
    
    &::selection {
        background-color: #ff3b15;
    }
}
</style>