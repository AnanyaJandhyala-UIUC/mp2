import styles from './SearchBar.module.css'

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor="artwork-search">
        Search
      </label>
      <input
        id="artwork-search"
        className={styles.input}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by title or artist"
        autoComplete="off"
      />
    </div>
  )
}
