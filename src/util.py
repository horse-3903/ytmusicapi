from ytmusicapi import YTMusic

def search_id(id: str) -> dict:
    ytmusicapi = YTMusic()

    return ytmusicapi.get_song(id)
