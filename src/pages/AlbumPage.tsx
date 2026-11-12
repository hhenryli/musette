
import { useParams } from "react-router-dom"
import AlbumDetail from "./AlbumDetail";

export default function AlbumPage() {
  const {albumId} = useParams();

  if (!albumId) return <p>Album not found</p>;

  return (
    <AlbumDetail albumId={albumId}/>
  )
}