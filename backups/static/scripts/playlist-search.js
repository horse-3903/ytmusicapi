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

async function searchPlaylist() {
    const link = document.getElementById('playlist-link').value;
    const errorMessage = document.getElementById('error-message');

    clearResults();

    try {
        const tracks = await fetchTracksFromAPI(link);
        displayTracks(tracks);
    } catch (error) {
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = '<h3>Error fetching playlist. Please try again.</h3>';
        errorMessage.innerHTML += `<p>${error}</p>`;
        
        // Update error message for dark mode
        errorMessage.classList.toggle('dark-mode', document.body.classList.contains('dark-mode'));
    }
}

function displayTracks(tracks) {
    const tracksContainer = document.getElementById('tracks-container');

    tracks.forEach(track => {
        const trackDiv = document.createElement('div');
        trackDiv.className = 'track';
        trackDiv.innerHTML = `
            <div class="track-summary" onclick="toggleDetails(this)">
                <img src="${track.thumbnail}" alt="${track.title}">
                <div class="track-info">
                    <p><strong>${track.title}</strong></p>
                    <p>${track.artist}</p>
                </div>
            </div>
            <div class="track-details">
                <table class="track-details-table">
                    <tr>
                        <td>Album</td>
                        <td>${track.album}</td>
                    </tr>
                    <tr>
                        <td>Duration</td>
                        <td>${track.duration}</td>
                    </tr>
                    <tr>
                        <td>Video ID</td>
                        <td>${track.videoId}</td>
                    </tr>
                </table>
            </div>
        `;
        tracksContainer.appendChild(trackDiv);
    });
}

function toggleDetails(element) {
    const details = element.nextElementSibling;
    details.classList.toggle('active');
}

function clearResults() {
    const tracksContainer = document.getElementById('tracks-container');
    tracksContainer.innerHTML = '';

    const errorMessage = document.getElementById('error-message');
    errorMessage.innerHTML = '';
    errorMessage.style.display = "none";
}

async function fetchTracksFromAPI(link) {
    if (!link) {
        return [
            {
                title: 'Song 1',
                artist: ['Artist 1'],
                thumbnail: 'https://via.placeholder.com/150',
                album: 'Album 1',
                videoId: '12345',
                duration: '3:45'
            },
            {
                title: 'Song 2',
                artist: ['Artist 2'],
                thumbnail: 'https://via.placeholder.com/150',
                album: 'Album 2',
                videoId: '67890',
                duration: '4:05'
            },
            {
                title: 'Song 3',
                artist: ['Artist 3'],
                thumbnail: 'https://via.placeholder.com/150',
                album: 'Album 3',
                videoId: '111213',
                duration: '2:55'
            },
            {
                title: 'Song 4',
                artist: ['Artist 3'],
                thumbnail: 'https://via.placeholder.com/150',
                album: 'Album 3',
                videoId: '111213',
                duration: '2:55'
            },
            {
                title: 'Song 5',
                artist: ['Artist 3'],
                thumbnail: 'https://via.placeholder.com/150',
                album: 'Album 3',
                videoId: '111213',
                duration: '2:55'
            }
        ];
    }

    const checkboxes = document.querySelectorAll('#filter-dropdown input[type="checkbox"]:checked');
    const filters = Array.from(checkboxes).map(checkbox => checkbox.value);

    let params = link.split("?");
    params = params[params.length - 1];

    params = params.split("&");
    params = params.map(
        (p) => p.split("=")
    );

    params = Object.fromEntries(params);

    const id = params.list;
    
    var api_params = new URLSearchParams();
    api_params.append("playlist-id", id);

    for (let i = 0; i < filters.length; i++){
        api_params.append("filter", filters[i]);
    }

    const response = await fetch('/api-route/search-playlist?' + api_params);
    const data = await response.json();

    const tracks = data.tracks.map(
        (track) => (
            {
                title: track.title,
                artist: track.artists[0].name,
                thumbnail: track.thumbnails[0].url,
                album: track.album ? track.album.name : "None",
                videoId: track.videoId,
                duration: track.duration,
            }
        )
    );

    return tracks;
}
