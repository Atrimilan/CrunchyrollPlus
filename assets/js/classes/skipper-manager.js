import MessageAPI from '../classes/message-api.js';
import Skipper from '../classes/skipper.js';

var openingList = [];
var crpSkipperList = [];
var video;
var isMenuOpen;

export default class SkipperManager {

    static async initOpeningSkipper(videoPlayer, skipperParent) {
        video = videoPlayer;

        // Check if CRP skippers are enabled, and get the duration of an opening
        var { enabled, openingDuration } = await MessageAPI.getStorage("crpSkipper");

        if (enabled) {
            // Openings need to be detected from main page content-script to avoid CORS restrictions when accessing subtitles links
            const opList = (await MessageAPI.sendToContentScripts("detectOpenings", { openingDuration, videoDuration: video.duration }));

            // Hide default opening skipper if any opening is found
            if (opList.length != 0) {
                var defaultSkipper = createStyleElement("hideDefaultSkipper");
                defaultSkipper.innerHTML = ` div[data-testid="skipButton"], #skipButton { display:none; } `;
            }

            // Create a new skipper for each opening
            opList.forEach((op, index) => {
                const skipper = new Skipper(index, skipperParent);
                crpSkipperList.push(skipper.crpSkipper);

                op.skipperId = skipper.crpSkipper.id;
                op.skipperTimerId = skipper.timer.id;
                op.handler = "none";
            });

            startListeningVideoPlayer(opList, openingDuration);
        };

        function createStyleElement(id) {
            var myStyle = document.createElement('style');
            myStyle.id = id;
            document.getElementsByTagName('head')[0].appendChild(myStyle);

            return myStyle;
        }

        // Listen to the video player timeupdate, and display the opening skipper if it is the right time
        function startListeningVideoPlayer(openings, opDuration) {
            openingList = openings; // Now used as a global variable
            var remainingTimeSec, expectedTimeSec;

            video.addEventListener("timeupdate", function () {
                var time = Math.round(this.currentTime);

                openingList.forEach((op, index) => {
                    const crpSkipper = crpSkipperList[index];   // Get Skipper
                    const { start, end, skipperTimerId } = op;  // Get OP data

                    if (time >= start && time < end) {  // If this opening is playing
                        remainingTimeSec = end - time > opDuration ? opDuration : end - time;
                        const remainingTime = new Date(remainingTimeSec * 1000).toISOString().substring(14, 19);
                        crpSkipper.querySelector('#' + skipperTimerId).innerText = `(${remainingTime})`;    // Update remaining time

                        expectedTimeSec = video.currentTime + ~~remainingTimeSec;   // Time expected when the user click on the skipper

                        if (op.handler === "none") { enableSkipper(); } // Enable if not handled yet
                    }
                    else if (op.handler !== "none") {
                        disableSkipper();   // Disable if handled while opening has ended
                    }

                    function enableSkipper() {
                        op.handler = "initializing";    // Prevent multiple handlings at the same time
                        crpSkipper.style.visibility = "visible";
                        crpSkipper.style.opacity = 1;   // Force the skipper to be displayed for a moment

                        addSkipperEvents(); // Skipper mouse events

                        const timeout = (((end - time) * 1000) > 4000) ? 4000 : ((end - time) * 1000);  // Timeout (max: 4s)
                        setTimeout(() => {
                            crpSkipper.style.opacity = isMenuOpen ? 1 : 0;
                            op.handler = "mouseMovements"; // Skipper is now handled by mouse movements
                        }, timeout);
                    }

                    function disableSkipper() {
                        removeSkipperEvents();

                        op.handler = "none";    // Stop handling
                        crpSkipper.style.opacity = 0;
                        setTimeout(() => { crpSkipper.style.visibility = 'collapse'; }, 300);   // Wait for opacity transition (0.3s)
                    }

                    /* --- Events --- */

                    function click() { video.currentTime = expectedTimeSec }
                    function mouseover() { crpSkipper.style.opacity = 1 }

                    function addSkipperEvents() {
                        crpSkipper.addEventListener('click', click);    // Skip the opening
                        crpSkipper.addEventListener('mouseover', mouseover);   // Don't hide on hover
                    }

                    function removeSkipperEvents() {
                        crpSkipper.removeEventListener('click', click);
                        crpSkipper.removeEventListener('mouseover', mouseover);
                    }
                });
            }, false);
        }
    }

    // Toggle skipper if an opening is playing
    static openingSkippersVisible(state) {
        isMenuOpen = state;

        openingList.forEach((op, index) => {
            const crpSkipper = crpSkipperList[index];

            if (op.handler === "mouseMovements") {
                crpSkipper.style.opacity = state ? 1 : 0;
            }
            else if (op.handler === "none") {
                crpSkipper.style.opacity = 0;

                setTimeout(() => {
                    if (op.handler === "none") {    // Check if during the timeout handler hasn't changed
                        crpSkipper.style.visibility = 'collapse';
                    }
                }, 300);  // Wait for opacity transition (0.3s)
            }
        });
    }
}