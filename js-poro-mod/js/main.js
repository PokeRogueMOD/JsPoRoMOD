import "../assets/styles/main.css";
import popupHtml from "../layouts/popup.html";
import { initPopup } from "./components/popup.js";

function loadRobotoFont() {
    if (
        !document.querySelector(
            'link[href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"]'
        )
    ) {
        const fontLink = document.createElement("link");
        fontLink.href =
            "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap";
        fontLink.rel = "stylesheet";
        document.head.appendChild(fontLink);
    }
}

function loadMinimalMaterialize() {
    if (
        !document.querySelector(
            'link[href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"]'
        )
    ) {
        const materializeCSS = document.createElement("link");
        materializeCSS.href =
            "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css";
        materializeCSS.rel = "stylesheet";
        document.head.appendChild(materializeCSS);

        const materializeJS = document.createElement("script");
        materializeJS.src =
            "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js";
        document.body.appendChild(materializeJS);
    }
}

function startPopup() {
    document.body.insertAdjacentHTML("beforeend", popupHtml);
    initPopup();
    console.log("initPopup called");
}

// document.addEventListener("DOMContentLoaded", () => {
loadMinimalMaterialize(); // Load minimal Materialize styles
loadRobotoFont(); // Load Roboto font
startPopup(); // Start popup after the DOM is fully loaded
// });
