import type { Album } from "../types/album";
import SavePopover from "./SavePopover";
import TrackList from "./TrackList";

type Props = {
  album: Album;
};

export default function AlbumContent({ album }: Props) {

  return (
    <div className="album-detail flex flex-col gap-8 border p-8">

      
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="display">{album.title}</h1>
          <SavePopover album={album} variant="header" />
        </div>

        {/* Moods */}
        <div className="flex flex-wrap gap-2">
          {album.moods?.map((mood) => (
            <p key={mood} className="label">
              {mood}
            </p>
          ))}
        </div>
      </div>

      {/* Artwork and information */}
      <div className="flex justify-between gap-4">

        <div className="w-1/5 flex flex-col justify-center gap-2">
          <h2>{album.artist}</h2>
          <p>{album.description}</p>
        </div>

        <div className="w-3/5 flex justify-center items-center">
          {album.artwork ? (
            <img
              src={album.artwork}
              alt={album.title}
              className="w-2/5 aspect-square rounded-full object-cover"
            />
          ) : (
            <div
              className="w-2/5 aspect-square rounded-full"
              style={{ backgroundColor: album.color }}
            />
          )}
        </div>

        <div className="w-1/5 flex flex-col justify-center gap-2">
          <h2>{album.year}</h2>
          {album.tracks && <TrackList tracks={album.tracks} />}
        </div>

      </div>
    </div>
  );
}
