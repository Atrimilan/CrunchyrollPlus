
// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");

chrome.storage.sync.get("color", ({ color }) => {
    changeColor.style.backgroundColor = color;
});

changeColor.onclick = () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "moveForward"}, function(response) {
            console.log(response);
        });
    });
}


/*changeColor.onclick = () => {
    /*changeColor.style.backgroundColor = '#ff33ff';
    var test = ""

    var div = document.getElementsByTagName("div");
    var divList = Array.prototype.slice.call(div);
    divList.forEach(element => {
        test += element.id + " ";
    });
    alert(test);*/
/*  let time = 15;
  chrome.storage.sync.set({ time });
  /*chrome.storage.sync.set({ key: time }, function () {
      console.log('Value is set to ' + time);
  });*/
/*    alert("ok : " + time);
}*/