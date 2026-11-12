import type { Album } from "../types/album";

const SEARCH_URL = `http://localhost:8000/albums/search`
const BASE_URL = `http://localhost:8000/albums/`

export async function searchAlbums( searchQuery: string ): Promise<Album[]> {
  try {
    console.log("searching:", searchQuery)
    const response = await fetch(
      `${SEARCH_URL}?q=${encodeURIComponent(searchQuery)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data;

  } catch(error) {
    console.error("Album search failed:", error);
  }
}

export async function getAlbumDetail( albumId: string): Promise<Album> {
  try {
    const response = await fetch(
      `${BASE_URL}/${albumId}`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch(error) {
    console.error("Album detail fetch failed", error);
  }
}