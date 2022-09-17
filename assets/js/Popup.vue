<template>
    <div class="app">
        <header>
            <Transition name="fade">
                <BackButton v-if="pageToShow != 'home'" :title="i18n(`menuButton_${pageToShow}`)" @back="openPage('home')" class="backButton" />
                <div class="logos" v-else>
                    <img src="images/icons/crp_icon_128.png" alt="CrunchyrollPlus icon" class="icon" />
                    <img src="images/icons/crp_logo_512.png" alt="CrunchyrollPlus logo" class="logo" />
                </div>
            </Transition>
        </header>

        <div class="content">
            <Transition :name="pageToShow === 'home' ? 'slide-right' : 'slide-left'" >
                <Home v-if="pageToShow === 'home'" @pageSelected="openPage($event)"/>
                <General v-else-if="pageToShow === 'general'"/>
                <Player v-else-if="pageToShow === 'player'"/>
                <Settings v-else-if="pageToShow === 'settings'"/>
            </Transition>
        </div>
    
        <footer>
            <div id="footer-text">
                <a id="github-link" target="_blank" href="https://github.com/Atrimilan/CrunchyrollPlus">GitHub</a>
                <a id="author" target="_blank" href="https://github.com/Atrimilan/CrunchyrollPlus">Milan NICOLAS</a>
            </div>
        </footer>
    </div>
</template>
    
    
<script>
import Home from "./pages/Home.vue";
import General from "./pages/General.vue";
import Player from "./pages/Player.vue";
import Settings from "./pages/Settings.vue";
import BackButton from "./pages/components/BackButton.vue";
export default {
    name: "Popup",
    components: {
        Home,
        General,
        Player,
        BackButton,
        Settings
    },
    data() {
        return {
            pageToShow: "home",
        };
    },
    methods: {
        i18n(message){
            // Internationalization
            return chrome.i18n.getMessage(message);
        },
        openPage(page){
            this.pageToShow = page;
        }
    }
};
</script>

<style scoped lang="scss">

// Content slide transitions (from Home: goes on the left, else: goes on the right)
.slide-right-enter-active, .slide-right-leave-active,
.slide-left-enter-active, .slide-left-leave-active {
  transition: all 0.3s ease;
}
.slide-right-leave-to,.slide-left-enter-from {
  opacity: 0;
  transform: translate(30px);
}
.slide-right-enter-from, .slide-left-leave-to {
  opacity: 0;
  transform: translate(-30px);
}


// Header fade transitions
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-leave-to, .fade-enter-from {
  opacity: 0;
}
.fade-leave-from, .fade-enter-to {
  opacity: 1;
}
</style>