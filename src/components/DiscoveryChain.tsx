import { Link } from "react-router-dom";
import { useState } from "react";
import { albums } from "../data/albums";
import { ArrowRight, Menu } from "lucide-react";
import { useDiscovery } from "../context/DiscoveryContext";
import { motion, AnimatePresence } from "motion/react";

export default function DiscoveryChain() {
  const { albumChain, currentIndex, goToAlbum } = useDiscovery();
  const [showDiscovery, setShowDiscovery] = useState(false);

  const currentId = albumChain[currentIndex];
  const previousId = albumChain[currentIndex - 1];

  const currentAlbum = albums.find((album) => album.id === currentId);
  const previousAlbum = albums.find((album) => album.id === previousId);

  return (
    <div className="relative flex items-center gap-2">

      <div
        className="relative flex items-center"
        onMouseEnter={() => setShowDiscovery(true)}
        onMouseLeave={() => setShowDiscovery(false)}
      >
        <button
          type="button"
          onClick={() => setShowDiscovery((prev) => !prev)}
          aria-expanded={showDiscovery}
        >
          <Menu size={16} />
        </button>

        <AnimatePresence>
          {showDiscovery && (
            <motion.div
              className="absolute top-full left-1/2 z-50 flex w-max min-w-full -translate-x-1/2 flex-col items-center gap-2 rounded-sm border bg-[var(--bg)] p-4"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {albumChain.map((albumId, index) => {
                const album = albums.find((album) => album.id === albumId);

                if (!album) return null;

                return (
                  <Link
                    key={index}
                    to={`/albums/${album.id}`}
                    onClick={() => {
                      goToAlbum(index);
                      setShowDiscovery(false);
                    }}
                    className="breadcrumb"
                  >
                    <p>
                      {album.title}
                    </p>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {previousAlbum && (
        <>
          <Link
            to={`/albums/${previousAlbum.id}`}
            onClick={() => goToAlbum(currentIndex - 1)}
          >
            <p>
              {previousAlbum.title}
            </p>

          </Link>

          /
        </>
      )}

      {currentAlbum && (
        <p className="breadcrumb"> 
          {currentAlbum.title}
        </p>
      )}
    </div>
  );
}
