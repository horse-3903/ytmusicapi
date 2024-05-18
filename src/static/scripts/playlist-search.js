function toggleMode() {
    const checkbox = document.getElementById('mode');
    const body = document.body;
    if (checkbox.checked) {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
    }
}

async function searchPlaylist() {
    const link = document.getElementById('playlist-link').value;
    const tracksContainer = document.getElementById('tracks-container');
    tracksContainer.innerHTML = ''; // Clear previous results

    // Simulate API call to fetch tracks
    const tracks = await fetchTracksFromAPI(link);

    // Display tracks
    tracks.forEach(track => {
        const trackDiv = document.createElement('div');
        trackDiv.className = 'track';
        trackDiv.innerHTML = `
            <p><strong>${track.title}</strong> by ${track.artist}</p>
        `;
        tracksContainer.appendChild(trackDiv);
    });
}

// Mock function to simulate fetching tracks from an API
async function fetchTracksFromAPI(link) {
    // This is just mock data. Replace with actual API call.
    return [
        { title: 'Song 1', artist: 'Artist 1' },
        { title: 'Song 2', artist: 'Artist 2' },
        { title: 'Song 3', artist: 'Artist 3' }
    ];
}
