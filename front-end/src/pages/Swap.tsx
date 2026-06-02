import { useEffect, useState } from 'react'
import { BASE_URL } from '../api/config.js'
import type { ApiSession, ApiUser } from '../api/types.ts'
import { userFullName } from '../api/types.ts'
import { AvatarImage } from '../ui/AvatarImage.tsx'
import { CoverImage } from '../ui/CoverImage.tsx'
import { unsplashUrl } from '../utils/images.ts'

type SessionView = {
  id: number
  name: string
  title: string
  status: 'Confirmed' | 'Pending' | 'Completed'
  when: string
  place: string
}

function mapStatus(status: ApiSession['status']): SessionView['status'] {
  if (status === 'confirmed') return 'Confirmed'
  if (status === 'pending') return 'Pending'
  return 'Completed'
}

export function Swap() {
  const [sessions, setSessions] = useState<SessionView[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${BASE_URL}/sessions`).then((res) => res.json() as Promise<ApiSession[]>),
      fetch(`${BASE_URL}/users`).then((res) => res.json() as Promise<ApiUser[]>),
    ])
      .then(([sessionsData, usersData]) => {
        const mapped = sessionsData.map((session) => {
          const user = usersData.find((u) => u.id === session.userId)
          return {
            id: session.id,
            name: user ? userFullName(user) : 'Utilisateur',
            title: session.skill,
            status: mapStatus(session.status),
            when: `${session.date}, ${session.time}`,
            place: session.location,
          }
        })
        setSessions(mapped)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--sw-bg)]/90 backdrop-blur supports-[backdrop-filter]:bg-[var(--sw-bg)]/70">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
          <img src="/logoskillwapp.png" alt="SkillWapp" className="h-10 w-10 rounded-full object-cover" />
          <div className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--sw-text-strong)] hover:bg-black/5 active:bg-black/10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 22a2.2 2.2 0 0 0 2.2-2.2H9.8A2.2 2.2 0 0 0 12 22Zm7-6.3V11a7 7 0 0 0-5.2-6.8V3a1.8 1.8 0 0 0-3.6 0v1.2A7 7 0 0 0 5 11v4.7l-1.6 1.6V19h19.2v-1.7L19 15.7Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-4 md:px-6">
        <div className="text-left">
          <div className="text-sm font-semibold text-[var(--sw-pink)]">Your Schedule</div>
          <h1 className="mt-1 text-3xl font-semibold leading-tight text-[var(--sw-text-strong)] md:text-5xl">
            Manage Swaps
          </h1>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Pill active>All Sessions</Pill>
          <Pill>Confirmed</Pill>
          <Pill>Pending</Pill>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          {loading ? (
            <p className="text-sm text-[var(--sw-muted)]">Chargement…</p>
          ) : (
            sessions.map((s) => <SessionCard key={s.id} session={s} />)
          )}
        </div>
      </main>
    </>
  )
}

function Pill({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <button
      type="button"
      className={[
        'inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-black/5',
        active ? 'bg-[var(--sw-orange)] text-white shadow-[0_12px_22px_rgba(255,122,55,0.25)]' : 'bg-white text-[var(--sw-text-strong)]',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

function statusBadge(status: SessionView['status']) {
  if (status === 'Confirmed') return 'bg-emerald-100 text-emerald-700'
  if (status === 'Pending') return 'bg-violet-100 text-violet-700'
  return 'bg-neutral-100 text-neutral-600'
}

function SessionCard({ session }: { session: SessionView }) {
  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="flex items-start gap-3">
        <AvatarImage name={session.name} size={96} rounded="2xl" className="h-12 w-12 shrink-0" />

        <div className="min-w-0 flex-1 text-left">
          <div className="flex items-center justify-between gap-3">
            <div className="truncate text-sm font-semibold text-[var(--sw-text-strong)]">{session.name}</div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(session.status)}`}>
              {session.status}
            </span>
          </div>
          <div className="mt-0.5 truncate text-sm text-[var(--sw-muted)]">{session.title}</div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[var(--sw-muted)]">
            <span>{session.when}</span>
            <span>{session.place}</span>
          </div>
        </div>
      </div>

      {session.status === 'Confirmed' ? (
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            className="inline-flex flex-1 items-center justify-center rounded-2xl bg-[var(--sw-pink)] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-95 active:brightness-90"
          >
            Join Meeting
          </button>
        </div>
      ) : session.status === 'Pending' ? (
        <div className="mt-4 flex items-center gap-3">
          <button type="button" className="inline-flex flex-1 items-center justify-center rounded-2xl bg-neutral-100 px-4 py-3 text-sm font-semibold text-neutral-400" disabled>
            Cancel
          </button>
          <button type="button" className="inline-flex flex-1 items-center justify-center rounded-2xl bg-neutral-100 px-4 py-3 text-sm font-semibold text-neutral-400" disabled>
            Reschedule
          </button>
        </div>
      ) : (
        <div className="mt-4 flex items-center gap-3">
          <div className="relative flex-1 overflow-hidden rounded-2xl">
            <CoverImage src={unsplashUrl(session.title, 400, 120)} className="h-14 w-full object-cover" />
            <div className="absolute inset-0 flex items-center bg-black/40 px-4 text-sm font-semibold text-white">
              Skill Level Up!
            </div>
          </div>
          <button type="button" className="text-sm font-semibold text-[var(--sw-pink)] hover:underline">
            Leave Review
          </button>
        </div>
      )}
    </article>
  )
}
