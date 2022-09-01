let mix = require('laravel-mix');

mix.setPublicPath('./')
    .js('assets/js/background.js', 'dist/js')                   // Service worker : background
    .js('assets/js/popup.js', 'dist/js').vue()                  // Popup
    .sass('assets/sass/default_popup.scss', 'dist/css')         // Popup style
    .js('assets/js/content-scripts/crp-player.js', 'dist/js')   // Content-script : crp-player
    .sass('assets/sass/crp-player.scss', 'dist/css')            // Content-script style : crp-player
    .js('assets/js/content-scripts/crp-page.js', 'dist/js')     // Content-script : crp-page
    .options({
        processCssUrls: false
    });