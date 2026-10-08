import type { Artwork } from '../types/Artwork.ts'

export type SortKey = 'title' | 'artist' | 'date'
export type SortOrder = 'asc' | 'desc'

export function artistName(artwork: Artwork): string {
  if (artwork.artist_title) return artwork.artist_title
  const display = artwork.artist_display?.replace(/\s+/g, ' ').trim()
  return display || 'Unknown artist'
}

export function artistDetails(artwork: Artwork): string | null {
  if (!artwork.artist_display) return null
  const compact = artwork.artist_display.replace(/\s+/g, ' ').trim()
  if (compact === artistName(artwork)) return null
  return artwork.artist_display
}

export function displayDate(artwork: Artwork): string {
  if (artwork.date_display) return artwork.date_display
  if (artwork.date_start !== null) return String(artwork.date_start)
  return 'Date unknown'
}

export function imageAlt(artwork: Artwork): string {
  if (artwork.thumbnail?.alt_text) return artwork.thumbnail.alt_text
  return `${artwork.title} by ${artistName(artwork)}`
}

export function matchesQuery(artwork: Artwork, query: string): boolean {
  const needle = query.trim().toLowerCase()
  if (!needle) return true

  const haystack = [artwork.title, artwork.artist_title, artwork.artist_display]
    .filter((value): value is string => Boolean(value))
    .join(' ')
    .toLowerCase()

  return haystack.includes(needle)
}

function artistSortValue(artwork: Artwork): string | null {
  return artwork.artist_title ?? artwork.artist_display?.replace(/\s+/g, ' ').trim() ?? null
}

function dateSortValue(artwork: Artwork): number | null {
  if (artwork.date_start === null || artwork.date_start === 0) return null
  return artwork.date_start
}

function compareValues(a: Artwork, b: Artwork, sortBy: SortKey, direction: number): number {
  if (sortBy === 'date') {
    const aDate = dateSortValue(a)
    const bDate = dateSortValue(b)
    if (aDate === null && bDate === null) return 0
    if (aDate === null) return 1
    if (bDate === null) return -1
    return (aDate - bDate) * direction
  }

  const aText = sortBy === 'title' ? a.title : artistSortValue(a)
  const bText = sortBy === 'title' ? b.title : artistSortValue(b)
  const aMissing = !aText
  const bMissing = !bText
  if (aMissing && bMissing) return 0
  if (aMissing) return 1
  if (bMissing) return -1

  return aText.localeCompare(bText, undefined, { sensitivity: 'base', numeric: true }) * direction
}

export function sortArtworks(artworks: readonly Artwork[], sortBy: SortKey, order: SortOrder): Artwork[] {
  const direction = order === 'asc' ? 1 : -1
  const sorted = [...artworks]
  sorted.sort((a, b) => compareValues(a, b, sortBy, direction))
  return sorted
}
