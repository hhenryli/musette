import type { Album } from "../types/album";
import AlbumCard from "./AlbumCard";

type Props = {
  albums: Album[];
  onAdd?: (album: Album) => void;
  onPreview?: (album: Album) => void;
}

export default function AlbumGrid( {albums, onAdd, onPreview}: Props) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] w-full gap-4">
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} onAdd={onAdd} onPreview={() => onPreview?.(album)} />
      ))}
    </div>
  )
}