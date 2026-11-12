
import type { Album } from "../types/album";
import { useEffect, useRef, useState } from "react";
import { useCollections } from "../context/CollectionsContext";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

type Props = {
  album: Album;
  onAdd?: (album: Album) => void;
  variant?: "card" | "header";
};

export default function SavePopover({
  album,
  onAdd,
  variant = "card",
}: Props) {
  const {
    boards,
    savedAlbumIds,
    addAlbum,
    removeAlbum,
    addAlbumToBoard,
    removeAlbumFromBoard,
  } = useCollections();

  const [showSaveModal, setShowSaveModal] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const usesPopover = !onAdd;
  const isFavorite = savedAlbumIds.includes(album.id);

  function clearTimers() {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);

    openTimer.current = null;
    closeTimer.current = null;
  }

  function handleMouseEnter() {
    if (!usesPopover) return;

    if (
      !window.matchMedia(
        "(hover: hover) and (pointer: fine)"
      ).matches
    ) {
      return;
    }

    clearTimers();

    openTimer.current = setTimeout(() => {
      setShowSaveModal(true);
    }, 150);
  }

  function handleMouseLeave() {
    clearTimers();

    closeTimer.current = setTimeout(() => {
      setShowSaveModal(false);
    }, 300);
  }

  useEffect(() => {
    if (!showSaveModal || !usesPopover) return;

    function handleOutsideClick(event: PointerEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSaveModal(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowSaveModal(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showSaveModal, usesPopover]);

  useEffect(() => {
    return () => clearTimers();
  }, []);

  function handleAddClick() {
    clearTimers();

    if (onAdd) {
      onAdd(album);
    } else {
      setShowSaveModal((prev) => !prev);
    }
  }

  return (
    <div
      ref={wrapperRef}
      className={
        variant === "card"
          ? "album-action-container"
          : "relative inline-flex"
      }
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") {
          clearTimers();
        }
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") {
          handleMouseLeave();
        }
      }}
    >
      <AnimatePresence>
        {usesPopover && showSaveModal && (
          <motion.div
            key="save-popover"
            className="absolute bottom-full right-0 z-50 mb-2"
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{
              duration: 0.16,
              ease: "easeOut",
            }}
          >
            <div
              id={`save-menu-${album.id}`}
              className="
                w-56 rounded-md
                border border-[var(--text)]/10
                bg-[var(--bg)] p-2
                text-[var(--text)] shadow-xl
              "
            >
              <p className="px-2 py-2 text-sm font-medium">
                Save to...
              </p>

              {/* Favorites */}
              <button
                type="button"
                onClick={() => {
                  if (isFavorite) {
                    removeAlbum(album.id);
                    toast("Removed from favorites");
                  } else {
                    addAlbum(album.id);
                    toast.success("Added to favorites");
                  }
                }}
                className="
                  flex w-full items-center justify-between
                  rounded-sm px-2 py-2 text-left text-sm
                  hover:bg-[var(--grey-300)]
                "
              >
                Favorites
                <span>{isFavorite ? "✓" : "+"}</span>
              </button>

              <div className="my-1 border-t border-[var(--text)]/10" />

              {/* Boards */}
              <div className="max-h-48 overflow-y-auto">
                {boards.map((board) => {
                  const isSaved = board.albumIds.includes(album.id);

                  return (
                    <button
                      type="button"
                      key={board.id}
                      onClick={() => {
                        if (isSaved) {
                          removeAlbumFromBoard(board.id, album.id);
                          toast(`Removed from ${board.name}`);
                        } else {
                          addAlbumToBoard(board.id, album.id);
                          toast.success(`Added to ${board.name}`);
                        }
                      }}
                      className="
                        flex w-full items-center justify-between
                        rounded-sm px-2 py-2 text-left text-sm
                        hover:bg-[var(--grey-300)]
                      "
                    >
                      {board.name}
                      <span>{isSaved ? "✓" : "+"}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        aria-label={
          onAdd
            ? `Add ${album.title} to board`
            : `Save ${album.title}`
        }
        aria-expanded={usesPopover ? showSaveModal : undefined}
        aria-controls={
          usesPopover && showSaveModal
            ? `save-menu-${album.id}`
            : undefined
        }
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") {
            handleMouseEnter();
          }
        }}
        onClick={handleAddClick}
        className={
          variant === "card"
            ? "album-action"
            : "submit-button"
        }
      >
        +
      </button>
    </div>
  );
}
