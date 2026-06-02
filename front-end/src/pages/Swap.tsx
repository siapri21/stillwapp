import type { Session } from '../data/mock.ts'
import { sessions } from '../data/mock.ts'
import { AvatarImage } from '../ui/AvatarImage.tsx'
import { CoverImage } from '../ui/CoverImage.tsx'
import { unsplashUrl } from '../utils/images.ts'

type SessionStatus = Session['status']

export function Swap() {
  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--sw-bg)]/90 backdrop-blur supports-[backdrop-filter]:bg-[var(--sw-bg)]/70">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
          <div className="flex items-center gap-2">
            <img src="/logoskillwapp.png" alt="SkillWapp" className="h-10 w-10 rounded-full object-cover" />
          </div>
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
          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="text-sm text-[var(--sw-muted)]">October 2023</div>
            <button type="button" className="text-sm font-semibold text-[var(--sw-pink)] hover:underline">
              View full
            </button>
          </div>
        </div>

        <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
          {[
            { d: 'MON', n: '12' },
            { d: 'TUE', n: '13', active: true },
            { d: 'WED', n: '14' },
            { d: 'THU', n: '15' },
            { d: 'FRI', n: '16' },
          ].map((x) => (
            <button
              key={x.d}
              type="button"
              className={[
                'flex w-[74px] shrink-0 flex-col items-center justify-center rounded-2xl bg-white px-3 py-3 text-[var(--sw-text-strong)] ring-1 ring-black/5',
                x.active ? 'bg-[var(--sw-orange)] text-white shadow-[0_14px_26px_rgba(255,122,55,0.35)]' : '',
              ].join(' ')}
              aria-label={`${x.d} ${x.n}`}
            >
              <span className="text-[10px] font-bold tracking-wide opacity-80">{x.d}</span>
              <span className="mt-1 text-lg font-extrabold">{x.n}</span>
              {x.active ? <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--sw-yellow)]" /> : <span className="mt-2 h-1.5 w-1.5 rounded-full bg-transparent" />}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Pill active>All Sessions</Pill>
          <Pill>Confirmed</Pill>
          <Pill>Pending</Pill>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          {sessions.map((s) => (
            <SessionCard key={`${s.name}-${s.title}`} session={s} />
          ))}
        </div>

        <button
          type="button"
          className="fixed bottom-24 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--sw-orange)] text-white shadow-[0_16px_32px_rgba(0,0,0,0.18)] active:translate-y-px md:bottom-8"
          aria-label="Ajouter"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </button>
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

function statusBadge(status: SessionStatus) {
  if (status === 'Confirmed') return 'bg-emerald-100 text-emerald-700'
  if (status === 'Pending') return 'bg-violet-100 text-violet-700'
  return 'bg-neutral-100 text-neutral-600'
}

function SessionCard({ session }: { session: Session }) {
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
            <span className="inline-flex items-center gap-1">
              <CalendarIcon />
              {session.when}
            </span>
            <span className="inline-flex items-center gap-1">
              <PinIcon />
              {session.place}
            </span>
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
          <button
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[var(--sw-text-strong)] ring-1 ring-black/5 hover:bg-black/5 active:bg-black/10"
            aria-label="Chat"
          >
            <ChatIcon />
          </button>
        </div>
      ) : session.status === 'Pending' ? (
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            className="inline-flex flex-1 items-center justify-center rounded-2xl bg-neutral-100 px-4 py-3 text-sm font-semibold text-neutral-400"
            disabled
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex flex-1 items-center justify-center rounded-2xl bg-neutral-100 px-4 py-3 text-sm font-semibold text-neutral-400"
            disabled
          >
            Reschedule
          </button>
        </div>
      ) : (
        <div className="mt-4 flex items-center gap-3">
        <div className="relative flex-1 overflow-hidden rounded-2xl">
          <CoverImage
            src={unsplashUrl(session.title, 400, 120)}
            className="h-14 w-full object-cover"
          />
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

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 3v3M17 3v3M4.5 8.5h15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6 6h12a2.5 2.5 0 0 1 2.5 2.5V19A2.5 2.5 0 0 1 18 21.5H6A2.5 2.5 0 0 1 3.5 19V8.5A2.5 2.5 0 0 1 6 6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 22s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M12 12.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z" fill="currentColor" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 10h8M8 14h5M21 12a8.5 8.5 0 0 1-8.5 8.5H6l-3 1.5 1.2-3A8.5 8.5 0 1 1 21 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

