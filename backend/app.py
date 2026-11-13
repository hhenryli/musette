from flask import Flask, request, jsonify
from flask_cors import CORS
from typing import TypedDict
import requests
import time
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv
import random
import utils


class BoardRow(TypedDict):
  board_id: str
  board_name: str
  board_description: str | None
  album_ids: list[str]
  board_layout: str
  board_created_at: str
  board_modified_at: str

class Board(TypedDict):
  id: str
  name: str
  description: str | None
  albumIds: list[str]
  layout: str
  createdAt: str
  modifiedAt: str

def row_to_board( row: BoardRow) -> Board:
  return (
    {
      "id" : row["board_id"],
      "name": row["board_name"],
      "description": row["board_description"],
      "albumIds": row["album_ids"],
      "layout": row["board_layout"],
      "createdAt": row["board_created_at"],
      "modifiedAt": row["board_modified_at"],
    }
  )

def get_db_connection():
  load_dotenv()

  try:
    conn = psycopg2.connect(
      os.getenv("DATABASE_URL")
    )
    return conn
  
  except psycopg2.Error as e:
    print(f"Database connection error {e}")
    conn = None

def create_table():
  conn = get_db_connection()
  if conn is None:
    return
  cursor = conn.cursor(cursor_factory=RealDictCursor)

  create_board_sql = """
    CREATE TABLE IF NOT EXISTS boards (
      board_id text PRIMARY KEY default gen_random_uuid()::text,
      board_name text NOT NULL,
      board_description text,
      album_ids text[] NOT NULL DEFAULT '{}',
      board_layout text NOT NULL CHECK (board_layout in ('grid', 'palette', 'freeform')) default 'grid',
      board_created_at timestamptz NOT NULL default now(),
      board_modified_at timestamptz NOT NULL default now()
    )
  """
  cursor.execute(create_board_sql)
  conn.commit()

  # close connections after
  cursor.close()
  conn.close()



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

def search_itunes(term, limit):
  entry = cache.get(term)
  if entry and time.time() - entry[0] < MAX_CACHE_TIME:
    # return array of formatted albums in cache
    return entry[1]
  
  response = requests.get(
    SEARCH_URL,
    params={
      "term": term,
      "entity": "album",
      "limit": limit,
    },
    timeout=15
  )
  response.raise_for_status()
  data = response.json()
  albums = data.get("results", [])
  formatted_albums = [format_album(album) for album in albums]
  cache[term] = (time.time(), formatted_albums)
  return formatted_albums

@app.get("/albums/search")
def search_albums():
  
  search = (request.args.get("q") or "").strip().lower()
  if (search == ""):
    return []
  
  try:
    return search_itunes(search, 15)
  except requests.exceptions.RequestException as e:
    print("iTunes search failed:", e)
    return {"error": str(e)}, 502

@app.get("/albums/discover")
def discover_albums():
  seen_ids = set((request.args.get("seen") or "").split(","))
  terms = random.sample(utils.DISCOVER_TERMS, 5)

  pool = []
  for term in terms:
    try:
      pool.extend(search_itunes(term, 5))
    except requests.exception.RequestException as e:
      print("iTunes search failed:", e)
      return {"error": str(e)}, 502

  unique_pool = list({album["id"] : album for album in pool}.values())
  fresh = [album for album in unique_pool if album["id"] not in seen_ids]

  random.shuffle(fresh)

  return fresh[:24]

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


@app.get("/boards")
def get_boards():
  conn = get_db_connection()
  if conn is None:
    return
  
  cursor = None
  try:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute('SELECT * FROM boards')
    results = cursor.fetchall()
    boards = [row_to_board(result) for result in results]
    return boards
  except psycopg2.Error as e:
    print(f"database cursor error: {e}")
    return jsonify({"error": "failed to fetch boards"}, 500)
  finally:
    conn.close()
    if cursor is not None:
      cursor.close()

@app.post("/boards")
def create_board():
  conn = get_db_connection()
  if conn is None:
    return
  
  cursor = None
  try:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    insert_sql_request = """
                        INSERT INTO boards (board_name, board_description)
                        VALUES ('', '')
                        RETURNING *
                        """
    cursor.execute(insert_sql_request)
    conn.commit()

    board = cursor.fetchone()
    return jsonify(row_to_board(board)), 201

  except psycopg2.Error as e:
    print(f"error adding board {e}")
    return jsonify({"error":"failed to add board"}), 500
  finally:
    conn.close()
    if conn is not None:
      cursor.close()

  
@app.patch("/boards/<board_id>")
def update_board(board_id):
  body = request.get_json()
  name = body.get("name")
  description = body.get("description")

  conn = get_db_connection()
  if conn is None:
    return

  cursor = None
  try:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    update_sql_request = """
                        UPDATE boards
                        SET board_name = %s, board_description = %s
                        WHERE board_id = %s
                        RETURNING *
                        """
    cursor.execute(update_sql_request, (name, description, board_id))
    conn.commit()

    board = cursor.fetchone()
    return jsonify(row_to_board(board)), 201

  except psycopg2.Error as e:
    print(f"error updating board {e}")
    return jsonify({"error":"failed to update board"}), 500
  finally:
    conn.close()
    if conn is not None:
      cursor.close()


@app.delete("/boards/<board_id>")
def delete_board(board_id):
  conn = get_db_connection()
  if conn is None:
    return
  
  cursor = None
  try:
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("DELETE FROM boards WHERE board_id = %s", 
                   (board_id,))
    if cursor.rowcount == 0:
      return jsonify({"error":"no board deleted"}), 404
    else:
      conn.commit()
      return jsonify({"success":"board deleted"}), 200

  except psycopg2.Error as e:
    print(f"error deleting board {e}")
    return jsonify({"error":"failed to delete board"}), 500
  finally:
    conn.close()
    if cursor is not None:
      cursor.close()


@app.post("/boards/<board_id>/albums/<album_id>")
def add_album_to_board(board_id, album_id):
  conn = get_db_connection()

  if conn is None:
    return
  
  cursor = None
  try:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    update_sql_query = """
      UPDATE boards
      SET album_ids = array_append(album_ids, %s), board_modified_at = now()
      WHERE board_id = %s
      RETURNING *
    """
    cursor.execute(update_sql_query, (album_id, board_id))
    result = cursor.fetchone()
    print(result)
    conn.commit()
    return jsonify(row_to_board(result)), 200
  except psycopg2.Error as e:
    print(f"Error adding album to board {e}")
    return jsonify({"error": "could not add album to board"}), 500
  finally:
    conn.close()
    if cursor is not None:
      cursor.close()

@app.delete("/boards/<board_id>/albums/<album_id>")
def remove_album_from_board(board_id, album_id):
  conn = get_db_connection()

  if conn is None:
    return
  
  cursor = None
  try:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    update_sql_query = """
      UPDATE boards
      SET album_ids = array_remove(album_ids, %s), board_modified_at = now()
      WHERE board_id = %s
      RETURNING *
    """
    cursor.execute(update_sql_query, (album_id, board_id))
    result = cursor.fetchone()
    conn.commit()
    return jsonify(row_to_board(result)), 200
  except psycopg2.Error as e:
    print(f"Error removing album from board {e}")
    return jsonify({"error": "could not remove album from board"}), 500
  finally:
    conn.close()
    if cursor is not None:
      cursor.close()


if __name__ == "__main__":
  app.run(debug=True, port=8000)
