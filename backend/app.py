from flask import Flask, request
from flask_cors import CORS
import requests
import time

app = Flask(__name__)

CORS(app, origins=["http://localhost:5173", "https://musette-frontend.vercel.app"])

SEARCH_URL = "https://itunes.apple.com/search"
LOOKUP_URL = "https://itunes.apple.com/lookup"

MAX_CACHE_TIME = 3600
# a cache will look like { "search term" : tuple, "search term" : tuple, } -> {"radiohead" : (timestamp, [ {}, {} ])}
cache = {}


def format_album(album):
  return {
    "id": str(album.get("collectionId", "")),
    "title": album.get("collectionName", ""),
    "artist": album.get("artistName", ""),
    "year": int(album.get("releaseDate", "")[:4]),
    "artwork": album.get("artworkUrl100", "").replace("100x100bb", "600x600bb")
  }

    
@app.get("/albums/search")
def search_albums():
  
  search = (request.args.get("q") or "").strip().lower()
  if (search == ""):
    return []
  
  entry = cache.get(search)
  
  if entry and time.time() - entry[0] < MAX_CACHE_TIME:
    # return array of formatted albums in cache
    print("cache hit")
    return entry[1]
  else:
    try:
      response = requests.get(
        SEARCH_URL,
        params={
          "term": search,
          "entity": "album",
          "limit": 3,
        },
        timeout=15
      )

      print("request finished")

      response.raise_for_status()
      data = response.json()
      albums = data.get("results", [])

    except requests.exceptions.RequestException as e:
        print("iTunes search failed:", e)
        return {"error": str(e)}, 502


    formatted_albums = [format_album(album) for album in albums]
    cache[search] = (time.time(), formatted_albums)
    return formatted_albums

@app.get("/albums/<album_id>")
def get_album_details(album_id):

  try:
    response = requests.get(
      LOOKUP_URL,
      params={
        "id": album_id,
        "entity": "song",
      },
      timeout=15
    )

    response.raise_for_status()
    data = response.json()
    
    #get track data
    results = data.get("results", [])

    if not results:
      return {"error": "album not found"}
    
    else:
      album = format_album(results[0])

      formatted_tracks = [
        {
          "title": result.get("trackCensoredName", ""),
          "duration": result.get("trackTimeMillis", 0)
        }
        for result in results[1:]
      ]

      album["tracks"] = formatted_tracks

      return album

  except requests.exceptions.RequestException as e:
      print("iTunes lookup failed:", e)
      return {"error": str(e)}, 502

if __name__ == "__main__":
  app.run(debug=True, port=8000)