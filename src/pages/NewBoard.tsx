import { useNavigate } from "react-router-dom"
import { useCollections } from "../context/CollectionsContext";
import { useState } from "react";

type Props = {
  onClose: () => void
}

export default function NewBoard( {onClose} : Props ) {
  const [isCreating, setIsCreating] = useState(false);
  const { createBoard } = useCollections();
  const navigate = useNavigate();

  async function handleCreateEmpty() {
    setIsCreating(true);
    try {
      const newBoardId = await createBoard();
      onClose();
      navigate(`/boards/${newBoardId}`)
    } catch(error) {
      console.error("Error creating board", error);
      setIsCreating(false)
    }
  }
  
  if (isCreating) return <h1>Creating new board</h1>

  return (
    <div className="modal-container" onClick={() => onClose()}>
      <div className="add-board-modal">
        <button className="board-button" onClick={() => handleCreateEmpty()}>
          Create an empty board
        </button>

        <button className="board-button" onClick={() => onClose()}>
          Generate a random board
        </button>
      </div>
    </div>
  )
}