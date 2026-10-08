import { Link } from 'react-router-dom'
import styles from './ErrorState.module.css'

type ErrorStateProps = {
  title: string
  message: string
  onRetry?: () => void
  actionHref?: string
  actionLabel?: string
  as?: 'h1' | 'p'
}

export default function ErrorState({
  title,
  message,
  onRetry,
  actionHref,
  actionLabel,
  as = 'h1',
}: ErrorStateProps) {
  const TitleTag = as

  return (
    <div className={styles.panel} role="alert">
      <TitleTag className={styles.title}>{title}</TitleTag>
      <p className={styles.message}>{message}</p>
      <div className={styles.actions}>
        {onRetry ? (
          <button type="button" className={styles.primary} onClick={onRetry}>
            Try again
          </button>
        ) : null}
        {actionHref && actionLabel ? (
          <Link className={styles.secondary} to={actionHref}>
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </div>
  )
}
