import { useState } from 'react'
import type { Artwork } from '../types/Artwork.ts'
import { artworkImageUrl } from '../services/api.ts'
import { imageAlt } from '../utils/artwork.ts'
import styles from './ArtworkImage.module.css'

type ArtworkImageProps = {
  artwork: Artwork
  iiifUrl: string
  width: number
  fit: 'cover' | 'contain'
  priority?: boolean
  className?: string
}

export default function ArtworkImage({
  artwork,
  iiifUrl,
  width,
  fit,
  priority = false,
  className,
}: ArtworkImageProps) {
  const src = artworkImageUrl(iiifUrl, artwork.image_id, width)
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const failed = src !== null && failedSrc === src

  const frameClass = [styles.root, styles[fit], className].filter(Boolean).join(' ')

  if (!src || failed) {
    return (
      <div className={frameClass}>
        <div className={styles.placeholder}>
          <svg className={styles.icon} viewBox="0 0 64 64" aria-hidden="true">
            <rect x="8" y="12" width="48" height="40" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="24" cy="26" r="4" fill="currentColor" />
            <path d="M12 46 26 32l8 7 6-5 12 12" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span>Image unavailable</span>
        </div>
      </div>
    )
  }

  return (
    <div className={frameClass}>
      <img
        className={styles.image}
        src={src}
        alt={imageAlt(artwork)}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        referrerPolicy="no-referrer"
        onError={() => setFailedSrc(src)}
      />
    </div>
  )
}
