export function loadDataScreen() {
    fetch('layouts/dataScreen.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('settings-container').innerHTML = data;
        })
        .catch(error => console.error('Error loading data screen:', error));
}
