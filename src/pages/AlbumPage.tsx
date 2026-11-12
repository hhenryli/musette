
import { useParams } from "react-router-dom"
import AlbumDetail from "./AlbumDetail";

export default function AlbumPage() {
  const {albumId} = useParams();

  return (
    <AlbumDetail albumId={albumId}/>
  )
}