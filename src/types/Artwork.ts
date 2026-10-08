export interface ArtworkThumbnail {
  lqip: string | null
  alt_text: string | null
  width: number | null
  height: number | null
}

export interface Artwork {
  id: number
  title: string
  artist_display: string | null
  artist_title: string | null
  date_display: string | null
  date_start: number | null
  image_id: string | null
  department_title: string | null
  medium_display: string | null
  place_of_origin: string | null
  dimensions: string | null
  thumbnail: ArtworkThumbnail | null
}

export interface ArtworkApiRecord {
  id?: number
  title?: string | null
  artist_display?: string | null
  artist_title?: string | null
  date_display?: string | null
  date_start?: number | null
  image_id?: string | null
  department_title?: string | null
  medium_display?: string | null
  place_of_origin?: string | null
  dimensions?: string | null
  thumbnail?: {
    lqip?: string | null
    width?: number | null
    height?: number | null
    alt_text?: string | null
  } | null
}

export interface ArtworksResponse {
  data?: ArtworkApiRecord[]
  config?: {
    iiif_url?: string
  }
}

export interface ArtworkResponse {
  data?: ArtworkApiRecord
  config?: {
    iiif_url?: string
  }
}
