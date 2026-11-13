
import type { Album } from "../types/album";
import { Link } from "react-router-dom";
import SavePopover from "./SavePopover";

type Props = {
  album: Album;
} & (
  | {
      mode?: "browse";
      onAdd?: (album: Album) => void;
      onPreview?: (album: Album) => void;
      onNavigate?: () => void;
    }
  | {
      mode: "edit";
      onSelect?: (album: Album) => void;
      onRemove: (album: Album) => void;
    }
);

export default function AlbumCard(props: Props) {
  const { album } = props;

  const isEditor = props.mode === "edit";

  const onAdd = isEditor ? undefined : props.onAdd;
  const onPreview = isEditor ? undefined : props.onPreview;
  const onNavigate = isEditor ? undefined: props.onNavigate;
  const onSelect = isEditor ? props.onSelect : undefined;
  const onRemove = isEditor ? props.onRemove : undefined;


  const artwork = album.artwork ? (
    <img
      className="album"
      src={album.artwork}
      alt={`${album.title} album cover`}
      loading="lazy"
    />
  ) : (
    <div
      className="album"
      style={{ backgroundColor: album.color }}
    />
  );

  return (
    <div className="group/album relative album">

      {/* Artwork and click behavior */}
      {isEditor ? (
        onSelect ? (
          <button
            type="button"
            className="block w-full"
            onClick={() => onSelect(album)}
          >
            {artwork}
          </button>
        ) : (
          artwork
        )
      ) : onPreview ? (
        <button
          type="button"
          className="block w-full"
          onClick={() => onPreview(album)}
        >
          {artwork}
        </button>
      ) : (
        <Link
          to={`/albums/${album.id}`}
          className="block w-full"
          onClick={onNavigate}
        >
          {artwork}
        </Link>
      )}

      {/* Browse mode */}
      {!isEditor && (
        <>
          <SavePopover album={album} onAdd={onAdd} />

          <div className="">
            <h2>{album.title}</h2>
            <p>{album.artist}</p>
          </div>
        </>
      )}

      {/* Edit mode */}
      {isEditor && onRemove && (
        <div className="album-action-container">
          <button
            type="button"
            className="album-action"
            aria-label={`Remove ${album.title} from board`}
            onClick={() => onRemove(album)}
          >
            -
          </button>
        </div>
      )}

    </div>
  );
}
