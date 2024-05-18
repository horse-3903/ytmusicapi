async function fetchTracksFromAPI(link) {
    let params = link.split("?");
    params = params[params.length - 1];

    params = params.split("&")
    params = params.map(
        (p) => p.split("=")
    );
    
    params = Object.fromEntries(params);

    const id = params["list"]

    const response = await fetch(`https://localhost:8000/api-route/search-playlist?playlist-id=${id}`);
    const data = await response.json();

    console.log(data)
}

fetchTracksFromAPI("https://www.youtube.com/watch?v=NMA_isZYsYQ&list=RDCLAK5uy_mRcc2Y3l-RoZsDt27qu8CBGpKt-5w7v8g&start_radio=1")