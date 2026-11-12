export type Board = {
  id: string
  name: string
  description?: string
  albumIds: string[]
  layout: "grid" | "palette" | "freeform"
  createdAt: string
  modifiedAt: string
}