import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BASE_URL } from '../api/config.js'
import type { ApiBadge, ApiCurrentUser, ApiSkill } from '../api/types.ts'
import { userFullName } from '../api/types.ts'
import { useAuth } from '../context/AuthContext.tsx'
import { AvatarImage } from '../ui/AvatarImage.tsx'
import { CoverImage } from '../ui/CoverImage.tsx'
import { imageForBadge } from '../utils/images.ts'

export function Profile() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [user, setUser] = useState<ApiCurrentUser | null>(null)
  const [talents, setTalents] = useState<ApiSkill[]>([])
  const [badges, setBadges] = useState<ApiBadge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${BASE_URL}/currentUser`).then((res) => res.json() as Promise<ApiCurrentUser>),
      fetch(`${BASE_URL}/skills`).then((res) => res.json() as Promise<ApiSkill[]>),
      fetch(`${BASE_URL}/badges`).then((res) => res.json() as Promise<ApiBadge[]>),
    ])
      .then(([currentUser, skillsData, badgesData]) => {
        setUser(currentUser)
        setTalents(skillsData.filter((s) => s.userId === currentUser.id))
        setBadges(badgesData.filter((b) => b.unlocked).slice(0, 3))
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading || !user) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[var(--sw-bg)]">
        <p className="text-sm text-[var(--sw-muted)]">Chargement…</p>
      </div>
    )
  }

  const fullName = userFullName(user)
  const xpPercent = Math.round((user.xp / user.xpNext) * 100)

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--sw-bg)]/90 backdrop-blur supports-[backdrop-filter]:bg-[var(--sw-bg)]/70">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
          <AvatarImage name={fullName} size={80} className="h-10 w-10" />
          <div className="ml-auto flex items-center gap-2">
            <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--sw-text-strong)] hover:bg-black/5 active:bg-black/10" aria-label="Notifications">
              <BellIcon />
            </button>
            <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--sw-text-strong)] hover:bg-black/5 active:bg-black/10" aria-label="Réglages">
              <GearIcon />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-2 md:px-6">
        <section className="mt-2 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-7">
          <div className="flex flex-col items-center">
            <div className="relative">
              <AvatarImage name={fullName} size={224} className="h-24 w-24 ring-4 ring-white md:h-28 md:w-28" />
              <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-white" />
              <span className="absolute -inset-2 rounded-full ring-4 ring-[rgba(230,0,126,0.22)]" />
            </div>

            <h1 className="mt-4 text-2xl font-semibold text-[var(--sw-text-strong)] md:text-3xl">{fullName}</h1>
            <div className="mt-1 text-sm text-[var(--sw-muted)]">{user.university}</div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="text-left text-sm font-semibold text-[var(--sw-pink)]">Karma Level {user.level}</div>
            <div className="text-right text-sm font-semibold text-[var(--sw-muted)]">{user.title}</div>
          </div>

          <div className="mt-3">
            <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-100 ring-1 ring-black/5">
              <div className="h-full rounded-full bg-[linear-gradient(90deg,var(--sw-pink),var(--sw-orange))]" style={{ width: `${xpPercent}%` }} />
            </div>
            <div className="mt-2 text-center text-xs text-[var(--sw-muted)]">
              {user.xp} / {user.xpNext} XP pour le Niveau {user.level + 1}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <StatCard value={String(user.swaps)} label="Swaps" />
            <StatCard value={user.rating.toFixed(1)} label="Rating" icon="star" />
            <StatCard value={String(user.friends)} label="Friends" />
          </div>
        </section>

        <section className="mt-5">
          <div className="grid grid-cols-2 gap-3 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-black/5">
            <button type="button" className="rounded-xl bg-[var(--sw-pink)] px-4 py-3 text-sm font-semibold text-white shadow-sm">
              Mes Talents
            </button>
            <button type="button" className="rounded-xl px-4 py-3 text-sm font-semibold text-[var(--sw-muted)]">
              Mes Souhaits
            </button>
          </div>
        </section>

        <section className="mt-5 flex flex-col gap-4">
          {talents.map((skill) => (
            <TalentCard key={skill.id} skill={skill} />
          ))}
        </section>

        <section className="mt-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-[var(--sw-text-strong)] md:text-xl">Badges &amp; Succès</h2>
            <Link to="/dashboard" className="text-sm font-semibold text-[var(--sw-pink)] hover:underline">
              Dashboard
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {badges.map((badge, i) => (
              <BadgeCard key={badge.id} title={badge.name} tint={(['yellow', 'blue', 'purple'] as const)[i % 3]} />
            ))}
          </div>
        </section>

        <section className="mt-6">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-2xl border border-red-200 bg-white py-3.5 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-red-100 hover:bg-red-50 active:bg-red-100"
          >
            Se déconnecter
          </button>
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

function TalentCard({ skill }: { skill: ApiSkill }) {
  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl">
          <CoverImage src={skill.image} className="h-full w-full object-cover" />
        </div>

        <div className="min-w-0 flex-1 text-left">
          <div className="flex items-center justify-between gap-3">
            <div className="truncate text-sm font-semibold text-[var(--sw-text-strong)]">{skill.title}</div>
            <span className="shrink-0 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
              {skill.category}
            </span>
          </div>
          <div className="mt-0.5 truncate text-xs text-[var(--sw-muted)]">{skill.tags.join(' • ')}</div>

          <button
            type="button"
            className="mt-4 inline-flex items-center justify-center rounded-xl bg-[var(--sw-pink)] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:brightness-95 active:brightness-90"
          >
            Éditer
          </button>
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
      <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M19.4 12a7.7 7.7 0 0 0-.1-1l2-1.6-2-3.4-2.4 1a7.9 7.9 0 0 0-1.7-1l-.4-2.6H9.2l-.4 2.6a7.9 7.9 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.6a7.7 7.7 0 0 0 0 2l-2 1.6 2 3.4 2.4-1c.5.4 1.1.7 1.7 1l.4 2.6h5.6l.4-2.6c.6-.3 1.2-.6 1.7-1l2.4 1 2-3.4-2-1.6c.1-.3.1-.7.1-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}
