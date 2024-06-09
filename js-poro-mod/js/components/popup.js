
// popup.js
import { loadRollScreen } from './rollScreen.js';
import { loadAccountScreen } from './accountScreen.js';
import { loadDataScreen } from './dataScreen.js';

export function initPopup() {
    const popup = document.createElement('div');
    popup.className = 'popup-container';
    popup.innerHTML = `
        <div class="header">
            <h2>JS Poro Mod</h2>
            <img src="assets/images/logo.png" alt="Logo">
        </div>
        <div id="content"></div>
        <div class="footer">
            <button class="button" id="rollButton">Roll</button>
            <button class="button" id="accountButton">Account</button>
            <button class="button" id="dataButton">Data</button>
        </div>
    `;
    document.body.appendChild(popup);

    document.getElementById('rollButton').addEventListener('click', loadRollScreen);
    document.getElementById('accountButton').addEventListener('click', loadAccountScreen);
    document.getElementById('dataButton').addEventListener('click', loadDataScreen);

    loadRollScreen(); // Load default screen
}
