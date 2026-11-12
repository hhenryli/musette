import type { Album } from "../types/album"

type Props = {
  album: Album
}

export default function AlbumPic( {album}: Props) {
  return (
    <div
      style={{ backgroundColor: album.color }}
      className="aspect-square w-full"
    />
  )
}