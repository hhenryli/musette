
import type { Board } from "../types/board";
import { albums } from "../data/albums";
import AlbumPic from "./AlbumPic";
import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Ellipsis } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { formatTime } from "../utils/formatTime";

import EditBoard from "./EditBoard";
import DeleteModal from "./DeleteModal";

type BoardProps = {
  boardProp: Board;
};


export default function BoardPreview({ boardProp }: BoardProps) {
  const [showBoardMenu, setShowBoardMenu] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  const wrapperRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const albumIds = boardProp.albumIds.slice(0, 4);
  const albumPreviews = albumIds
    .map((id) => albums.find((album) => album.id === id))
    .filter((album) => album !== undefined);

  function clearTimers() {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);

    openTimer.current = null;
    closeTimer.current = null;
  }

  useEffect(() => {
    if (!showBoardMenu) return;

    function handleOutsideClick(event: PointerEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowBoardMenu(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowBoardMenu(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showBoardMenu]);

  useEffect(() => {
    return () => clearTimers();
  }, []);

  return (
    <div className="group/board relative flex flex-col gap-2">
      {showEditMenu && (
        <EditBoard board={boardProp} setShowEditMenu={setShowEditMenu}/>
      )}
      {showDeleteModal && (
        <DeleteModal boardId={boardProp.id} setShowDeleteModal={setShowDeleteModal}/>
      )}

      <div className="relative">
        <NavLink to={`/boards/${boardProp.id}`}>
          <div className="w-full aspect-square grid grid-cols-2 grid-rows-2 gap-1 overflow-hidden rounded-sm bg-[var(--grey-200)]">
            {albumPreviews.map((albumPreview) => (
              <AlbumPic key={albumPreview.id} album={albumPreview} />
            ))}
          </div>
        </NavLink>
  
        <div
          ref={wrapperRef}
          className="absolute top-2 right-2 z-20"
        >
          <button
            type="button"
            aria-label={`Options for ${boardProp.name}`}
            aria-expanded={showBoardMenu}
            onClick={() => setShowBoardMenu(prev => !prev)}
            className={`
              flex items-center justify-center
              size-8 rounded-sm
              bg-[var(--bg)] text-[var(--text)]
              shadow-sm transition-opacity duration-200
              group-focus-within/board:opacity-100
              [@media(hover:none)]:opacity-100
              ${
                showBoardMenu
                  ? "opacity-100"
                  : "opacity-0 group-hover/board:opacity-100"
              }
            `}
          >
            <Ellipsis size={20} />
          </button>
  
          <AnimatePresence>
            {showBoardMenu && (
              <motion.div
                className="absolute top-full right-0 mt-2 z-50"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16 }}
              >
                <div className="w-40 rounded-sm border bg-[var(--bg)] p-2 shadow-xl">
                  <button
                    type="button"
                    onClick={() => setShowEditMenu(true)}
                    className="block w-full p-2 text-left"
                  >
                    Edit details
                  </button>
  
                  <button
                    type="button"
                    className="block w-full p-2 text-left"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete board
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
  
      <NavLink to={`/boards/${boardProp.id}`}>
        <p className="text-start">{boardProp.name}</p>
        <p className="caption">Edited {formatTime(boardProp.modifiedAt)}</p>
      </NavLink>
  
    </div>
  );
}