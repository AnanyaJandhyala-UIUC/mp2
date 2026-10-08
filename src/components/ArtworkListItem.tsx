import { Link } from 'react-router-dom'
import type { Artwork } from '../types/Artwork.ts'
import ArtworkImage from './ArtworkImage.tsx'
import { artistName, displayDate } from '../utils/artwork.ts'
import styles from './ArtworkListItem.module.css'

type ArtworkListItemProps = {
  artwork: Artwork
  iiifUrl: string
}

export default function ArtworkListItem({ artwork, iiifUrl }: ArtworkListItemProps) {
  const department = artwork.department_title
  const medium = artwork.medium_display

  return (
    <Link className={styles.item} to={`/artwork/${artwork.id}`}>
      <ArtworkImage artwork={artwork} iiifUrl={iiifUrl} width={240} fit="cover" className={styles.thumb} />
      <div className={styles.copy}>
        <h2 className={styles.title}>{artwork.title}</h2>
        <p className={styles.artist}>{artistName(artwork)}</p>
        <p className={styles.meta}>
          <span>{displayDate(artwork)}</span>
          {department ? <span>{department}</span> : null}
          {medium ? <span>{medium}</span> : null}
        </p>
      </div>
    </Link>
  )
}
