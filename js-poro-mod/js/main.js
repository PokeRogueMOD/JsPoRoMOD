import "../assets/styles/main.css";
import popupHtml from "../layouts/popup.html";
import { initPopup } from "./components/popup.js";

function loadMinimalMaterialize() {
    if (
        !document.querySelector(
            'link[href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"]'
        )
    ) {
        const materializeCSS = document.createElement("style");
        materializeCSS.innerHTML = `
            /* Toast specific styles */
            .toast {
                background-color: #323232;
                color: #fff;
                border-radius: 4px;
                padding: 8px 12px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.26);
                min-width: 100px;
                max-width: 100%;
                margin: 0 auto;
                display: inline-block;
            }
        `;
        document.head.appendChild(materializeCSS);

        const materializeJS = document.createElement("script");
        materializeJS.src =
            "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js";
        document.body.appendChild(materializeJS);
    }
}

function startPopup() {
    console.log("Loading popup HTML");
    document.body.insertAdjacentHTML("beforeend", popupHtml);
    console.log("Popup HTML injected");
    loadMinimalMaterialize(); // Load minimal Materialize styles
    initPopup();
    console.log("initPopup called");
}

window.startPopup = startPopup;

export { startPopup };
