import { NavLink } from "react-router-dom";
import DiscoveryChain from "./DiscoveryChain";

type Props = {
  variant?: "default" | "compact";
};

export default function Navigation({ variant = "default" }: Props) {
  const isCompact = variant === "compact";

  return (
    <nav className="w-full grid grid-cols-3 items-center">
      <NavLink
        to="/"
        className={isCompact ? "display-small nav-link" : "display nav-link"}
      >
        Explore
      </NavLink>

      <div className="flex justify-center">
        {isCompact && <DiscoveryChain />}
      </div>

      <NavLink
        to="/collections"
        className={`${isCompact ? "display-small" : "display"} nav-link justify-self-end`}
      >
        Collection
      </NavLink>
    </nav>
  );
}