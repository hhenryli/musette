import { useState } from "react";
import { useCollections } from "../context/CollectionsContext";
import type { Board } from "../types/board";

type BoardProp = {
  board: Board
  setShowEditMenu: (bool: boolean) => void
}

export default function EditBoard( {board, setShowEditMenu}: BoardProp ) {
  const [boardName, setBoardName] = useState(board?.name ?? "");
  const [boardDesc, setBoardDesc] = useState(board?.description ?? "");
  const { updateBoard } = useCollections();

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setShowEditMenu(false);
    updateBoard(board.id, boardName, boardDesc)
  }

  return (
    <div className="modal-container">
    <form 
      className="edit-form-modal"
      onSubmit={handleSubmit}
      >
        <label
        htmlFor="name"
        >
          Board Name
        </label>
        <input
        name="name"
        value={boardName}
        onChange={(e) => setBoardName(e.target.value)}
        >
        </input>

        <label
        htmlFor="desc"
        >
          Description
        </label>
        <input
        name="desc"
        value={boardDesc}
        onChange={(e) => setBoardDesc(e.target.value)}
        >
        </input>

        <button className="submit-button" onSubmit={() => handleSubmit}>
          Change
        </button>
      </form>
    </div>

  )

}