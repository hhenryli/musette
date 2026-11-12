import { useNavigate } from "react-router-dom"
import { useCollections } from "../context/CollectionsContext";

type Props = {
  onClose: () => void
}

export default function NewBoard( {onClose} : Props ) {
  const { createBoard } = useCollections();
  const navigate = useNavigate();

  function handleCreateEmpty() {
    const newBoardId = createBoard("Untitled Board");
    onClose();

    navigate(`/boards/${newBoardId}`)
  }

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