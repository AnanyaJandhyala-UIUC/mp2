import ErrorState from '../components/ErrorState.tsx'

export default function NotFoundPage() {
  return (
    <ErrorState
      title="Page not found"
      message="That page is not part of Art Explorer."
      actionHref="/"
      actionLabel="Back to list"
    />
  )
}
