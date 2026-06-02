import { Link } from 'react-router-dom'
import { AvatarImage } from '../ui/AvatarImage.tsx'
import { CoverImage } from '../ui/CoverImage.tsx'
import { imageForBadge, unsplashUrl } from '../utils/images.ts'

type Talent = {
  title: string
  subtitle: string
  tag: string
  tagTint: 'tech' | 'growth'
}

const talents: Talent[] = [
  { title: 'Video Editing', subtitle: 'Premiere Pro, DaVinci Resolve', tag: 'Tech', tagTint: 'tech' },
  { title: 'French Tutoring', subtitle: 'Grammar & Conversation', tag: 'Growth', tagTint: 'growth' },
]

export function Profile() {
  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--sw-bg)]/90 backdrop-blur supports-[backdrop-filter]:bg-[var(--sw-bg)]/70">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
          <AvatarImage name="Léo Bernard" size={80} className="h-10 w-10" />
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--sw-text-strong)] hover:bg-black/5 active:bg-black/10"
              aria-label="Notifications"
            >
              <BellIcon />
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--sw-text-strong)] hover:bg-black/5 active:bg-black/10"
              aria-label="Réglages"
            >
              <GearIcon />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-2 md:px-6">
        <section className="mt-2 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-7">
          <div className="flex flex-col items-center">
            <div className="relative">
              <AvatarImage name="Léo Bernard" size={224} className="h-24 w-24 ring-4 ring-white md:h-28 md:w-28" />
              <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-white" />
              <span className="absolute -inset-2 rounded-full ring-4 ring-[rgba(230,0,126,0.22)]" />
            </div>

            <h1 className="mt-4 text-2xl font-semibold text-[var(--sw-text-strong)] md:text-3xl">Léo Bernard</h1>
            <div className="mt-1 text-sm text-[var(--sw-muted)]">Sorbonne Université</div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="text-left text-sm font-semibold text-[var(--sw-pink)]">Karma Level 4</div>
            <div className="text-right text-sm font-semibold text-[var(--sw-muted)]">Master Swapper</div>
          </div>

          <div className="mt-3">
            <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-100 ring-1 ring-black/5">
              <div className="h-full w-[86%] rounded-full bg-[linear-gradient(90deg,var(--sw-pink),var(--sw-orange))]" />
            </div>
            <div className="mt-2 text-center text-xs text-[var(--sw-muted)]">450 / 500 XP pour le Niveau 5</div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <StatCard value="24" label="Swaps" />
            <StatCard value="4.8" label="Rating" icon="star" />
            <StatCard value="15" label="Friends" />
          </div>
        </section>

        <section className="mt-5">
          <div className="grid grid-cols-2 gap-3 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-black/5">
            <button
              type="button"
              className="rounded-xl bg-[var(--sw-pink)] px-4 py-3 text-sm font-semibold text-white shadow-sm"
            >
              Mes Talents
            </button>
            <button type="button" className="rounded-xl px-4 py-3 text-sm font-semibold text-[var(--sw-muted)]">
              Mes Souhaits
            </button>
          </div>
        </section>

        <section className="mt-5 flex flex-col gap-4">
          {talents.map((t) => (
            <TalentCard key={t.title} talent={t} />
          ))}
        </section>

        <section className="mt-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--sw-text-strong)]">
            <span className="text-[var(--sw-pink)]">⚡</span> Populaire
          </div>
        </section>

        <section className="mt-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-[var(--sw-text-strong)] md:text-xl">Badges &amp; Succès</h2>
            <Link to="/dashboard" className="text-sm font-semibold text-[var(--sw-pink)] hover:underline">
              Dashboard
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <BadgeCard title="Top Helper" tint="yellow" />
            <BadgeCard title="20+ Swaps" tint="blue" />
            <BadgeCard title="Socialite" tint="purple" />
          </div>
        </section>
      </main>
    </>
  )
}

function StatCard({ value, label, icon }: { value: string; label: string; icon?: 'star' }) {
  return (
    <div className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-black/5">
      <div className="flex items-center justify-center gap-1 text-lg font-extrabold text-[var(--sw-text-strong)]">
        <span>{value}</span>
        {icon === 'star' ? <span className="text-[var(--sw-orange)]">★</span> : null}
      </div>
      <div className="mt-1 text-xs font-semibold text-[var(--sw-muted)]">{label}</div>
    </div>
  )
}

function tagStyle(tint: Talent['tagTint']) {
  if (tint === 'tech') return 'bg-violet-100 text-violet-700'
  return 'bg-emerald-100 text-emerald-700'
}

function TalentCard({ talent }: { talent: Talent }) {
  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl">
          <CoverImage src={unsplashUrl(talent.title, 96, 96)} className="h-full w-full object-cover" />
        </div>

        <div className="min-w-0 flex-1 text-left">
          <div className="flex items-center justify-between gap-3">
            <div className="truncate text-sm font-semibold text-[var(--sw-text-strong)]">{talent.title}</div>
            <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${tagStyle(talent.tagTint)}`}>
              {talent.tag}
            </span>
          </div>
          <div className="mt-0.5 truncate text-xs text-[var(--sw-muted)]">{talent.subtitle}</div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['Sarah Klift', 'Marc Dubois', 'Alex Rivera'].map((peer) => (
                  <AvatarImage
                    key={peer}
                    name={peer}
                    size={56}
                    className="h-7 w-7 ring-2 ring-white"
                  />
                ))}
              </div>
              <div className="text-xs font-semibold text-[var(--sw-muted)]">+5</div>
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-[var(--sw-pink)] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:brightness-95 active:brightness-90"
            >
              Éditer
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function BadgeCard({ title, tint }: { title: string; tint: 'yellow' | 'blue' | 'purple' }) {
  const ring =
    tint === 'yellow'
      ? 'ring-[rgba(255,237,0,0.5)]'
      : tint === 'blue'
        ? 'ring-sky-200'
        : 'ring-[rgba(230,0,126,0.25)]'

  return (
    <div className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-black/5">
      <div className={`mx-auto h-14 w-14 overflow-hidden rounded-full ring-4 ${ring}`}>
        <CoverImage src={imageForBadge(title, 112)} className="h-full w-full object-cover" />
      </div>
      <div className="mt-3 text-xs font-semibold text-[var(--sw-muted)]">{title}</div>
    </div>
  )
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 22a2.2 2.2 0 0 0 2.2-2.2H9.8A2.2 2.2 0 0 0 12 22Zm7-6.3V11a7 7 0 0 0-5.2-6.8V3a1.8 1.8 0 0 0-3.6 0v1.2A7 7 0 0 0 5 11v4.7l-1.6 1.6V19h19.2v-1.7L19 15.7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M19.4 12a7.7 7.7 0 0 0-.1-1l2-1.6-2-3.4-2.4 1a7.9 7.9 0 0 0-1.7-1l-.4-2.6H9.2l-.4 2.6a7.9 7.9 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.6a7.7 7.7 0 0 0 0 2l-2 1.6 2 3.4 2.4-1c.5.4 1.1.7 1.7 1l.4 2.6h5.6l.4-2.6c.6-.3 1.2-.6 1.7-1l2.4 1 2-3.4-2-1.6c.1-.3.1-.7.1-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

