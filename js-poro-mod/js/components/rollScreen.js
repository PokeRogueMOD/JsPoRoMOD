export function loadRollScreen() {
    fetch('layouts/rollScreen.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('settings-container').innerHTML = data;
        })
        .catch(error => console.error('Error loading roll screen:', error));
}
