import { useState } from "react";
import AlbumCard from "../components/AlbumCard";
import BoardPreview from "../components/BoardPreview";
import { useCollections } from "../context/CollectionsContext"
import { albums } from "../data/albums"
import NewBoard from "./NewBoard";

export default function Collections() {
  const { savedAlbumIds, boards, boardsLoading } = useCollections();
  const [activeMenu, setActiveMenu] = useState<"favorites" | "boards" | null>("favorites");
  const [newBoardModal, setNewBoardModal] = useState(false);

  const favorites = savedAlbumIds.map((id) => albums.find((album) => album.id == id)).filter((album) => album !== undefined);

  if (boardsLoading) return <h1>Boards loading</h1>

  return (
    <div className="mt-8 flex flex-col gap-8">

      {newBoardModal && <NewBoard onClose={() => setNewBoardModal(false)} />}

      
      <div className="flex gap-8">
        <button 
          className={`nav-link ${activeMenu === "favorites" ? "active" : ""}`}
          onClick={() =>
            setActiveMenu(prev => prev === "favorites" ? null : "favorites")
          }>
          <h1>
            Favorites
          </h1>

        </button>

        <button 
          className={`nav-link ${activeMenu === "boards" ? "active" : ""}`}
          onClick={() =>
            setActiveMenu(prev => prev === "boards" ? null : "boards")
          }>
          <h1>
            Boards
          </h1>

        </button>
      </div>

      <div className="">
        {activeMenu === "favorites" ? (
          favorites.length === 0 ? (
            <p>You have no saved albums</p>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {favorites.map((favorite) => (
                <AlbumCard key={favorite.id} album={favorite} />
              ))}
            </div>
          )) : boards.length === 0 ? (
            <div className="grid grid-cols-4 gap-4">
              <p className="col-span-4">You have no saved boards</p>
              <button onClick={() => setNewBoardModal(true)} className="add-board-button">
                <span className="flex justify-center items-center w-1/5 aspect-square rounded-full bg-[var(--text)] text-[var(--bg)]">
                  +
                </span>
              </button>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-4 gap-4">
                {[...boards]
                  .sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime())
                  .map((board) => (
                    <BoardPreview key={board.id} boardProp={board} />
                ))}
          
                <button onClick={() => setNewBoardModal(true)} className="add-board-button">
                  <span className="flex justify-center items-center w-1/5 aspect-square rounded-full bg-[var(--text)] text-[var(--bg)]">
                    +
                  </span>
                </button>
              </div>
            </div>
          )
        }
      </div>
    
    </div>

  )
}