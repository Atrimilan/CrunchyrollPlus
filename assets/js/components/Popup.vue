<template>
<div class="wrapper">
    <header>
        <img src="images/icons/crp_icon_128.png" alt="CrunchyrollPlus icon" class="icon" />
        <img src="images/icons/crp_logo_512.png" alt="CrunchyrollPlus logo" class="logo" />
    </header>

    <div class="wrapper">
        <h1 class="crunchy-h1">Hello</h1>
        <p class="crunchy-text">This is a test.</p>
        <p class="crunchy-text">And a second one.</p>
        <button @click="changeColor()" id="changeColor">TEST</button>
        <input type="text" id="time" />
    </div>

    <footer>
        <div id="footer-text">
            <a id="github-link" target="_blank" href="https://github.com/Atrimilan/CrunchyrollPlus">GitHub</a>
            <p id="author" href="https://github.com/Atrimilan/CrunchyrollPlus">
                Milan NICOLAS
            </p>
        </div>
    </footer>
</div>
</template>

<script>
export default {
    name: "Popup",
    data() {
        return {
            name: "Pierre",
            count: 0,
        };
    },
    methods: {
        changeColor() {
            console.log("test");
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                console.log(tabs);
                console.log(tabs[0]);
                console.log(tabs[0].url);
                chrome.tabs.sendMessage(tabs[0].id, {type: "moveForward"}, function(response) {
                    console.log(response);
                });
            });
        },
    },
};
</script>
