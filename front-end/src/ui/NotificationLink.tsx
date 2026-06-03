import { Link } from 'react-router-dom'

type NotificationLinkProps = {
  className?: string
}

export function NotificationLink({ className }: NotificationLinkProps) {
  return (
    <Link
      to="/notifications"
      className={
        className ??
        'inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--sw-text-strong)] hover:bg-black/5 active:bg-black/10'
      }
      aria-label="Notifications"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 22a2.2 2.2 0 0 0 2.2-2.2H9.8A2.2 2.2 0 0 0 12 22Zm7-6.3V11a7 7 0 0 0-5.2-6.8V3a1.8 1.8 0 0 0-3.6 0v1.2A7 7 0 0 0 5 11v4.7l-1.6 1.6V19h19.2v-1.7L19 15.7Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  )
}
