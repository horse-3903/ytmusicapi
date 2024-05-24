import os
import eyed3

import json

from tqdm import tqdm

import requests

playlist_id = "PLeG6U6mYSDogd8J0478lQ461r26bfYg70"
data = json.load(open("temp.json", "r", encoding="utf-8"))

dir = f"./downloads/playlists/{playlist_id}/"

# listdir = sorted(pathlib.Path(dir).iterdir(), key=os.path.getmtime)

for idx, track in tqdm(enumerate(os.listdir(dir))):
    # file_path = str(track).replace("\\\\", "/")
    file_path = dir + track

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

    # break