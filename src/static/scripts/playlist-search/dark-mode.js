function toggleMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');

    const errorMessage = document.getElementById('error-message');
    if (errorMessage.style.display === 'block') {
        errorMessage.classList.toggle('dark-mode', body.classList.contains('dark-mode'));
    }
}

window.onload = (ev) => {
    const mode = document.getElementById("mode");
    mode.checked = true;
    toggleMode();
}