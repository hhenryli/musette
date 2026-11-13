import type { Album } from "../types/album";
import type { Board } from "../types/board";

const API_URL = import.meta.env.VITE_API_URL;

const ALBUM_BASE_URL = `${API_URL}/albums`;
const BOARD_BASE_URL = `${API_URL}/boards`

export async function discoverAlbums( albumIds: string[]): Promise<Album[]> {
  const response = await fetch(
    `${ALBUM_BASE_URL}/discover?seen=${albumIds.join(",")}`
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

export async function searchAlbums(searchQuery: string): Promise<Album[]> {
  const response = await fetch(
    `${ALBUM_BASE_URL}/search?q=${encodeURIComponent(searchQuery)}`
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

export async function getAlbumDetail(albumId: string): Promise<Album> {
  const response = await fetch(`${ALBUM_BASE_URL}/${albumId}`);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

export async function getBoards() : Promise<Board[]> {
  const response = await fetch(`${BOARD_BASE_URL}`);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

export async function createBoard() : Promise<Board> {
  const response = await fetch(`${BOARD_BASE_URL}`, {method: 'POST'});

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

export async function updateBoard( boardId: string, boardName: string, boardDescription: string ) {
  const response = await fetch(`${BOARD_BASE_URL}/${boardId}`, 
                                { method: 'PATCH',
                                  headers: { "Content-Type": "application/json"},
                                  body: JSON.stringify({name: boardName, description: boardDescription}), 
                                },
                              );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

export async function deleteBoard( boardId: string ) {
  const response = await fetch(`${BOARD_BASE_URL}/${boardId}`, {method: 'DELETE'});

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
}

export async function addAlbumToBoard( boardId: string, album_id: string ) {
  const response = await fetch(`${BOARD_BASE_URL}/${boardId}/albums/${album_id}`, {method: 'POST'});

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}


export async function removeAlbumFromBoard( boardId: string, album_id: string ) {
  const response = await fetch(`${BOARD_BASE_URL}/${boardId}/albums/${album_id}`, {method: 'DELETE'});

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}