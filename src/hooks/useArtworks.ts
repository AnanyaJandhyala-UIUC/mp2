import { useContext } from 'react'
import { ArtworkContext, type ArtworkContextValue } from '../context/artworkContext.ts'

export function useArtworks(): ArtworkContextValue {
  const value = useContext(ArtworkContext)
  if (!value) {
    throw new Error('useArtworks must be used within ArtworkProvider')
  }
  return value
}
