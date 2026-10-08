import { Link } from 'react-router-dom'
import type { Artwork } from '../types/Artwork.ts'
import ArtworkImage from './ArtworkImage.tsx'
import { artistName } from '../utils/artwork.ts'
import styles from './ArtworkCard.module.css'

type ArtworkCardProps = {
  artwork: Artwork
  iiifUrl: string
}

export default function ArtworkCard({ artwork, iiifUrl }: ArtworkCardProps) {
  return (
    <Link className={styles.card} to={`/artwork/${artwork.id}`}>
      <ArtworkImage artwork={artwork} iiifUrl={iiifUrl} width={600} fit="cover" className={styles.frame} />
      <div className={styles.copy}>
        <h2 className={styles.title}>{artwork.title}</h2>
        <p className={styles.artist}>{artistName(artwork)}</p>
      </div>
    </Link>
  )
}
