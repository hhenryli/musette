import type { Album } from "../types/album";

const SEARCH_URL = `http://localhost:8000/albums/search`
const BASE_URL = `http://localhost:8000/albums`

export async function searchAlbums(searchQuery: string): Promise<Album[]> {
  const response = await fetch(
    `${SEARCH_URL}?q=${encodeURIComponent(searchQuery)}`
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

export async function getAlbumDetail(albumId: string): Promise<Album> {
  const response = await fetch(`${BASE_URL}/${albumId}`);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}