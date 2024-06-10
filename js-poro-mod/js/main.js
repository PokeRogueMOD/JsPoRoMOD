import "../assets/styles/main.css";
import popupHtml from "../layouts/popup.html";
import { initPopup } from "./components/popup.js";

window.addEventListener("load", () => {
    console.log("Loading popup HTML");
    document.body.insertAdjacentHTML("beforeend", popupHtml);
    console.log("Popup HTML injected");
    initPopup();
    console.log("initPopup called");
});
