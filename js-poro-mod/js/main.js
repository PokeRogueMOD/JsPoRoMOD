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
        const materializeJS = document.createElement("script");
        materializeJS.src =
            "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js";
        document.body.appendChild(materializeJS);
    }
}

function disableKeyboardInteraction(popupSelector) {
    const popupElements = document.querySelectorAll(`${popupSelector} *`);

    popupElements.forEach((element) => {
        // Disable keyboard interactions for buttons and other non-input elements
        if (element.tagName !== "INPUT" && element.tagName !== "TEXTAREA") {
            element.addEventListener("keydown", function (event) {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                }
            });
        }
        // Disable space and enter actions for input fields
        else {
            element.addEventListener("keydown", function (event) {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                }
            });
        }
    });
}

function startPopup() {
    console.log("Loading popup HTML");
    document.body.insertAdjacentHTML("beforeend", popupHtml);
    console.log("Popup HTML injected");
    loadMinimalMaterialize(); // Load minimal Materialize styles
    initPopup();
    console.log("initPopup called");
    disableKeyboardInteraction(".popup"); // Disable keyboard interactions for the popup
}

window.startPopup = startPopup;

loadRobotoFont(); // Load Roboto font
startPopup();
