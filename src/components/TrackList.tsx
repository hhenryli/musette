import type { Track } from "../types/album";


export default function TrackList( {tracks}: {tracks: Track[]} ) {
  return (
    <div>
      {tracks.map((track) => (
        <ul>
          <li>{track.title} {track.duration}</li>
        </ul>
      ))}
    </div>
  )
}