export function loadAccountScreen() {
    fetch('layouts/accountScreen.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('settings-container').innerHTML = data;
        })
        .catch(error => console.error('Error loading account screen:', error));
}
