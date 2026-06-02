import { CoverImage } from './CoverImage.tsx'
import { imageForCategory } from '../utils/images.ts'

type CategoryTint = 'mint' | 'lavender' | 'ice' | 'peach' | 'slate'
type CategoryIcon = 'code' | 'pen' | 'translate' | 'music' | 'camera' | 'food'

type CategoryCardProps = {
  title: string
  tint?: CategoryTint
  icon?: CategoryIcon
  active?: boolean
  onClick?: () => void
}

export function CategoryCard({ title, active, onClick }: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'group overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 hover:shadow-md active:translate-y-px',
        active ? 'ring-2 ring-[var(--sw-pink)] shadow-md' : 'ring-black/5',
      ].join(' ')}
      aria-label={title}
      aria-pressed={active}
    >
      <div className="relative h-20 w-full overflow-hidden">
        <CoverImage
          src={imageForCategory(title, 200, 120)}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      <div className="p-3">
        <div className="text-sm font-semibold text-[var(--sw-text-strong)]">{title}</div>
      </div>
    </button>
  )
}
