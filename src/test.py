from ytmusicapi import YTMusic

ytmusicapi = YTMusic()
res = ytmusicapi.get_playlist(id)

print(res)