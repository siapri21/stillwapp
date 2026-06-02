import { imageForCategory } from '../utils/images.ts'
import { CoverImage } from './CoverImage.tsx'

type OfferCardProps = {
  title: string
  author: string
  duration: string
  rating: number
  category?: string
  image?: string
}

export function OfferCard({ title, author, duration, rating, category, image }: OfferCardProps) {
  const imageSrc = image ?? (category ? imageForCategory(category, 96, 96) : imageForCategory('skills', 96, 96))

  return (
    <article className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl">
        <CoverImage src={imageSrc} className="h-full w-full object-cover" />
      </div>

      <div className="min-w-0 flex-1 text-left">
        <div className="truncate text-sm font-semibold text-[var(--sw-text-strong)]">{title}</div>
        <div className="mt-0.5 truncate text-xs text-[var(--sw-muted)]">
          par <span className="font-semibold text-[var(--sw-text-strong)]">{author}</span>
        </div>
        <div className="mt-1 flex items-center gap-3 text-xs text-[var(--sw-muted)]">
          <span className="inline-flex items-center gap-1">
            <ClockIcon />
            {duration}
          </span>
          <span className="inline-flex items-center gap-1 text-[var(--sw-text-strong)]">
            <StarIcon />
            <span className="font-semibold">{rating.toFixed(1)}</span>
          </span>
        </div>
      </div>

      <button
        type="button"
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--sw-pink)] text-white shadow-sm hover:brightness-95 active:brightness-90"
        aria-label="Swap"
      >
        <SwapGlyph />
      </button>
    </article>
  )
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 17.3l-5.3 3 1.5-6-4.7-4.1 6.2-.5L12 4l2.3 5.7 6.2.5-4.7 4.1 1.5 6-5.3-3Z"
        fill="currentColor"
      />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M12 7v6l4 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function SwapGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 7h11l-2.5-2.5M17 17H6l2.5 2.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6 7v6M18 17v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
