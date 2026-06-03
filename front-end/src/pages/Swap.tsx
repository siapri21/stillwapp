import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BASE_URL } from '../api/config.js'
import type { ApiSession, ApiUser } from '../api/types.ts'
import { userFullName } from '../api/types.ts'
import { AvatarImage } from '../ui/AvatarImage.tsx'
import { CoverImage } from '../ui/CoverImage.tsx'
import { Modal } from '../ui/Modal.tsx'
import { NotificationLink } from '../ui/NotificationLink.tsx'
import { PageMain } from '../ui/PageMain.tsx'
import { unsplashUrl } from '../utils/images.ts'

type SessionView = {
  id: number
  name: string
  title: string
  status: 'Confirmée' | 'En attente' | 'Terminée'
  when: string
  place: string
}

function mapStatus(status: ApiSession['status']): SessionView['status'] {
  if (status === 'confirmed') return 'Confirmée'
  if (status === 'pending') return 'En attente'
  return 'Terminée'
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
      <header className="sticky top-0 z-30 bg-[var(--sw-bg)]/90 backdrop-blur supports-[backdrop-filter]:bg-[var(--sw-bg)]/70 lg:hidden">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
          <img src="/logoskillwapp.png" alt="SkillWapp" className="h-10 w-10 rounded-full object-cover" />
          <div className="ml-auto">
            <NotificationLink />
          </div>
        </div>
      </header>

      <PageMain>
        <div className="text-left">
          <div className="text-sm font-semibold text-[var(--sw-pink)]">Ton planning</div>
          <h1 className="mt-1 font-display text-3xl leading-tight text-[var(--sw-text-strong)] md:text-5xl">
            Gérer ton planning
          </h1>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Pill active>Toutes les sessions</Pill>
          <Pill>Confirmées</Pill>
          <Pill>En attente</Pill>
        </div>

        <div className="mt-5 flex flex-col gap-4 lg:grid lg:grid-cols-2">
          {loading ? (
            <p className="text-sm text-[var(--sw-muted)]">Chargement…</p>
          ) : (
            sessions.map((s) => <SessionCard key={s.id} session={s} onRemoved={(id) => setSessions((prev) => prev.filter((x) => x.id !== id))} />)
          )}
        </div>
      </PageMain>
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
  if (status === 'Confirmée') return 'bg-emerald-100 text-emerald-700'
  if (status === 'En attente') return 'bg-violet-100 text-violet-700'
  return 'bg-neutral-100 text-neutral-600'
}

function SessionCard({
  session,
  onRemoved,
}: {
  session: SessionView
  onRemoved: (id: number) => void
}) {
  const [visioOpen, setVisioOpen] = useState(false)
  const [rescheduleOpen, setRescheduleOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [rescheduled, setRescheduled] = useState(false)

  const handleCancel = () => {
    onRemoved(session.id)
    setCancelOpen(false)
  }

  const handleReschedule = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDate) return
    setRescheduled(true)
    window.setTimeout(() => {
      setRescheduleOpen(false)
      setRescheduled(false)
    }, 1200)
  }

  return (
    <>
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

        {session.status === 'Confirmée' ? (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setVisioOpen(true)}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-[var(--sw-pink)] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-95 active:brightness-90"
            >
              Rejoindre la visio
            </button>
          </div>
        ) : session.status === 'En attente' ? (
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCancelOpen(true)}
              className="inline-flex flex-1 items-center justify-center rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={() => setRescheduleOpen(true)}
              className="inline-flex flex-1 items-center justify-center rounded-2xl bg-[var(--sw-orange)]/15 px-4 py-3 text-sm font-semibold text-[var(--sw-orange)] hover:bg-[var(--sw-orange)]/25"
            >
              Reporter
            </button>
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-3">
            <div className="relative flex-1 overflow-hidden rounded-2xl">
              <CoverImage src={unsplashUrl(session.title, 400, 120)} className="h-14 w-full object-cover" />
              <div className="absolute inset-0 flex items-center bg-black/40 px-4 text-sm font-semibold text-white">
                Niveau compétence +1 !
              </div>
            </div>
            <Link
              to={`/reviews?session=${session.id}`}
              className="text-sm font-semibold text-[var(--sw-pink)] hover:underline"
            >
              Laisser un avis
            </Link>
          </div>
        )}
      </article>

      <Modal open={visioOpen} onClose={() => setVisioOpen(false)} title="Choisir la visio">
        <div className="flex flex-col gap-3">
          <a
            href="https://meet.google.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-2xl bg-[var(--sw-bg)] p-4 ring-1 ring-black/5 hover:ring-[var(--sw-pink)]/30"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-lg">📹</span>
            <div>
              <div className="font-semibold text-[var(--sw-text-strong)]">Google Meet</div>
              <div className="text-xs text-[var(--sw-muted)]">Ouvrir dans un nouvel onglet</div>
            </div>
          </a>
          <a
            href="https://zoom.us"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-2xl bg-[var(--sw-bg)] p-4 ring-1 ring-black/5 hover:ring-[var(--sw-pink)]/30"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-lg">🎥</span>
            <div>
              <div className="font-semibold text-[var(--sw-text-strong)]">Zoom</div>
              <div className="text-xs text-[var(--sw-muted)]">Ouvrir dans un nouvel onglet</div>
            </div>
          </a>
        </div>
      </Modal>

      <Modal open={rescheduleOpen} onClose={() => setRescheduleOpen(false)} title="Reporter la session">
        {rescheduled ? (
          <p className="py-4 text-center font-semibold text-emerald-600">Nouvelle date enregistrée !</p>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleReschedule}>
            <label className="text-sm font-semibold text-[var(--sw-text-strong)]">Nouvelle date</label>
            <input
              type="datetime-local"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="rounded-2xl bg-[var(--sw-bg)] px-4 py-3 text-sm outline-none ring-1 ring-black/5"
              required
            />
            <button type="submit" className="rounded-2xl bg-[var(--sw-orange)] py-3 text-sm font-semibold text-black">
              Confirmer
            </button>
          </form>
        )}
      </Modal>

      <Modal open={cancelOpen} onClose={() => setCancelOpen(false)} title="Annuler la session">
        <p className="text-sm text-[var(--sw-muted)]">
          Es-tu sûr(e) de vouloir annuler cette session avec {session.name} ? Cette action est définitive.
        </p>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => setCancelOpen(false)}
            className="flex-1 rounded-2xl bg-neutral-100 py-3 text-sm font-semibold text-[var(--sw-text-strong)]"
          >
            Non, garder
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 rounded-2xl bg-red-600 py-3 text-sm font-semibold text-white"
          >
            Oui, annuler
          </button>
        </div>
      </Modal>
    </>
  )
}
