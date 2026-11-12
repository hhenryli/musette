import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import type { Board } from "../types/board";
import { boards as initialBoards } from "../data/boards";

type CollectionsContextType = {
  savedAlbumIds: string[];
  boards: Board[];

  addAlbum: (id: string) => void;
  removeAlbum: (id: string) => void;

  createBoard: (name: string) => string;
  addAlbumToBoard: (boardId: string, albumId: string) => void;
  removeAlbumFromBoard: (boardId: string, albumId: string) => void;
  updateBoard: (
    boardId: string,
    changes: { name?: string; description?: string }
  ) => void;

  deleteBoard: (boardId: string) => void;
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
  const [boards, setBoards] = useState<Board[]>(() => {
    try {
      const saved = localStorage.getItem("boards");
  
      return saved ? JSON.parse(saved) : initialBoards;
    } catch {
      return initialBoards;
    }
  });

  // SAVE TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem("savedAlbums", JSON.stringify(savedAlbumIds));
  }, [savedAlbumIds]);

  useEffect(() => {
    localStorage.setItem("boards", JSON.stringify(boards));
  }, [boards]);

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
  function createBoard(name: string) {
    const now = new Date().toISOString();

    const newBoard: Board = {
      id: crypto.randomUUID(),
      name,
      albumIds: [],
      layout: "grid",
      createdAt: now,
      modifiedAt: now,
    };

    setBoards((prev) => [...prev, newBoard]);
    return newBoard.id;
  }
  
  function updateBoard(
    boardId: string,
    changes: { name?: string; description?: string }
  ) {
    setBoards((prev) =>
      prev.map((board) =>
        board.id === boardId
          ? {
              ...board,
              ...changes,
              modifiedAt: new Date().toISOString(),
            }
          : board
      )
    );
  }

  function deleteBoard(boardId: string) {
    setBoards((prev) =>
      prev.filter((board) => board.id !== boardId)
    );
  }

  function addAlbumToBoard(boardId: string, albumId: string) {
    console.log("Context received:", { boardId, albumId });
  
    setBoards((prev) => {
      console.log("Boards before update:", prev);
  
      const updatedBoards = prev.map((board) => {
        if (board.id !== boardId) return board;
  
        if (board.albumIds.includes(albumId)) return board;
  
        return {
          ...board,
          albumIds: [...board.albumIds, albumId],
          modifiedAt: new Date().toISOString(),
        };
      });
  
      console.log("Boards after update:", updatedBoards);
  
      return updatedBoards;
    });
  }

  function removeAlbumFromBoard(boardId: string, albumId: string) {
    setBoards((prev) =>
      prev.map((board) => {
        if (board.id !== boardId) return board;

        return {
          ...board,
          albumIds: board.albumIds.filter((id) => id !== albumId),
          modifiedAt: new Date().toISOString(),
        };
      })
    );
  }

  return (
    <CollectionsContext.Provider
      value={{
        savedAlbumIds,
        boards,
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