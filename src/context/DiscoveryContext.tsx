
import {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback,
  type ReactNode,
} from "react";

type DiscoveryState = {
  albumChain: string[];
  currentIndex: number;
};

type DiscoveryContextType = DiscoveryState & {
  visitAlbum: (albumId: string) => void;
  goToAlbum: (index: number) => void;
};

const DiscoveryContext = createContext<DiscoveryContextType | null>(null);

export function DiscoveryProvider({ children }: { children: ReactNode }) {
  const [discovery, setDiscovery] = useState<DiscoveryState>(() => {
    try {
      const saved = localStorage.getItem("discovery");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (
          Array.isArray(parsed.albumChain) &&
          typeof parsed.currentIndex === "number"
        ) {
          return parsed;
        }
      }
    } catch {
      // Fall back to an empty discovery chain
    }

    return {
      albumChain: [],
      currentIndex: -1,
    };
  });

  useEffect(() => {
    localStorage.setItem("discovery", JSON.stringify(discovery));
  }, [discovery]);

  // Follow a new recommendation
  const visitAlbum = useCallback((albumId: string) => {
    setDiscovery((prev) => {
      if (prev.albumChain[prev.currentIndex] === albumId) {
        return prev;
      }

      const albumChain = [
        ...prev.albumChain.slice(0, prev.currentIndex + 1),
        albumId,
      ];

      return {
        albumChain,
        currentIndex: albumChain.length - 1,
      };
    });
  }, []);

  // Return to an earlier album in the chain
  const goToAlbum = useCallback((index: number) => {
    setDiscovery((prev) => {
      if (index < 0 || index >= prev.albumChain.length) {
        return prev;
      }

      return {
        ...prev,
        currentIndex: index,
      };
    });
  }, []);

  return (
    <DiscoveryContext.Provider
      value={{
        albumChain: discovery.albumChain,
        currentIndex: discovery.currentIndex,
        visitAlbum,
        goToAlbum,
      }}
    >
      {children}
    </DiscoveryContext.Provider>
  );
}

export function useDiscovery() {
  const context = useContext(DiscoveryContext);

  if (!context) {
    throw new Error("useDiscovery must be used within DiscoveryProvider");
  }

  return context;
}
