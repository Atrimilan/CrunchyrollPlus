<template>
    <div class="home">
        <div v-for="menuButton in menuButtons" :key="menuButton.id">
            <MenuButton :buttonId="menuButton.id" :buttonValue="i18n(menuButton.value)" :buttonIcon="menuButton.icon" @buttonClick="$emit('pageSelected', $event)"/>
        </div>
    </div>
</template>

<script>
import MenuButton from "./components/MenuButton.vue";
export default {
    name: "Home",
    components: {
        MenuButton,
    },
    data() {
        return {
            menuButtons: [
                { id: "general", value: "menuButton_general", icon: "crunchyroll-icon.svg" },   // Value must be the i18n identifier
                { id: "player", value: "menuButton_player", icon: "player.svg" },
                { id: "settings", value: "menuButton_settings", icon: "gear.svg" },
            ],
        };
    },
    methods: {
        i18n(message) {
            return chrome.i18n.getMessage(message);
        }
    }
};
</script>

<style scoped lang="scss">
    .home {
        position: absolute; // For better transitions in Popup.vue
        width: 96%;         // it won't need "mode='out-in', entering and leaving can happen at the same time
    }
</style>