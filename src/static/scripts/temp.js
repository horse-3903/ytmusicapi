function toggleMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');

    const errorMessage = document.getElementById('error-message');
    if (errorMessage.style.display === 'block') {
        errorMessage.classList.toggle('dark-mode', body.classList.contains('dark-mode'));
    }
}

function raiseError(title, msg) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.style.display = 'block';
    errorMessage.innerHTML = `<h3>${title}.</h3>`;
    errorMessage.innerHTML += `<p>${msg}</p>`;
    
    errorMessage.classList.toggle('dark-mode', document.body.classList.contains('dark-mode'));
}

function displayTracks(data) {
    const tracksContainer = document.getElementById('tracks-container');

    tracksContainer.setAttribute("playlist-id", data["playlist-id"]); 
    tracksContainer.setAttribute("duration", data["duration"]); 

    const tracks = data["tracks"];

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
                    <button onclick="openTrack('${track.videoId}')" title="Open Track"><i class="fa fa-external-link"></i></button>
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
    if (event.target.closest('div').getAttribute("class") !== "track-buttons") {
        const details = event.currentTarget.nextElementSibling;
        details.classList.toggle('active');
    }
}

function openTrack(videoId) {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    window.open(url, '_blank');
}

function editTrack(element, event) {
    const trackDiv = element.closest('.track');

    if (trackDiv.getAttribute("mode") !== "display"){
        cancelEdit(element);
        return;
    }

    trackDiv.setAttribute("mode", "edit");

    const editControls = trackDiv.querySelector('.edit-controls');

    // Toggle details visibility
    const trackSummary = element.closest('.track-summary');
    
    if (!trackSummary.nextElementSibling.classList.contains("active")){
        toggleDetails({currentTarget: trackSummary, target: trackSummary});
    }

    // Toggle display of edit controls
    editControls.style.display = editControls.style.display === "block" ? "none" : "block";

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
    const trackDiv = saveButton.closest('.track');
    const trackSummary = trackDiv.querySelector('.track-summary');
    const trackDetails = trackDiv.querySelector('.track-details');

    // Update the data attribute
    const updatedTrack = {
        title: trackSummary.querySelector('.track-info input[type="text"]').value,
        artist: trackSummary.querySelector('.track-info input[type="text"]:nth-child(2)').value,
        album: trackDetails.querySelector('tr:nth-child(1) td:nth-child(2) > input[type="text"]').value,
        duration: trackDetails.querySelector('tr:nth-child(2) td:nth-child(2) > input[type="text"]').value,
        videoId: trackDetails.querySelector('tr:nth-child(3) td:nth-child(2) > input[type="text"]').value,
        thumbnail: trackDiv.getAttribute("data").thumbnail // Thumbnail is not editable
    };

    trackDiv.setAttribute("data", JSON.stringify(updatedTrack));

    // Convert inputs back to labels
    const trackSummaryInfo = trackSummary.querySelector('.track-info');
    const trackSummaryInputs = trackSummaryInfo.querySelectorAll('input');

    const title = document.createElement('p');
    title.innerHTML = `<strong>${trackSummaryInputs[0].value}</strong>`;
    trackSummaryInputs[0].replaceWith(title);

    const artist = document.createElement('p');
    artist.textContent = trackSummaryInputs[1].value;
    trackSummaryInputs[1].replaceWith(artist);

    const trackDetailsInputs = trackDetails.querySelectorAll('.track-details input');
    trackDetailsInputs.forEach(input => {
        input.parentElement.innerHTML = input.value;
    });

    trackDiv.setAttribute("mode", "display");
    trackDiv.querySelector('.edit-controls').style.display = 'none';
}

