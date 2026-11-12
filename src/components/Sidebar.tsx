import { useRef, useState } from "react";
import AlbumGrid from "./AlbumGrid";
import Search from "./Search";
import { albums } from "../data/albums";
import type { Album } from "../types/album";
import { useCollections } from "../context/CollectionsContext";
import { filterAlbums } from "../utils/filterAlbums";


type Props = {
  boardId: string
  onPreview: (album: Album) => void
}

export default function Sidebar( {boardId, onPreview } : Props) {
  const [sidebarWidth, setSideWidth] = useState(300);
  const [searchQuery, setSearchQuery] = useState("");
  const { addAlbumToBoard} = useCollections();

  const isResizing = useRef(false);
  const filteredAlbums = filterAlbums(albums, searchQuery)

  function startResize(e: React.PointerEvent<HTMLDivElement>) {
    isResizing.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function resize(e: React.PointerEvent<HTMLDivElement>) {
    if (!isResizing.current) return;

    setSideWidth(
      Math.min(500, Math.max(200, e.clientX))
    );
  }

  function stopResize(e: React.PointerEvent<HTMLDivElement>) {
    isResizing.current = false;

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }

  return (
    <div className="h-full bg-[var(--grey-200)]">
      <aside 
        className="relative flex h-full p-4"
        style={{width: sidebarWidth}}
      > 
        <div className="flex flex-col overflow-y-auto gap-4 w-full">
          <div className="">
              <h1>Albums</h1>
            </div>

            <Search setSearchQuery={setSearchQuery} />
            <AlbumGrid albums={filteredAlbums} onAdd={(album) => addAlbumToBoard(boardId, album.id)} onPreview={onPreview}/>
        </div>

        
        <div
          role="separator"
          aria-label="Resize album sidebar"
          aria-orientation="vertical"
          onPointerDown={startResize}
          onPointerMove={resize}
          onPointerUp={stopResize}
          onPointerCancel={stopResize}
          className="top-0 right-0 absolute w-2 h-full cursor-col-resize"
        >
          <div className="absolute right-0 w-[2px] h-full bg-[var(--grey-300)]"></div>
        </div>
      </aside>
  </div>
  )
}