/* Inspired by https://github.com/ThomasTavernier/Improve-Crunchyroll, by Thomas Tavernier (...but more readable to me 😅) */

export default class API {

    static get TOKEN() {
        const cxApiParams = fetch(window.location.href)
            .then((response) => response.text())
            .then((text) => {

                const initialState = JSON.parse(text.match(/(?<=window.__INITIAL_STATE__ = ){.*}/)[0]);
                const locale = initialState.localization.locale;

                const appConfig = JSON.parse(text.match(/(?<=window.__APP_CONFIG__ = ){.*}/)[0]);
                const accountAuthClientId = appConfig.cxApiParams.accountAuthClientId;
                const apiDomain = appConfig.cxApiParams.apiDomain;

                return { apiDomain, accountAuthClientId, locale };
            })
            .catch((error) => { console.log("%cCannot get cxApiParams", 'color:red;font-weight:bold'); });

        const token = cxApiParams.then(({ apiDomain, accountAuthClientId, locale }) => {
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
                    return { 'Authorization': `${token_type} ${access_token}`, apiDomain, locale };
                })
                .catch((error) => { console.log("%cCannot get access_token", 'color:red;font-weight:bold'); });
        });

        return token;
    }

    static get CMS() {
        const cms = this.TOKEN.then(({ Authorization, apiDomain, locale }) => {

            return fetch(`${apiDomain}/index/v2`, {
                headers: {
                    Authorization: Authorization,
                },
            })
                .then((response) => response.json())
                .then(({ cms_beta: { bucket, signature, policy, key_pair_id } }) => {
                    return {
                        apiDomain, bucket, searchParams: {
                            locale, Signature: signature, Policy: policy, 'Key-Pair-Id': key_pair_id
                        }
                    };
                })
                .catch((error) => { console.log("%cCannot get cms_beta", 'color:red;font-weight:bold'); });

        }).then((response) => {
            return response;
        })

        return cms;
    }

    static get EPISODE() {

        const episodeData = this.CMS.then(({ apiDomain, bucket, searchParams: sP }) => {

            const sp = window.location.pathname.split('/'); // Split "<locale>/watch/<EPISODEID>/"
            const episodeId = sp[sp.length - 2];  // Extract the episode ID

            return fetch(`${apiDomain}/cms/v2${bucket}/objects/${episodeId}?locale=${sP.locale}&Signature=${sP.Signature}&Policy=${sP.Policy}&Key-Pair-Id=${sP['Key-Pair-Id']}`)
                .then((response) => response.json())
                .then(({ items }) => {
                    return { items : items[0], apiDomain, bucket, sP };
                })
                .catch((error) => { console.log("%cCannot get current episode data", 'color:red;font-weight:bold'); });

        }).then((response) => {
            return response;
        });

        return episodeData;
    }

    static get STREAM() {

        // We need to get the Episode first, to extract the Stream ID
        const streamData = this.EPISODE.then(({ items, apiDomain, bucket, sP }) => {
            
            const sp2 = items.__links__.streams.href.split('/'); // Split ":/cms/v2/<bucket>/videos/<STREAMID>/streams
            const streamId = sp2[sp2.length - 2];   // Extract the streamId ID

            /* It would be nice to find the Stream ID in another way */
            
            return fetch(`${apiDomain}/cms/v2${bucket}/videos/${streamId}/streams?
            locale=${sP.locale}&Signature=${sP.Signature}&Policy=${sP.Policy}&Key-Pair-Id=${sP['Key-Pair-Id']}`)
                .then((response) => response.json())
                .then((response) => {
                    return { stream: response, subtitleLocaleKey: sP.locale };
                })
                .catch((error) => { console.log("%cCannot get current episode data", 'color:red;font-weight:bold'); });

        }).then((response) => {
            return response;
        });

        return streamData;
    }

    static get SUBTITLES() {

        const subtitles = this.STREAM.then(({ stream, subtitleLocaleKey }) => {
            return stream.subtitles[subtitleLocaleKey]; // Locale identifier is used as a JSON key ("subtitleLocaleKey" here)

        }).then(({ format, locale, url }) => {
            return { format, locale, url };
        })

        return subtitles;
    }
}