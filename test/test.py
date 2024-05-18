from ytmusicapi import YTMusic

import json

id = "PLeG6U6mYSDogd8J0478lQ461r26bfYg70"

ytmusicapi = YTMusic()
res = ytmusicapi.get_playlist(id)

with open("./test/res.json", "w+") as f:
    f.write(json.dumps(res, indent=4))