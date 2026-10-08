import { createContext } from 'react'
import type { Artwork } from '../types/Artwork.ts'

export interface ArtworkContextValue {
  artworks: Artwork[]
  iiifUrl: string
  loading: boolean
  error: string | null
  reload: () => void
}

export const ArtworkContext = createContext<ArtworkContextValue | null>(null)
