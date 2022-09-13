/* Inspired by https://github.com/ThomasTavernier/Improve-Crunchyroll, by Thomas Tavernier (...but more readable to me 😅) */

export default class API {
    static get Authorization() {
        const cxApiParams = fetch(window.location.href)
            .then((response) => response.text())
            .then((text) => {
                const appConfig = JSON.parse(text.match(/(?<=window.__APP_CONFIG__ = ){.*}/)[0]);
                const accountAuthClientId = appConfig.cxApiParams.accountAuthClientId;
                const apiDomain = appConfig.cxApiParams.apiDomain;
                return { apiDomain, accountAuthClientId };
            })
            .catch((error) => { console.log("%cImpossible to find __APP_CONFIG__", 'color:red;font-weight:bold'); });

        const token = cxApiParams.then(({ apiDomain, accountAuthClientId }) => {
            return fetch(`${apiDomain}/auth/v1/token`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',                // OAuth2 content type
                    'Authorization': `Basic ${window.btoa(`${accountAuthClientId}:`)}`, // User ID encrypted in Base64
                },
                body: 'grant_type=etp_rt_cookie',   // This cookie is required
            })
            .then((response) => response.json())
            .then(({ token_type, access_token, expires_in }) => {
                return { 'Authorization': `${token_type} ${access_token}`, apiDomain }; // Useful token informations
            })
            .catch((error) => { console.log("%cCannot get access_token", 'color:red;font-weight:bold'); });
        });

        return token;
    }
}