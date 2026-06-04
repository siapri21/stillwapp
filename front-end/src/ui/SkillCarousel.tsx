import { useRef, useState } from 'react'
import type { ReactNode } from 'react'

type SkillCarouselProps = {
  children: ReactNode
}

export function SkillCarousel({ children }: SkillCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const updateArrows = () => {
    const el = trackRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 8)
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }

  const scroll = (dir: -1 | 1) => {
    const el = trackRef.current
    if (!el) return
    const step = el.clientWidth * 0.85
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
    window.setTimeout(updateArrows, 320)
  }

  return (
    <div className="relative mt-4">
      <button
        type="button"
        onClick={() => scroll(-1)}
        disabled={!canPrev}
        className="absolute -left-1 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[var(--sw-pink)] shadow-lg ring-1 ring-black/10 transition hover:scale-105 disabled:opacity-30 md:flex lg:left-0"
        aria-label="Précédent"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        ref={trackRef}
        onScroll={updateArrows}
        className="flex gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 [scrollbar-width:none] lg:gap-5 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      <button
        type="button"
        onClick={() => scroll(1)}
        disabled={!canNext}
        className="absolute -right-1 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[var(--sw-pink)] shadow-lg ring-1 ring-black/10 transition hover:scale-105 disabled:opacity-30 md:flex lg:right-0"
        aria-label="Suivant"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}