function cancelEdit(cancelButton) {
    const trackDiv = cancelButton.closest('.track');
    const trackData = JSON.parse(trackDiv.getAttribute('data'));
    const trackSummary = trackDiv.querySelector('.track-summary');
    const trackDetails = trackDiv.querySelector('.track-details');

    // Revert to original values from data attribute
    const originalTrack = {
        title: trackData.title,
        artist: trackData.artist,
        album: trackData.album,
        duration: trackData.duration,
        videoId: trackData.videoId,
        thumbnail: trackData.thumbnail
    };

    // Convert inputs back to labels with original values
    const trackSummaryInfo = trackSummary.querySelector('.track-info');
    const trackSummaryInputs = trackSummaryInfo.querySelectorAll('input');

    const title = document.createElement('p');
    title.innerHTML = `<strong>${originalTrack.title}</strong>`;
    trackSummaryInputs[0].replaceWith(title);

    const artist = document.createElement('p');
    artist.textContent = originalTrack.artist;
    trackSummaryInputs[1].replaceWith(artist);

    const trackDetailsInputs = trackDetails.querySelectorAll('.track-details input');
    const detailValues = [originalTrack.album, originalTrack.duration, originalTrack.videoId];

    trackDetailsInputs.forEach((input, index) => {
        input.parentElement.innerHTML = detailValues[index];
    });

    trackDiv.setAttribute("mode", "display");
    trackDiv.querySelector('.edit-controls').style.display = 'none';
}

function downloadTrack(videoId, event) {
    // event.stopPropagation();
}

async function downloadPlaylist() {
    console.log("running")
    const tracksContainer = document.getElementById('tracks-container');
    const id = tracksContainer.getAttribute("playlist-id");
    
    // const duration = tracksContainer.getAttribute("duration");
    // const size = duration / 60;

    if (!id) {
        raiseError("Error downloading playlist. Please try again.", "Playlist has not been instantiated.");
    }
    
    // let response = await fetch("/api-route/speed-test");
    // const speed = await response.json();
    // const download = speed.download;

    const tracks_data = new Array()
    const tracks = tracksContainer.querySelectorAll(".track");

    tracks.forEach(
        (t) => {
            tracks_data.push(t.getAttribute("data"));
        }
    )

    // const worker = new Worker('webworker.js');
    // const progressWrapper = document.querySelector(".progress-wrapper");
    // const progressBar = document.querySelector('#progress-bar');

    // progressWrapper.style = "display: flex";

    // worker.onmessage = function(e) {
    //     progressBar.value = e.data;
    // }

    response = await fetch("/api-route/download-playlist", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "playlist-id": id,
        }),
    });

    // response = await fetch("/api-route/set-playlist", {
    //     method: "POST",
    //     body: JSON.stringify({
    //         "playlist-id": id,
    //         data: tracks_data,
    //     }),
    // });
}

function toggleDropdown() {
    const dropdown = document.getElementById('filter-dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';

    dropdown.classList.toggle('dark-mode', document.body.classList.contains('dark-mode'));
}

async function searchPlaylist() {
    const link = document.getElementById('playlist-link').value;

    clearResults();

    const loading = document.getElementById('loading');
    loading.style.display = 'flex';

    try {
        const data = await fetchTracksFromAPI(link);
        loading.style.display = 'none';
        displayTracks(data);
    } catch (error) {
        clearResults()
        raiseError("Error fetching playlist. Please try again.", error.stack)
    }
}

async function fetchTracksFromAPI(link) {
    if (!link) {
        return {
            "playlist-id": "test",
            duration: 995,
            tracks: [
                {
                    title: 'Song 1',
                    artist: 'Artist 1',
                    thumbnail: 'https://via.placeholder.com/150',
                    album: 'Album 1',
                    videoId: '12345',
                    duration: '3:45'
                },
                {
                    title: 'Song 2',
                    artist: 'Artist 2',
                    thumbnail: 'https://via.placeholder.com/150',
                    album: 'Album 2',
                    videoId: '67890',
                    duration: '4:05'
                },
                {
                    title: 'Song 3',
                    artist: 'Artist 3',
                    thumbnail: 'https://via.placeholder.com/150',
                    album: 'Album 3',
                    videoId: '111213',
                    duration: '2:55'
                },
                {
                    title: 'Song 4',
                    artist: 'Artist 3',
                    thumbnail: 'https://via.placeholder.com/150',
                    album: 'Album 3',
                    videoId: '111213',
                    duration: '2:55'
                },
                {
                    title: 'Song 5',
                    artist: 'Artist 3',
                    thumbnail: 'https://via.placeholder.com/150',
                    album: 'Album 3',
                    videoId: '111213',
                    duration: '2:55'
                }
            ]
        };
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
                thumbnail: track.thumbnails ? track.thumbnails[track.thumbnails.length-1].url : console.log(track),
                album: track.album ? track.album.name : "None",
                videoId: track.videoId,
                duration: track.duration,
            }
        )
    );

    return {
        "playlist-id": id,
        duration: data.duration_seconds,
        tracks: tracks,
    };
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