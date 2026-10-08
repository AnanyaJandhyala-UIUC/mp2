import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ArtworkContext, type ArtworkContextValue } from './artworkContext.ts'
import { DEFAULT_IIIF_URL, fetchArtworks, isAbortError, toErrorMessage } from '../services/api.ts'

type ArtworkProviderProps = {
  children: ReactNode
}

export function ArtworkProvider({ children }: ArtworkProviderProps) {
  const [artworks, setArtworks] = useState<ArtworkContextValue['artworks']>([])
  const [iiifUrl, setIiifUrl] = useState(DEFAULT_IIIF_URL)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [requestId, setRequestId] = useState(0)

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    setRequestId((current) => current + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    fetchArtworks(controller.signal)
      .then((collection) => {
        if (controller.signal.aborted) return
        setArtworks(collection.artworks)
        setIiifUrl(collection.iiifUrl)
        setLoading(false)
      })
      .catch((caught: unknown) => {
        if (isAbortError(caught) || controller.signal.aborted) return
        setError(toErrorMessage(caught))
        setLoading(false)
      })

    return () => controller.abort()
  }, [requestId])

  const value = useMemo(
    () => ({ artworks, iiifUrl, loading, error, reload }),
    [artworks, iiifUrl, loading, error, reload],
  )

  return <ArtworkContext.Provider value={value}>{children}</ArtworkContext.Provider>
}
