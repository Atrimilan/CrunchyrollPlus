<template>
    <div>
        <p>{{ text }}</p>
    </div>
</template>
    
<script>
export default {
    name: "InfoArea",
    props: {
        text: String,
    },
};
</script>

<style scoped lang="scss">
div {
    width: fit-content;

    border: 0;
    outline: 0;
    background: #32353c;
    border-radius: 20px;
}
p {
    margin: 0 5px;
    display: block;
    box-sizing: border-box;
    height: 20px;
    min-width: 30px;

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