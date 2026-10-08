import { useMemo, useState } from 'react'
import SearchBar from '../components/SearchBar.tsx'
import SortControls from '../components/SortControls.tsx'
import ArtworkListItem from '../components/ArtworkListItem.tsx'
import LoadingState from '../components/LoadingState.tsx'
import ErrorState from '../components/ErrorState.tsx'
import { useArtworks } from '../hooks/useArtworks.ts'
import { matchesQuery, sortArtworks, type SortKey, type SortOrder } from '../utils/artwork.ts'
import styles from './ListPage.module.css'

export default function ListPage() {
  const { artworks, iiifUrl, loading, error, reload } = useArtworks()
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('title')
  const [order, setOrder] = useState<SortOrder>('asc')

  const visible = useMemo(() => {
    const filtered = artworks.filter((artwork) => matchesQuery(artwork, query))
    return sortArtworks(filtered, sortBy, order)
  }, [artworks, query, sortBy, order])

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Art Institute of Chicago</p>
        <h1>List View</h1>
        <p className={styles.intro}>Search by title or artist, then sort the collection.</p>
      </header>

      {loading ? <LoadingState /> : null}
      {!loading && error ? (
        <ErrorState as="p" title="Unable to load artworks" message={error} onRetry={reload} />
      ) : null}

      {!loading && !error ? (
        <>
          <div className={styles.toolbar}>
            <SearchBar value={query} onChange={setQuery} />
            <SortControls sortBy={sortBy} order={order} onSortByChange={setSortBy} onOrderChange={setOrder} />
            <p className={styles.count} aria-live="polite">
              Showing {visible.length} of {artworks.length} artworks
            </p>
          </div>

          {visible.length === 0 ? (
            <p className={styles.empty} role="status">
              No artworks found
            </p>
          ) : (
            <ul className={styles.list}>
              {visible.map((artwork) => (
                <li key={artwork.id}>
                  <ArtworkListItem artwork={artwork} iiifUrl={iiifUrl} />
                </li>
              ))}
            </ul>
          )}
        </>
      ) : null}
    </section>
  )
}
