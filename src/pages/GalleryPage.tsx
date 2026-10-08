import { useMemo, useState } from 'react'
import ArtworkCard from '../components/ArtworkCard.tsx'
import LoadingState from '../components/LoadingState.tsx'
import ErrorState from '../components/ErrorState.tsx'
import { useArtworks } from '../hooks/useArtworks.ts'
import styles from './GalleryPage.module.css'

const ALL_DEPARTMENTS = 'all'

export default function GalleryPage() {
  const { artworks, iiifUrl, loading, error, reload } = useArtworks()
  const [department, setDepartment] = useState(ALL_DEPARTMENTS)

  const departments = useMemo(() => {
    const names = new Set<string>()
    for (const artwork of artworks) {
      if (artwork.department_title) names.add(artwork.department_title)
    }
    return [...names].sort((a, b) => a.localeCompare(b))
  }, [artworks])

  const activeDepartment =
    department !== ALL_DEPARTMENTS && departments.includes(department) ? department : ALL_DEPARTMENTS

  const visible = useMemo(() => {
    if (activeDepartment === ALL_DEPARTMENTS) return artworks
    return artworks.filter((artwork) => artwork.department_title === activeDepartment)
  }, [artworks, activeDepartment])

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Art Institute of Chicago</p>
        <h1>Gallery View</h1>
        <p className={styles.intro}>Browse artwork images and filter the collection by department.</p>
      </header>

      {loading ? <LoadingState /> : null}
      {!loading && error ? (
        <ErrorState as="p" title="Unable to load artworks" message={error} onRetry={reload} />
      ) : null}

      {!loading && !error ? (
        <>
          <div className={styles.filters} role="group" aria-label="Filter by department">
            <button
              type="button"
              className={activeDepartment === ALL_DEPARTMENTS ? styles.active : styles.chip}
              aria-pressed={activeDepartment === ALL_DEPARTMENTS}
              onClick={() => setDepartment(ALL_DEPARTMENTS)}
            >
              All
            </button>
            {departments.map((name) => (
              <button
                key={name}
                type="button"
                className={activeDepartment === name ? styles.active : styles.chip}
                aria-pressed={activeDepartment === name}
                onClick={() => setDepartment(name)}
              >
                {name}
              </button>
            ))}
          </div>

          <p className={styles.count} aria-live="polite">
            Showing {visible.length} of {artworks.length} artworks
          </p>

          {visible.length === 0 ? (
            <p className={styles.empty} role="status">
              No artworks found
            </p>
          ) : (
            <ul className={styles.grid}>
              {visible.map((artwork) => (
                <li key={artwork.id}>
                  <ArtworkCard artwork={artwork} iiifUrl={iiifUrl} />
                </li>
              ))}
            </ul>
          )}
        </>
      ) : null}
    </section>
  )
}
