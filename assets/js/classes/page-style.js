export default class PageStyle {
    static set(type, parameters) {
        switch (type) {
            case "updateThemeColor":
                updateThemeColor(parameters.color);
                break;
            case "toggleThumbnails":
                toggleThumbnails(parameters.state);
                break;
            case "toggleAvatarFavicon":
                toggleAvatarFavicon(parameters.state);
                break;
            case "togglePlayerThumbnail":
                togglePlayerThumbnail(parameters.state);
                break;
        }
    }
}

/*
 * Create style element and add it to the DOM
 */
function createStyleElement(id) {
    var myStyle = document.createElement('style');
    myStyle.id = id;
    document.getElementsByTagName('head')[0].appendChild(myStyle);
    return myStyle;
}

var blurredThumbnailStyle = createStyleElement("blurredThumbnailStyle");
function toggleThumbnails(state) {
    // Blur/show episode thumbnails
    blurredThumbnailStyle.innerHTML = state ?
        `.prev-next-episodes img,.episode-list img,.erc-up-next-section img {
            filter: blur(20px);
            -webkit-filter: blur(20px);
            -moz-filter: blur(20px);
            -o-filter: blur(20px);
            -ms-filter: blur(20px);
        }` : ``;
}

var playerThumbnailStyle = createStyleElement("playerThumbnailStyle");
function togglePlayerThumbnail(state) {
    // Hide/show player thumbnail
    playerThumbnailStyle.innerHTML = state ? `` :
        `div[class="css-1dbjc4n r-1awozwy r-1777fci"] {
            visibility: hidden;
        }`;
}

var themeColorStyle = createStyleElement("themeColorStyle");
function updateThemeColor(color) {
    themeColorStyle.innerHTML =
        `.erc-logo .logo-icon {
        fill: ${color};
    }
    ::selection,
    .erc-current-media-info .show-title-link,
    .info-tag--is-six--oJ2yw,
    svg[data-t="loader-svg"] > path,
    .erc-user-menu-nav-item.state-active,
    .navigation-link.state-active > span,
    .erc-menu-item-title.state-active,
    .submenu-item-title.state-active > h5,
    .activate-device-nav-link > span,
    .button--is-type-one-weak--KLvCX {
        color: ${color};
    }
    .progress-bar__progress--PhR3h,
    .button--is-type-one--3uIzT,
    .tabs-item--is-active--66UFY:after,
    .carousel-tabs__tab--is-active--OWPNm > div:before {
        background-color: ${color};
    }
    .button--is-type-one--3uIzT:hover {
        background-color: ${increaseBrightness(color, 20)};
    }
    .button--is-type-one-weak--KLvCX:hover {
        color: ${increaseBrightness(color, 20)};
    }`;

    // https://stackoverflow.com/a/33385707
    function increaseBrightness(color, percent) {
        var ctx = document.createElement('canvas').getContext('2d');

        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);

        var color = ctx.getImageData(0, 0, 1, 1);
        var r = color.data[0] + Math.floor(percent / 100 * 255);
        var g = color.data[1] + Math.floor(percent / 100 * 255);
        var b = color.data[2] + Math.floor(percent / 100 * 255);

        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }
}

var favicons = null;
var userAvatar = null;
function toggleAvatarFavicon(state) {
    // Set user avatar as favicon
    if (state) {
        if (userAvatar == null) {
            favicons = document.querySelectorAll('link[rel][type="image/png"]');
            waitForElement('div[class="erc-header-avatar"] img[class="content-image__image--7tGlg"]')
                .then(myImg => { userAvatar = myImg.src }); // Init user avatar image asynchronously
        }
        favicons.forEach(favicon => { favicon.href = userAvatar });
    }
    // Set default Crunchyroll favicon
    else {
        favicons.forEach(favicon => {
            favicon.href = `https://static.crunchyroll.com/cxweb/assets/img/favicons/favicon-${favicon.sizes}.png`
        });
    }
}

/*
 * Promise for document.querySelector(selector)
 * https://stackoverflow.com/a/61511955
 */
function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });
}