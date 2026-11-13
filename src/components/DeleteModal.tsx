import { useCollections } from "../context/CollectionsContext";
import { useState} from "react";

type props = {
  boardId: string
  setShowDeleteModal: (bool: boolean) => void
}
export default function DeleteModal( {boardId, setShowDeleteModal} : props ) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteBoard } = useCollections();

  async function handleDelete() {
    setIsDeleting(true)
    try {
      await deleteBoard(boardId)
      setIsDeleting(false)
    } catch(error) {
      console.error("Error deleting board", error);
      setIsDeleting(false);
    }
  }

  return (
    <div className="modal-container">
      <div className="">
        {isDeleting ? (
          <h1>Deleting board...</h1>
        ) : (
          <div className="edit-form-modal">
            <h1>Are you sure you want to delete this board?</h1>
            <p>Deletion is permanent</p>
            <div className="flex gap-8">
              <button className="secondary-button" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="submit-button" onClick={() => handleDelete()}>Delete</button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
