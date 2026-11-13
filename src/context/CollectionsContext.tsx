import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import type { Board } from "../types/board";
import { getBoards, 
        createBoard as createBoardRequest, 
        deleteBoard as deleteBoardRequest, 
        addAlbumToBoard as addAlbumToBoardRequest, 
        removeAlbumFromBoard as removeAlbumFromBoardRequest,
        updateBoard as updateBoardRequest
      } from "../utils/api";

type CollectionsContextType = {
  savedAlbumIds: string[];
  boards: Board[];
  boardsLoading: boolean;

  addAlbum: (id: string) => void;
  removeAlbum: (id: string) => void;

  createBoard: () => Promise<string>;
  addAlbumToBoard: (boardId: string, albumId: string) => Promise<void>;
  removeAlbumFromBoard: (boardId: string, albumId: string) => Promise<void>;
  updateBoard: (
    boardId: string,
    boardName: string,
    boardDescription: string
  ) => Promise<void>;

  deleteBoard: (boardId: string) => Promise<void>;
};

const CollectionsContext = createContext<CollectionsContextType | null>(null);

export function CollectionsProvider({ children }: { children: ReactNode }) {
  // FAVORITES
  const [savedAlbumIds, setSavedAlbumIds] = useState<string[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("savedAlbums") || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  // BOARDS
  const [boards, setBoards] = useState<Board[]>([]);
  const [boardsLoading, setBoardsLoading] = useState(false);

  // SAVE TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem("savedAlbums", JSON.stringify(savedAlbumIds));
  }, [savedAlbumIds]);

  // GET BOARDS FROM API
  useEffect(() => {
    async function loadBoards() {
      try {
        const data = await getBoards()
        setBoards(data)
        setBoardsLoading(true)
      }
      catch (error) {
        console.error("Error retrieving boards:", error);
      }
      finally {
        setBoardsLoading(false)
      }
    }
    loadBoards()
  }, []);

  // FAVORITES FUNCTIONS
  function addAlbum(id: string) {
    setSavedAlbumIds((prev) =>
      prev.includes(id) ? prev : [...prev, id]
    );
  }

  function removeAlbum(id: string) {
    setSavedAlbumIds((prev) =>
      prev.filter((albumId) => albumId !== id)
    );
  }

  // BOARD FUNCTIONS

  async function createBoard() {
    const data = await createBoardRequest();

    setBoards((prev) => [...prev, data]);
    return data.id
  }
  
  async function updateBoard(
    boardId: string,
    boardName: string,
    boardDesc: string,
  ) {
    const response = await updateBoardRequest(boardId, boardName, boardDesc)

    setBoards((prev) => prev.map((board) => board.id === boardId ? response : board))
  }

  async function deleteBoard(boardId: string) {
    await deleteBoardRequest(boardId);
    setBoards((prev) =>
      prev.filter((board) => board.id !== boardId)
    );
  }

  async function addAlbumToBoard(boardId: string, albumId: string) {
    const response = await addAlbumToBoardRequest(boardId, albumId);
  
    setBoards((prev) => prev.map((board) => board.id === boardId ? response : board))
  }

  async function removeAlbumFromBoard(boardId: string, albumId: string) {
    const response = await removeAlbumFromBoardRequest(boardId, albumId);

    setBoards((prev) => prev.map((board) => board.id === boardId ? response : board))
  }

  return (
    <CollectionsContext.Provider
      value={{
        savedAlbumIds,
        boards,
        boardsLoading,
        addAlbum,
        removeAlbum,
        createBoard,
        addAlbumToBoard,
        removeAlbumFromBoard,
        updateBoard,
        deleteBoard,
      }}
    >
      {children}
    </CollectionsContext.Provider>
  );
}

export function useCollections() {
  const context = useContext(CollectionsContext);

  if (!context) {
    throw new Error("useCollections must be used inside CollectionsProvider");
  }

  return context;
}