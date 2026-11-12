
import { albums } from "../data/albums";
import AlbumContent from "./AlbumContent";

type Props = {
  albumId: string;
  onClose: () => void;
};

export default function AlbumModal({ albumId, onClose }: Props) {
  const album = albums.find((album) => album.id === albumId);

  if (!album) return null;

  return (
    <div className="modal-container" onClick={onClose}>
      <div
        className="album-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10"
          aria-label="Close album preview"
        >
          ×
        </button>

        <AlbumContent album={album} />
      </div>
    </div>
  );
}
