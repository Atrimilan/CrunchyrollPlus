// Add Crunchyroll video player buttons

var tool;

export default class PlayerTool {
    constructor(name, classList, icon, optional = { size: 20 }) {
        tool = document.createElement("div");
        tool.id = name;
        tool.classList.add(...classList);

        tool.appendChild(createToolImg(`${name}_img`, icon, optional.size));

        tool.addEventListener("click", (event) => {
            event.stopPropagation();    // Prevent click propagation
        });
    }
    get tool() { return tool; }
};

// Create an icon for the button
function createToolImg(id, icon, size) {
    var img = document.createElement('img');
    img.id = id;
    img.height = size;  // Default 20px, but can be specified
    img.src = chrome.runtime.getURL(`images/controls/${icon}`);    // Requires web_accessible_resources in the manifest

    return img;
}