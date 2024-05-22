function toggleMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');

    const errorMessage = document.getElementById('error-message');
    if (errorMessage.style.display === 'block') {
        errorMessage.classList.toggle('dark-mode', body.classList.contains('dark-mode'));
    }
}

function displayTracks(tracks) {
    const tracksContainer = document.getElementById('tracks-container');

    tracks.forEach(track => {
        const trackDiv = document.createElement('div');
        trackDiv.className = 'track';
        
        trackDiv.setAttribute("data", JSON.stringify({
            title: track.title,
            artist: track.artist,
            album: track.album,
            duration: track.duration,
            videoId: track.videoId,
            thumbnail: track.thumbnail,
        }));

        trackDiv.setAttribute("mode", "display");

        trackDiv.innerHTML = `
            <div class="track-summary" onclick="toggleDetails(event)">
                <div class="track-info">
                    <img src="${track.thumbnail}" alt="${track.title}">
                    <div>
                        <p><strong>${track.title}</strong></p>
                        <p>${track.artist}</p>
                    </div>
                </div>
                <div class="track-buttons">
                    <button onclick="openTrack('${track.videoId}', event)" title="Open Track"><i class="fa fa-external-link"></i></button>
                    <button onclick="editTrack(this, event)" title="Edit Track"><i class="fa fa-pencil"></i></button>
                    <button onclick="downloadTrack('${track.videoId}', event)" title="Download Track"><i class="fa fa-download"></i></button>
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
            
            <div class="edit-controls" style="display: none">
                <button class="save-button" onclick="saveEdit(this)">Save</button>
                <button class="cancel-button" onclick="cancelEdit(this)">Cancel</button>
            </div>
        `;
        tracksContainer.appendChild(trackDiv);
    });
}

function toggleDetails(event) {
    if (event.target === event.currentTarget) {
        const details = event.currentTarget.nextElementSibling;
        details.classList.toggle('active');
    }
}

function openTrack(videoId, event) {
    event.stopPropagation();
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    window.open(url, '_blank');
}

function editTrack(element, event) {
    event.stopPropagation();

    const trackDiv = element.closest('.track');

    const editControls = trackDiv.querySelector('.edit-controls');

    // Toggle display of edit controls
    editControls.style.display = editControls.style.display === "block" ? "none" : "block";
    
    // Toggle details visibility
    const trackSummary = element.closest('.track-summary');
    toggleDetails({currentTarget: trackSummary, target: trackSummary});

    // Convert track summary labels into input fields
    const trackSummaryInfo = trackSummary.querySelector('.track-info');
    const trackSummaryLabels = trackSummaryInfo.querySelectorAll('p');

    trackSummaryLabels.forEach(label => {
        const inputField = document.createElement('input');
        inputField.setAttribute('type', 'text');
        inputField.value = label.textContent.trim();
        label.replaceWith(inputField);
    });

    // Convert only the second column of values in track details table into input fields
    const trackDetails = trackDiv.querySelector('.track-details');
    const trackDetailsInfo = trackDetails.querySelector('.track-details-table');
    const trackDetailsRows = trackDetailsInfo.querySelectorAll('tr');

    trackDetailsRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        // Make only the second column editable
        if (cells.length >= 2) {
            const inputField = document.createElement('input');
            inputField.setAttribute('type', 'text');
            inputField.value = cells[1].textContent.trim(); // Second column
            cells[1].textContent = ''; // Clear content
            cells[1].appendChild(inputField);
        }
    });
}

function saveEdit(saveButton) {
    // Save edit logic
}

function cancelEdit(cancelButton) {
    // Cancel edit logic
}

function downloadTrack(videoId, event) {
    event.stopPropagation();
}

function toggleDropdown() {
    const dropdown = document.getElementById('filter-dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';

    dropdown.classList.toggle('dark-mode', document.body.classList.contains('dark-mode'));
}

async function searchPlaylist() {
    const link = document.getElementById('playlist-link').value;
    const errorMessage = document.getElementById('error-message');

    clearResults();

    const loading = document.getElementById('loading');
    loading.style.display = 'flex';

    try {
        const tracks = await fetchTracksFromAPI(link);
        loading.style.display = 'none';
        displayTracks(tracks);
    } catch (error) {
        clearResults()
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = '<h3>Error fetching playlist. Please try again.</h3>';
        errorMessage.innerHTML += `<p>${error.stack}</p>`;
        
        errorMessage.classList.toggle('dark-mode', document.body.classList.contains('dark-mode'));
    }
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

    if (!link.startsWith("https://music.youtube.com/") && !link.startsWith("https://youtube.com/")){
        throw new Error("URLError: Invalid URL")
    }

    let params = link.split("?");
    params = params[params.length - 1];

    params = params.split("&");
    params = params.map((p) => p.split("="));

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
                artist: track.artists ? track.artists[0].name : "None",
                thumbnail: track.thumbnails ? track.thumbnails[0].url : console.log(track),
                album: track.album ? track.album.name : "None",
                videoId: track.videoId,
                duration: track.duration,
            }
        )
    );

    return tracks;
}

function clearResults() {
    const tracksContainer = document.getElementById('tracks-container');
    tracksContainer.innerHTML = `<div class="loading" id="loading" style="display: none;">
        <div class="loader"></div>
    </div>`;

    const errorMessage = document.getElementById('error-message');
    errorMessage.innerHTML = '';
    errorMessage.style.display = "none";
}

function Keydown(event) {
    if (event.key === 'Enter') {
        searchPlaylist();
    }
}

window.onclick = function(event) {
    const dropdown = document.getElementById('filter-dropdown');
    if (!event.target.matches('button') && !dropdown.contains(event.target)) {
        dropdown.style.display = 'none';
    }
}

document.addEventListener('keydown', Keydown);