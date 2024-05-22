function clearResults() {
    const tracksContainer = document.getElementById('tracks-container');
    tracksContainer.innerHTML = '';

    const errorMessage = document.getElementById('error-message');
    errorMessage.innerHTML = '';
    errorMessage.style.display = "none";
}
