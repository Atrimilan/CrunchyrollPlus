// Keyboard input events listener
document.addEventListener('keydown', (event) => {
    var name = event.key;
    var code = event.code;

    switch (name) {
        case "c":
            console.clear();    // Clear the console
            break;
        case "s":
            timeout = setTimeout(() => { debugger; }, 0); // Pause page after 0 ms
            break;
    }
}, false);
// ----------------------------------------------------------------------------------------------------


var blurredThumbnailStyle = CreateStyleElement("blurredThumbnailStyle");
var themeColorStyle = CreateStyleElement("themeColorStyle");
var favicons = null;
var userAvatar = null;

// Create style element and add it to the DOM
function CreateStyleElement(id) {
    let myStyle = document.createElement('style');
    myStyle.id = id;
    document.getElementsByTagName('head')[0].appendChild(myStyle);

    return myStyle;
}

// Messages received from Popup
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

        switch (request.type) {
            case "toggleThumbnails":
                toggleThumbnails(request.state);
                break;
            case "themeColorUpdate":
                themeColorUpdate(request.themeColor);
                break;
            case "toggleAvatarFavicon":
                toggleAvatarFavicon(request.state);
                break;
        }
    }
);

// Load data from the chrome storage, and call needed functions
(function InitPage() {
    chrome.runtime.sendMessage({ type: "blurredThumbnails" }, function (response) {
        toggleThumbnails(response.message);
    });
    chrome.runtime.sendMessage({ type: "themeColor" }, function (response) {
        themeColorUpdate(response.message);
    });
    chrome.runtime.sendMessage({ type: "avatarFavicon" }, function (response) {
        toggleAvatarFavicon(response.message);
    });

})();


// ----------------------------------------------------------//
// Functions called on page initialization and edit in Popup //
// ----------------------------------------------------------//

function toggleThumbnails(state) {
    if (state) {
        // CSS to blur images
        blurredThumbnailStyle.innerHTML = `
        .prev-next-episodes img,.episode-list img,.erc-up-next-section img {
            filter: blur(20px);
            -webkit-filter: blur(20px);
            -moz-filter: blur(20px);
            -o-filter: blur(20px);
            -ms-filter: blur(20px);
        }`;
    } else {
        blurredThumbnailStyle.innerHTML = ``;
    }
}


function themeColorUpdate(color) {
    // CSS to change theme color
    // Cannot change the player bar color, because the default color is given in a style="" property
    themeColorStyle.innerHTML = `
    .erc-logo .logo-icon {
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
    } 
    `;
    /* Home gradient lines :
    .feed-divider--is-even--dCcSs {
        background-image: linear-gradient(to var(--cr-start-direction),${increaseBrightness(color, 75)},${color});
    }
    */

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

function toggleAvatarFavicon(state) {
    // Init favicon nodes
    if (favicons == null) {
        favicons = document.querySelectorAll('link[rel][type="image/png"]')
    }

    if (state) {
        // Init user avatar asynchronously
        if (userAvatar == null) {
            waitForElementLoaded('div[class="erc-header-avatar"] img[class="content-image__image--7tGlg"]').then(myImg => {
                userAvatar = myImg.src;
                // Then set user avatar as favicon
                favicons.forEach(favicon => {
                    favicon.href = userAvatar;
                });
            });
        } else {
            // Set user avatar as favicon
            favicons.forEach(favicon => {
                favicon.href = userAvatar;
            });
        }
    } else {
        // Set default favicon
        favicons.forEach(favicon => {
            favicon.href = `https://static.crunchyroll.com/cxweb/assets/img/favicons/favicon-${favicon.sizes}.png`
        });
    }
}

// Promise for document.querySelector(selector) : https://stackoverflow.com/a/61511955
function waitForElementLoaded(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
