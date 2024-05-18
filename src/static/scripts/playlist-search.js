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
            <div class="track-summary" onclick="toggleDetails(this)">
                <img src="${track.thumbnail}" alt="Thumbnail">
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
                        <td>Video ID</td>
                        <td>${track.videoId}</td>
                    </tr>
                    <tr>
                        <td>Duration</td>
                        <td>${track.duration}</td>
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
}

async function fetchTracksFromAPI(link) {
    let params = link.split("?");
    params = params[params.length - 1];

    params = params.split("&")
    params = params.map(
        (p) => p.split("=")
    );
    
    params = Object.fromEntries(params);

    const id = params.list

    const response = await fetch(`/api-route/search-playlist?playlist-id=${id}`);
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
        }
        ,
        {
            title: 'Song 4',
            artist: ['Artist 3'],
            thumbnail: 'https://via.placeholder.com/150',
            album: 'Album 3',
            videoId: '111213',
            duration: '2:55'
        }
        ,
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
