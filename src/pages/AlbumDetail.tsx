
import { albums } from "../data/albums";
import type { Album } from "../types/album";
import { useEffect, useState } from "react";
import AlbumCard from "../components/AlbumCard";
import Navigation from "../components/Navigation";
import AlbumContent from "../components/AlbumContent";
import { useDiscovery } from "../context/DiscoveryContext";
import { getAlbumDetail } from "../utils/api";

type Props = {
  albumId: string;
};

export default function AlbumDetail({ albumId }: Props) {
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const { visitAlbum } = useDiscovery();

  useEffect(() => {
    async function load() {
      window.scrollTo(0, 0);
      setLoading(true)
      try {
        const result = await getAlbumDetail(albumId);
        setAlbum(result)
      } catch {
        console.log("album was not found")
      }
      finally {
        setLoading(false)
      }
    }
    load()

  }, [albumId]);

  if (loading) return <h1>Loading</h1>
  if (!album) return <h1>Album not found</h1>
  const matchedAlbums = album ? albums.filter(
    (otherAlbum) =>
      otherAlbum.id !== album.id &&
      otherAlbum.moods?.some((mood) =>
        album.moods?.includes(mood)
      )
  ) : [];



  return (
    <>
      <Navigation variant="compact" />

      <div className="flex flex-col gap-8 mt-8">
        <AlbumContent album={album} />

        {/* Related albums */}
        <div>
          <h1>Related Albums</h1>
          <div className=" w-full shrink-0 grid grid-cols-4 gap-4">

          {matchedAlbums.map((matchedAlbum) => (
            <AlbumCard
              key={matchedAlbum.id}
              album={matchedAlbum}
              mode="browse"
              onNavigate={() => visitAlbum(matchedAlbum.id)}
            />
          ))}
          </div>
        </div>

      </div>

    </>
  );
}
