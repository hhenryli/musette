import type { Board } from "../types/board"

export const boards: Board[] = [
  {
    id: "1",
    name: "Blue Hour",
    description: "Albums that feel like late evenings",
    albumIds: ["1", "8", "11"],
    layout: "palette",
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
  },

]
