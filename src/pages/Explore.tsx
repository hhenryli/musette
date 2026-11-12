import { useEffect, useState } from "react"
import { albums as baseAlbums } from "../data/albums.ts"
import type {Album} from "../types/album.ts"
import Search from "../components/Search.tsx"
import AlbumCard from "../components/AlbumCard.tsx"
import {searchAlbums} from '../utils/api.ts'
import { filterAlbums } from "../utils/filterAlbums.ts";


export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [albums, setAlbums] = useState<Album[]>(baseAlbums);

  // const filteredAlbums = filterAlbums(albums, searchQuery)



  useEffect(() => {
    if (!searchQuery.trim()) {
      setAlbums(baseAlbums);
      return;
    }

    const timeOut = setTimeout(async () => {
      let results = await searchAlbums(searchQuery)
      setAlbums(results)
    }, 100)
    
    return () => clearTimeout(timeOut);
  }, [searchQuery]);

  return (
    <div className="w-full mt-8 flex flex-col gap-8">
      
      <Search setSearchQuery={setSearchQuery}/>

      <div className="grid grid-cols-6 gap-4">
        {albums.map((album) => (
          <AlbumCard key={album.id} album={album}/>
        ))}
      </div>
    </div>

  )
}