// Toggle dropdown visibility
function toggleDropdown() {
    const dropdown = document.getElementById('filter-dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';

    // Update dropdown for dark mode
    dropdown.classList.toggle('dark-mode', document.body.classList.contains('dark-mode'));
}

// Close dropdown when clicking outside
window.onclick = function(event) {
    const dropdown = document.getElementById('filter-dropdown');
    const mode = document.getElementById('mode');
    if (!event.target.matches('button') && !dropdown.contains(event.target)) {
        dropdown.style.display = 'none';
    }
}
