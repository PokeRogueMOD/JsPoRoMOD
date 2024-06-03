document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.local.get(["Phaser"], function (result) {
        if (result.Phaser) {
            document.getElementById("output").innerText =
                "Global variable value: " + result.Phaser;
        } else {
            document.getElementById("output").innerText =
                "No global variable value found.";
        }
    });
});
