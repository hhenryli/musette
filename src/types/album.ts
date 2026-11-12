export type Track = {
  title: string
  duration?: number;
}

export type Album = {
  id: string
  title: string
  artist: string
  year: number
  color?: string
  moods?: string[]
  artwork?: string
  description?: string
  tracks?: Track[]
}