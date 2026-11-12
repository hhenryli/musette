import type { Album } from "../types/album";

export function filterAlbums(albums: Album[], query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  
  return (
    albums.filter((album) => {

    const searchableText = [
      album.title,
      album.artist,
      album.year.toString(),
      ...album.moods,
    ]
      .join(" ")
      .toLowerCase();
  
    return (
      terms.every((term) => searchableText.includes(term))
    )
  })
  )
}
