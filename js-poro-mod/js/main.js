import '../assets/styles/main.css';
import popupHtml from '../layouts/popup.html';
import { initPopup } from './components/popup.js';

function startPopup() {
  console.log('Loading popup HTML');
  document.body.insertAdjacentHTML('beforeend', popupHtml);
  console.log('Popup HTML injected');
  initPopup();
  console.log('initPopup called');
}

window.startPopup = startPopup;

export { initPopup, startPopup };
