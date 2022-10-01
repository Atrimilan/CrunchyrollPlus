// New features for Crunchyroll video player

var tool;

export default class PlayerTool {
    constructor(name, classList, icon) {
        tool = document.createElement("div");
        tool.id = name;
        tool.classList.add(...classList);

        tool.appendChild(createToolImg(`${name}_img`, icon));

        tool.addEventListener("click", (event) => {
            event.stopPropagation();    // Prevent click propagation
        });
    }
    get tool() { return tool; }
};

// Create an icon for the button
function createToolImg(id, icon) {
    var img = document.createElement('img');
    img.id = id;
    img.src = chrome.runtime.getURL(`images/controls/${icon}`);    // Requires web_accessible_resources in the manifest

    return img;
}