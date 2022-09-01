
// Keyboard input events listener
document.addEventListener('keydown', (event) => {
    var name = event.key;
    var code = event.code;

    switch (name) {
        case "c":
            console.clear();    // Clear the console
            break;
        case "s":
            setTimeout(() => { debugger; }, 0); // Pause page after 0 ms
            break;
    }
}, false);