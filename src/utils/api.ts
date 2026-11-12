import type { Album } from "../types/album";

const API_URL = import.meta.env.VITE_API_URL;

const SEARCH_URL = `${API_URL}/albums/search`;
const BASE_URL = `${API_URL}/albums`;

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