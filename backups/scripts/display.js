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
        }))

        trackDiv.innerHTML = `
            <div class="track-summary" onclick="toggleDetails(this)">
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

function toggleDetails(element) {
    const details = element.nextElementSibling;
    details.classList.toggle('active');
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
    toggleDetails(trackSummary);

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
    
}

function cancelEdit(cancelButton) {
    
}

function downloadTrack(videoId, event) {
    event.stopPropagation();
}
