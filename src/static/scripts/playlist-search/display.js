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
