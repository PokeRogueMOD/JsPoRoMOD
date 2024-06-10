import "../assets/styles/main.css";
import popupHtml from "../layouts/popup.html";
import { initPopup } from "./components/popup.js";

window.addEventListener("load", () => {
    document.body.insertAdjacentHTML("beforeend", popupHtml);
    initPopup();
});
