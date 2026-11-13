// Navigation.tsx
import { NavLink } from "react-router-dom";
import DiscoveryChain from "./DiscoveryChain";
import Search from "./Search";

type Props = {
  variant?: "default" | "compact";
  setSearchQuery?: (query: string) => void;
};

export default function Navigation({ variant = "default", setSearchQuery }: Props) {
  const isCompact = variant === "compact";

  return (
    <nav className="w-full flex">
      <div className="w-full flex justify-left items-center">
      <NavLink to="/" className={isCompact ? "display-small nav-link" : "display-medium nav-link"}>
          Explore
        </NavLink>
      </div>
      <div className="w-full flex justify-center">
        {isCompact ? <DiscoveryChain /> : setSearchQuery && <Search setSearchQuery={setSearchQuery} />}
      </div>
      <div className="w-full flex flex-col items-end justify-center">

        <NavLink to="/collections" className={isCompact ? "display-small nav-link" : "display-medium nav-link"}>
          Collection
        </NavLink>
      </div>

    </nav>
  );
}