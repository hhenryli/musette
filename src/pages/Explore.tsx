// Explore.tsx
import { useEffect, useState } from "react"
import { albums as baseAlbums } from "../data/albums.ts"
import type { Album } from "../types/album.ts"
import AlbumCard from "../components/AlbumCard.tsx"
import { searchAlbums, discoverAlbums } from "../utils/api.ts"

type Props = {
  searchQuery: string;
};

export default function Explore({ searchQuery }: Props) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [seenAlbums, setSeenAlbums] = useState<string[]>([]);

  useEffect(() => {
    async function discover() {
      setAlbums(await discoverAlbums(seenAlbums))
      setSeenAlbums(seenAlbums)
    }
    discover()

    const timeOut = setTimeout(async () => {
      if (!searchQuery.trim()) return;
      const results = await searchAlbums(searchQuery);
      setAlbums(results);
    }, 300);
    
    return () => clearTimeout(timeOut);
  }, [searchQuery]);

  return (
    <div className="w-full mt-8 flex flex-col gap-8">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
        {albums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>
    </div>
  );
}