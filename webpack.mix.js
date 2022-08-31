let mix = require('laravel-mix');

mix.setPublicPath('./')
    .sass('assets/sass/default_popup.scss', 'dist/css')         // Popup style
    .sass('assets/sass/crp-player.scss', 'dist/css')            // Content-script style : crp-player
    .js('assets/js/background.js', 'dist/js')                   // Service worker : background
    .js('assets/js/popup.js', 'dist/js').vue()                  // Popup
    .js('assets/js/content-scripts/crp-player.js', 'dist/js')   // Content-script : crp-player
    .options({
        processCssUrls: false
    });