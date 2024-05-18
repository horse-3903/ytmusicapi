from flask import Flask
from flask import render_template, jsonify
from flask import request
from flask import abort

from test import *

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/sites/playlist-search")
def playlist_search():
    return render_template("playlist-search.html")

@app.route("/api-route", methods=["GET", "POST"])
def api_route():
    if request.method == 'POST':
        return jsonify(request.get_data())        
    else:
        return jsonify(request.args)

@app.route("/api-route/search-song", methods=["GET"])
def search_song_api():
    id = request.args["video-id"]

    ytmusicapi = YTMusic()
    res = ytmusicapi.get_song(id)

    return jsonify(res)

@app.route("/api-route/search-playlist", methods=["GET"])
def search_playlist_api():
    id = request.args["playlist-id"]

    ytmusicapi = YTMusic()
    res = ytmusicapi.get_playlist(id)

    return jsonify(res)

@app.route("/api-route/search-query", methods=["GET"])
def search_query_api():
    query = request.args["query"]
    limit = request.args["num"]
    item_type = request.args["type"]

    type_lst = ["songs", "videos", "albums", "artists", "playlists", "community_playlists", "featured_playlists", "uploads"]

    limit = int(limit)

    if item_type not in type_lst:
        abort(400)
    
    ytmusicapi = YTMusic()
    res = ytmusicapi.search(query=query, limit=limit, filter=item_type)

    return jsonify(res)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)