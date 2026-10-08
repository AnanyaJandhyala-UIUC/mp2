import styles from './LoadingState.module.css'

type LoadingStateProps = {
  message?: string
}

export default function LoadingState({ message = 'Loading artworks…' }: LoadingStateProps) {
  return (
    <div className={styles.panel} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <p>{message}</p>
    </div>
  )
}
