import type { Album } from "../types/album"

type Props = {
  album: Album
}

export default function AlbumPic( {album}: Props) {

  const artwork = album.artwork ? (
    <img
      className="album"
      src={album.artwork}
      alt={`${album.title} album cover`}
      loading="lazy"
    />
  ) : (
    <div
      className="album"
      style={{ backgroundColor: album.color }}
    />
  );
  
  return (
    <>
      {artwork}
    </>

  )
}