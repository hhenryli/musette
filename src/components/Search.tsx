import { useState } from "react";

type Props = {
  setSearchQuery: (query: string) => void
}

export default function Search( { setSearchQuery} : Props) {
  const [searchInput, setSearchInput] = useState("");

  function handleSearch(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setSearchQuery(searchInput)
  }

  return (
    <form className="w-full flex gap-4" onSubmit={handleSearch}>
      <input
        value={searchInput}
        placeholder="Search albums, artists, moods..."
        name="search"
        className="search-input"
        onChange={(e) => setSearchInput(e.target.value)}
      >
      </input>
      <button className="search-button">
        Search
      </button>
    </form>
  )
}