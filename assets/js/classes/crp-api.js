export default class API {

    static get TOKEN() {    // Inspired by https://github.com/ThomasTavernier/Improve-Crunchyroll
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
            .catch((error) => console.log("%cCannot get cxApiParams", 'color:red;font-weight:bold'));

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
                .catch((error) => console.log("%cCannot get access_token", 'color:red;font-weight:bold'));
        });

        return token;
    }

    static get CMS() {  // Inspired by https://github.com/ThomasTavernier/Improve-Crunchyroll
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
                .catch((error) => console.log("%cCannot get cms_beta", 'color:red;font-weight:bold'));

        }).then((response) => {
            return response;
        })

        return cms;
    }

    static get EPISODE() {

        const episodeData = this.CMS.then(({ apiDomain, bucket, searchParams: sP }) => {

            const split = window.location.pathname.split('/');  // Split "<locale>/watch/<EPISODEID>/"
            const episodeId = split[split.length - 2];  // Extract the episode ID

            return fetch(`${apiDomain}/cms/v2${bucket}/objects/${episodeId}?locale=${sP.locale}&Signature=${sP.Signature}&Policy=${sP.Policy}&Key-Pair-Id=${sP['Key-Pair-Id']}`)
                .then((response) => response.json())
                .then(({ items }) => {
                    return { items: items[0], apiDomain, bucket, sP };
                })
                .catch((error) => console.log("%cCannot get current episode data", 'color:red;font-weight:bold'));

        }).then((response) => {
            return response;
        });

        return episodeData;
    }

    static get STREAM() {

        // We need to get the Episode first, to extract the Stream ID
        const streamData = this.EPISODE.then(({ items, apiDomain, bucket, sP }) => {

            const split = items.__links__.streams.href.split('/');  // Split ":/cms/v2/<bucket>/videos/<STREAMID>/streams
            const streamId = split[split.length - 2];   // Extract the streamId ID

            /* It would be nice to find the Stream ID in another way */

            return fetch(`${apiDomain}/cms/v2${bucket}/videos/${streamId}/streams?
            locale=${sP.locale}&Signature=${sP.Signature}&Policy=${sP.Policy}&Key-Pair-Id=${sP['Key-Pair-Id']}`)
                .then((response) => response.json())
                .then((response) => {
                    return { stream: response, subtitleLocaleKey: sP.locale };
                })
                .catch((error) => console.log("%cCannot get current episode data", 'color:red;font-weight:bold'));

        }).then((response) => {
            return response;
        });

        return streamData;
    }

    static get SUBTITLES() {

        const subtitles = this.STREAM.then(({ stream, subtitleLocaleKey }) => {

            // Some language codes needs to be converted first, like 'es-419' to 'es-LA'

            return stream.subtitles[subtitleLocaleKey]; // Locale identifier is used as a JSON key ("subtitleLocaleKey" here)

        }).then(({ format, locale, url }) => {
            return { format, locale, url };
        })

        return subtitles;
    }

    static OPENINGS(videoDuration, openingDuration) {
        /* 
         * How the opening detection works:
         * • The .ass file is parsed to JSON 
         * • Each dialogue has a Start and an End
         * • Substracting the new Start and the previous End gives the elapsed time between the two dialogues
         * • If the interval is longer than an opening duration (~1:30), it's considered as an opening
         *   Note : The opening duration is set by the user in the popup
         * 
         * Detection issues:
         * • If the translator hasn't given Name to dialogues, any text will be included in the detection (sign, credits, etc.)
         * • Depending on the language and the translator, words like "sign", "credits", might be differents and included in the detection
         * • Dubbed episodes openings are not detected at the moment, fetching subtitles in all languages could be a solution, but longer to calculate
         */
        const openings = this.SUBTITLES.then(({ format, locale, url }) => {

            if (locale === "en-US" || locale === "fr-FR") { // Supported languages (excluded words of other languages are not defined yet)

                if (format === "ass") {
                    const parser = require('ass-parser');

                    return fetch(url).then(response => response.text()).then(data => {

                        var openings = [];

                        const ass = parser(data, { comments: true });   // Parse ASS data to JSON: github.com/eush77/ass-parser
                        ass.forEach((data, index) => {

                            if (data.section === "Events") {

                                var prevEnd = "00:00:00.00";
                                const regex = new RegExp("^(sign|credits|crédits)$");   // Excluded words

                                data.body.forEach(({ key, value }, index) => {  // For each dialogue

                                    // Check if interval between two dialogues can contain an opening
                                    if (key == "Dialogue" && !regex.test(value.Name.toLowerCase())) {

                                        const prevEndSeconds = toSeconds(prevEnd);
                                        const startSeconds = toSeconds(value.Start);

                                        if ((startSeconds - prevEndSeconds) >= openingDuration) {
                                            openings.push({ "start": prevEndSeconds, "end": startSeconds, "start_full": prevEnd, "end_full": value.Start });
                                            console.log("Opening detected from " + prevEnd + " to " + value.Start + ", duration : " + (startSeconds - prevEndSeconds) + "s");
                                        }
                                        prevEnd = value.End;
                                    }

                                    // Check the interval from the last dialogues to the end of the video too 
                                    if (index === data.body.length - 1) {
                                        const videoDurationSeconds = Math.round(videoDuration);
                                        const interval = (videoDurationSeconds - toSeconds(prevEnd));

                                        // The 2nd condition is a workaround for subbed episodes, not definitive
                                        if (interval >= openingDuration && interval < videoDurationSeconds - 1) {
                                            openings.push({ "start": toSeconds(prevEnd), "end": videoDurationSeconds, "start_full": prevEnd, "end_full": toHHMMSS(videoDuration) });
                                            console.log("Opening detected from " + prevEnd + " to the end, duration : " + (videoDurationSeconds - toSeconds(prevEnd)) + "s");
                                        }
                                    }
                                });
                            }
                        });

                        return openings;

                    }).catch(error => console.log("%cOpening cannot be detected", 'color:red;font-weight:bold'));
                }
            }
        }).catch(error => console.log("%cSubtitles cannot be parsed or language is not available", 'color:red;font-weight:bold'));

        function toSeconds(hh_mm_ss) {
            const split = hh_mm_ss.split('.')[0].split(":");
            return (split[0] * 3600 + split[1] * 60 + (+split[2]));
        }

        function toHHMMSS(seconds) {
            return new Date(seconds * 1000).toISOString().substring(14, 19);
        }

        return openings;
    }
}