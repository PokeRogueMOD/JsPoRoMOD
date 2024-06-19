// header.js
export function loadHeader(containerId, headerText) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Element with id '${containerId}' not found.`);
        return;
    }

    const headerElement = document.createElement('h2');
    headerElement.className = 'header';
    headerElement.textContent = headerText;
    container.insertBefore(headerElement, container.firstChild);
}
