import type { SortKey, SortOrder } from '../utils/artwork.ts'
import styles from './SortControls.module.css'

type SortControlsProps = {
  sortBy: SortKey
  order: SortOrder
  onSortByChange: (value: SortKey) => void
  onOrderChange: (value: SortOrder) => void
}

function isSortKey(value: string): value is SortKey {
  return value === 'title' || value === 'artist' || value === 'date'
}

function isSortOrder(value: string): value is SortOrder {
  return value === 'asc' || value === 'desc'
}

export default function SortControls({ sortBy, order, onSortByChange, onOrderChange }: SortControlsProps) {
  return (
    <div className={styles.row}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="sort-by">
          Sort by
        </label>
        <select
          id="sort-by"
          className={styles.select}
          value={sortBy}
          onChange={(event) => {
            if (isSortKey(event.target.value)) onSortByChange(event.target.value)
          }}
        >
          <option value="title">Title</option>
          <option value="artist">Artist</option>
          <option value="date">Date</option>
        </select>
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="sort-order">
          Order
        </label>
        <select
          id="sort-order"
          className={styles.select}
          value={order}
          onChange={(event) => {
            if (isSortOrder(event.target.value)) onOrderChange(event.target.value)
          }}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  )
}
