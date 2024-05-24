from flask import Flask
from flask import render_template, jsonify
from flask import request, Response
from flask import abort

from ytmusicapi import YTMusic

import os
import subprocess
import pathlib

from tqdm import tqdm

import speedtest

import eyed3
import requests

import json

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/sites/playlist-search")
def playlist_search():
    return render_template("playlist-search.html")


# api stuff
@app.route("/api-route", methods=["GET", "POST"])
def api_route():
    if request.method == 'POST':
        return jsonify(request.get_data())        
    else:
        return jsonify(request.args)
    
@app.route("/api-route/speed-test", methods=["GET"])
def speed_test():
    try:
        st = speedtest.Speedtest(secure=True)
        download_speed = st.download() / 1000000  # Convert to Mbps
        upload_speed = st.upload() / 1000000  # Convert to Mbps

        return jsonify({
            "download": download_speed,
            "upload": upload_speed,
        })
    except speedtest.SpeedtestException as e:
        print(e)
        abort(500, e)

@app.route("/api-route/search-song", methods=["GET"])
def search_song_api():
    id = request.args["video-id"]

    ytmusicapi = YTMusic()
    res = ytmusicapi.get_song(id)

    return jsonify(res)

@app.route("/api-route/search-playlist", methods=["GET"])
def search_playlist_api():
    id = request.args["playlist-id"]
    filters = request.args.getlist("filter")

    ytmusicapi = YTMusic()
    res = ytmusicapi.get_playlist(id, limit=None)

    if len(filters) == 0 or len(filters) > 1:
        return jsonify(res)
    
    item_type = filters[0]

    tracks = res["tracks"]

    d = {
        "MUSIC_VIDEO_TYPE_OMV": "videos",
        "MUSIC_VIDEO_TYPE_UGC": "videos",
        "MUSIC_VIDEO_TYPE_ATV": "songs",
    }
    
    for id, tr in tqdm(enumerate(tracks)):
        title = tr["title"]
        artist = tr["artists"][0]["name"]

        if not tr.get("videoType") or d[tr["videoType"]] != item_type:
            search = ytmusicapi.search(query=title + artist, filter=item_type)[0]
            tracks[id] = search

            res["tracks"] = tracks
    
    return jsonify(res)

@app.route("/api-route/search-query", methods=["GET"])
def search_query_api():
    query = request.args["query"]
    limit = request.args.get("num")
    item_type = request.args.get("type")

    type_lst = ["songs", "videos", "albums", "artists", "playlists", "community_playlists", "featured_playlists", "uploads"]

    limit = int(limit)

    if item_type and item_type not in type_lst:
        abort(400)
    
    ytmusicapi = YTMusic()
    res = ytmusicapi.search(query=query, limit=limit, filter=item_type)

    return jsonify(res)

@app.route("/api-route/download-playlist", methods=["POST"])
def download_playlist():
    form = request.get_json(force=True)
    playlist_id = form["playlist-id"]

    dir = f"./downloads/playlists/{playlist_id}/"

    if os.path.exists(dir):
        return Response(status=200)
    
    p = subprocess.Popen(["youtube-dl", "--extract-audio", "--ignore-errors", "--audio-format", "mp3", "-o", f'downloads/playlists/{playlist_id}/%(playlist_index)s.%(ext)s', playlist_id])
    p.communicate()

    # print(["youtube-dl", "--extract-audio", "--ignore-errors", "--audio-format", "mp3", "-o", f'downloads/playlists/{playlist_id}/%(playlist_index)s.%(ext)s', playlist_id])

    return Response(status=200)

@app.route("/api-route/set-playlist", methods=["POST"])
def set_playlist():
    form = request.get_json(force=True)
    playlist_id = form["playlist-id"]
    data = form["data"]

    dir = f"./downloads/playlists/{playlist_id}/"

    if not os.path.exists(dir):
        abort(400)
    
    listdir = sorted(pathlib.Path(dir).iterdir(), key=os.path.getmtime)

    for idx, track in tqdm(enumerate(listdir)):
        file_path = str(track).replace("\\\\", "/")
        
        info = data[idx]
        # info = json.loads(info)

        audiofile = eyed3.load(file_path)

        audiofile.initTag(version=(2,3,0))

        audiofile.tag.title = info["title"]
        audiofile.tag.artist = info["artist"]
        audiofile.tag.album = info["album"]

        url = info["thumbnail"]
        url = url.split("=")
        url[-1] = "w512-h512-l90-rj"
        url = "=".join(url)

        response = requests.get(url)
        audiofile.tag.images.set(3, response.content, "image/jpeg")
        
        audiofile.tag.save()

        os.rename(file_path, f'./downloads/playlists/{playlist_id}/{info["title"]+".mp3"}')

    return Response(status=200)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)