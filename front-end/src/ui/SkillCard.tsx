import { Link } from 'react-router-dom'
import { CoverImage } from './CoverImage.tsx'
import { imageForTag } from '../utils/images.ts'

type SkillCardProps = {
  id: string
  tag: string
  title: string
  subtitle: string
  rating: number
  className?: string
}

export function SkillCard({ id, tag, title, subtitle, rating, className }: SkillCardProps) {
  return (
    <article
      className={[
        'min-w-[260px] flex-1 select-none overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5',
        'md:min-w-0',
        className ?? '',
      ].join(' ')}
    >
      <div className="relative h-32 w-full overflow-hidden">
        <CoverImage
          src={imageForTag(tag)}
          className="h-full w-full object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-[var(--sw-pink)] px-3 py-1 text-xs font-semibold text-white shadow-sm">
          {tag}
        </span>
      </div>

      <div className="p-4 text-left">
        <h3 className="text-base font-semibold text-[var(--sw-text-strong)]">{title}</h3>
        <p className="mt-1 text-sm text-[var(--sw-muted)]">{subtitle}</p>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 text-[var(--sw-text-strong)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 17.3l-5.3 3 1.5-6-4.7-4.1 6.2-.5L12 4l2.3 5.7 6.2.5-4.7 4.1 1.5 6-5.3-3Z"
                fill="currentColor"
              />
            </svg>
            <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
          </div>

          <Link
            to={`/explore/${id}`}
            className="inline-flex items-center justify-center rounded-xl bg-[var(--sw-yellow)] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:brightness-95 active:brightness-90"
          >
            Détails
          </Link>
        </div>
      </div>
    </article>
  )
}
