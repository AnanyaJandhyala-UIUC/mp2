import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ArtworkImage from '../components/ArtworkImage.tsx'
import LoadingState from '../components/LoadingState.tsx'
import ErrorState from '../components/ErrorState.tsx'
import { useArtworks } from '../hooks/useArtworks.ts'
import { fetchArtwork, isAbortError, isNotFoundError, toErrorMessage } from '../services/api.ts'
import type { Artwork } from '../types/Artwork.ts'
import { artistDetails, artistName, displayDate } from '../utils/artwork.ts'
import styles from './DetailPage.module.css'

type DetailFailure = {
  id: number
  kind: 'missing' | 'error'
  message: string
}

function neighborIndex(index: number, offset: number, total: number): number {
  if (index < 0) return offset > 0 ? 0 : total - 1
  return (index + offset + total) % total
}

type ArtworkPagerProps = {
  previous: Artwork
  next: Artwork
}

function ArtworkPager({ previous, next }: ArtworkPagerProps) {
  return (
    <nav className={styles.pager} aria-label="More artworks">
      <Link className={styles.previous} to={`/artwork/${previous.id}`}>
        <span aria-hidden="true">←</span>
        <span className={styles.pagerCopy}>
          <span className={styles.pagerLabel}>Previous</span>
          <span className={styles.pagerTitle}>{previous.title}</span>
        </span>
      </Link>
      <Link className={styles.next} to={`/artwork/${next.id}`}>
        <span className={styles.pagerCopy}>
          <span className={styles.pagerLabel}>Next</span>
          <span className={styles.pagerTitle}>{next.title}</span>
        </span>
        <span aria-hidden="true">→</span>
      </Link>
    </nav>
  )
}

export default function DetailPage() {
  const { id } = useParams()
  const numericId = Number(id)
  const validId = Number.isInteger(numericId) && numericId > 0
  const { artworks, iiifUrl, loading, reload } = useArtworks()
  const [extra, setExtra] = useState<Artwork | null>(null)
  const [failure, setFailure] = useState<DetailFailure | null>(null)

  const collectionArtwork = validId ? artworks.find((artwork) => artwork.id === numericId) ?? null : null
  const failureForId = failure?.id === numericId ? failure : null

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [numericId])

  useEffect(() => {
    if (!validId || loading || collectionArtwork) return

    const controller = new AbortController()

    fetchArtwork(numericId, controller.signal)
      .then((artwork) => {
        if (controller.signal.aborted) return
        setExtra(artwork)
      })
      .catch((caught: unknown) => {
        if (isAbortError(caught) || controller.signal.aborted) return
        if (isNotFoundError(caught)) {
          setFailure({
            id: numericId,
            kind: 'missing',
            message: 'This artwork is not in the Art Institute collection.',
          })
          return
        }
        setFailure({
          id: numericId,
          kind: 'error',
          message: toErrorMessage(caught),
        })
      })

    return () => controller.abort()
  }, [collectionArtwork, loading, numericId, validId])

  if (!validId) {
    return (
      <ErrorState
        title="Artwork not found"
        message="That address does not match an artwork."
        actionHref="/"
        actionLabel="Back to list"
      />
    )
  }

  const artwork = collectionArtwork ?? (extra?.id === numericId ? extra : null)

  if (!artwork && !failureForId) {
    return <LoadingState message="Loading artwork…" />
  }

  if (!artwork) {
    return (
      <ErrorState
        title={failureForId?.kind === 'error' ? 'Unable to load artwork' : 'Artwork not found'}
        message={failureForId?.message ?? 'This artwork could not be found.'}
        onRetry={failureForId?.kind === 'error' ? reload : undefined}
        actionHref="/"
        actionLabel="Back to list"
      />
    )
  }

  const index = artworks.findIndex((item) => item.id === artwork.id)
  const total = artworks.length
  const previous = total > 0 ? artworks[neighborIndex(index, -1, total)] : null
  const next = total > 0 ? artworks[neighborIndex(index, 1, total)] : null
  const details = artistDetails(artwork)

  const facts: { label: string; value: string; preserve?: boolean }[] = [
    { label: 'Artist', value: artistName(artwork) },
    { label: 'Date', value: displayDate(artwork) },
    { label: 'Department', value: artwork.department_title ?? 'Not recorded' },
    { label: 'Medium', value: artwork.medium_display ?? 'Not recorded' },
    { label: 'Place of origin', value: artwork.place_of_origin ?? 'Not recorded' },
    { label: 'Dimensions', value: artwork.dimensions ?? 'Not recorded' },
  ]

  if (details) {
    facts.push({ label: 'Artist details', value: details, preserve: true })
  }

  return (
    <article className={styles.page}>
      {previous && next ? <ArtworkPager previous={previous} next={next} /> : null}

      <div className={styles.layout}>
        <ArtworkImage
          artwork={artwork}
          iiifUrl={iiifUrl}
          width={1200}
          fit="contain"
          priority
          className={styles.frame}
        />
        <div className={styles.copy}>
          {artwork.department_title ? <p className={styles.kicker}>{artwork.department_title}</p> : null}
          <h1>{artwork.title}</h1>
          <p className={styles.lede}>
            {artistName(artwork)}
            <span aria-hidden="true"> · </span>
            {displayDate(artwork)}
          </p>
          {index >= 0 ? (
            <p className={styles.position}>
              {index + 1} of {total} in the collection
            </p>
          ) : null}

          <dl className={styles.facts}>
            {facts.map((fact) => {
              const missing = fact.value === 'Not recorded' || fact.value === 'Unknown artist' || fact.value === 'Date unknown'
              return (
                <div className={styles.fact} key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd className={missing ? styles.missing : fact.preserve ? styles.preserve : undefined}>{fact.value}</dd>
                </div>
              )
            })}
          </dl>

          <p className={styles.back}>
            <Link to="/">Back to list</Link>
            <Link to="/gallery">Back to gallery</Link>
          </p>
        </div>
      </div>

      {previous && next ? <ArtworkPager previous={previous} next={next} /> : null}
    </article>
  )
}
