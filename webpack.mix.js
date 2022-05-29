let mix = require('laravel-mix');

mix.setPublicPath('./')
    .sass('assets/sass/popup.scss', 'dist/css')
    .js('assets/js/background.js', 'dist/js')
    .options({
        processCssUrls: false
    });