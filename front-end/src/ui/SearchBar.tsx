import { Link } from 'react-router-dom'

type SearchBarProps = {
  placeholder?: string
  className?: string
}

export function SearchBar({
  placeholder = 'Trouver une compétence…',
  className = '',
}: SearchBarProps) {
  return (
    <Link
      to="/search"
      className={[
        'flex items-center gap-3 rounded-2xl bg-white/95 p-3 text-[var(--sw-text-strong)] shadow-sm ring-1 ring-black/5 transition hover:ring-[var(--sw-pink)]/30',
        className,
      ].join(' ')}
      aria-label={placeholder}
    >
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="2" />
          <path d="M21 21l-4.2-4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      <span className="text-[15px] text-[var(--sw-muted)] md:text-base">{placeholder}</span>
    </Link>
  )
}
