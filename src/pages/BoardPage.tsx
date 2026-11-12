import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { albums } from "../data/albums";
import type { Album } from "../types/album";
import AlbumCard from "../components/AlbumCard";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useCollections } from "../context/CollectionsContext";
import AlbumModal from "../components/AlbumModal";

export default function BoardPage() {
  const [previewAlbum, setPreviewAlbum] = useState<Album | null>(null);
  const navigate = useNavigate();
  const {boardId} = useParams();

  const {boards, removeAlbumFromBoard} = useCollections();
  const board = boards.find((board) => board.id == boardId);
  const boardAlbums = board.albumIds.map((id) => albums.find((album) => album.id == id)).filter((album) => album !== undefined)

  return (
    <main className="">

      <div className="h-dvh overflow-hidden w-full flex justify-between">
        <Sidebar boardId={board.id} onPreview={setPreviewAlbum}/>
        {
          previewAlbum && (
            <AlbumModal albumId={previewAlbum.id} onClose={() => setPreviewAlbum(null)}/>
          )
        }


        <div className="padding w-full">
          <header className="min-h-0 flex-1 overflow-auto">

            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="transition-transform duration-200 hover:-translate-y-1"
            >
              <ArrowLeft size={20} />
            </button>
            <h1>{board.name}</h1>
            <p>{board.description}</p>

          </header>

          <main className="min-h-0 flex-1 overflow-auto">
            {boardAlbums.length === 0 ? (
              <div className="w-full h-full flex justify-center items-center">add albums now</div>
              ) : (
              <div className="grid grid-cols-6 gap-4">
                {boardAlbums.map((album) => (
                  <AlbumCard key={album.id} album={album} mode="edit" onRemove={(album) => removeAlbumFromBoard(board.id, album.id)}/>
                ))}
              </div>
              )
            }
          </main>

        </div>

      </div>



    </main>
  )
}