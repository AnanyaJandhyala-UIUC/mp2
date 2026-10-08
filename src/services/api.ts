import axios from 'axios'
import type { Artwork, ArtworkApiRecord, ArtworkResponse, ArtworksResponse } from '../types/Artwork.ts'

const client = axios.create({
  baseURL: 'https://api.artic.edu/api/v1',
  timeout: 20000,
})

export const DEFAULT_IIIF_URL = 'https://www.artic.edu/iiif/2'

const COLLECTION_LIMIT = 100

const ARTWORK_FIELDS = [
  'id',
  'title',
  'artist_display',
  'artist_title',
  'date_display',
  'date_start',
  'image_id',
  'department_title',
  'medium_display',
  'place_of_origin',
  'dimensions',
  'thumbnail',
].join(',')

export interface ArtworkCollection {
  artworks: Artwork[]
  iiifUrl: string
}

function cleanText(value: string | null | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

export function normalizeArtwork(record: ArtworkApiRecord): Artwork | null {
  if (typeof record.id !== 'number') return null

  const thumbnail = record.thumbnail
    ? {
        lqip: cleanText(record.thumbnail.lqip),
        alt_text: cleanText(record.thumbnail.alt_text),
        width: typeof record.thumbnail.width === 'number' ? record.thumbnail.width : null,
        height: typeof record.thumbnail.height === 'number' ? record.thumbnail.height : null,
      }
    : null

  return {
    id: record.id,
    title: cleanText(record.title) ?? 'Untitled',
    artist_display: cleanText(record.artist_display),
    artist_title: cleanText(record.artist_title),
    date_display: cleanText(record.date_display),
    date_start: typeof record.date_start === 'number' && Number.isFinite(record.date_start) ? record.date_start : null,
    image_id: cleanText(record.image_id),
    department_title: cleanText(record.department_title),
    medium_display: cleanText(record.medium_display),
    place_of_origin: cleanText(record.place_of_origin),
    dimensions: cleanText(record.dimensions),
    thumbnail,
  }
}

function iiifBase(url: string | undefined): string {
  const base = url?.trim() || DEFAULT_IIIF_URL
  return base.replace(/\/$/, '')
}

export function artworkImageUrl(iiifUrl: string, imageId: string | null, width: number): string | null {
  if (!imageId) return null
  return `${iiifBase(iiifUrl)}/${imageId}/full/${width},/0/default.jpg`
}

export async function fetchArtworks(signal?: AbortSignal): Promise<ArtworkCollection> {
  const response = await client.get<ArtworksResponse>('/artworks/search', {
    signal,
    params: {
      limit: COLLECTION_LIMIT,
      fields: ARTWORK_FIELDS,
      'query[term][is_public_domain]': true,
    },
  })

  const artworks = (response.data.data ?? []).flatMap((record) => {
    const artwork = normalizeArtwork(record)
    return artwork ? [artwork] : []
  })

  return {
    artworks,
    iiifUrl: iiifBase(response.data.config?.iiif_url),
  }
}

export async function fetchArtwork(id: number, signal?: AbortSignal): Promise<Artwork> {
  const response = await client.get<ArtworkResponse>(`/artworks/${id}`, {
    signal,
    params: { fields: ARTWORK_FIELDS },
  })

  const artwork = response.data.data ? normalizeArtwork(response.data.data) : null
  if (!artwork) {
    throw new Error('Artwork not found')
  }
  return artwork
}

export function isAbortError(error: unknown): boolean {
  return axios.isCancel(error)
}

export function isNotFoundError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 404
}

export function toErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'We could not reach the Art Institute of Chicago. Check your connection and try again.'
    }
    return 'The Art Institute of Chicago could not return artworks right now. Please try again.'
  }
  return 'Something went wrong while loading artworks.'
}
