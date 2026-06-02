import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BASE_URL } from '../api/config.js'
import type { ApiBadge, ApiChallenge, ApiCurrentUser, ApiLeaderboardEntry, ApiUser } from '../api/types.ts'
import { userFullName } from '../api/types.ts'
import { AvatarImage } from '../ui/AvatarImage.tsx'
import { CoverImage } from '../ui/CoverImage.tsx'
import { imageForBadge, imageForChallenge } from '../utils/images.ts'

type LeaderboardView = {
  rank: number
  name: string
  xp: string
  highlight: boolean
  change?: string
}

export function Dashboard() {
  const [user, setUser] = useState<ApiCurrentUser | null>(null)
  const [badges, setBadges] = useState<ApiBadge[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardView[]>([])
  const [challenge, setChallenge] = useState<ApiChallenge | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${BASE_URL}/currentUser`).then((res) => res.json() as Promise<ApiCurrentUser>),
      fetch(`${BASE_URL}/badges`).then((res) => res.json() as Promise<ApiBadge[]>),
      fetch(`${BASE_URL}/leaderboard`).then((res) => res.json() as Promise<ApiLeaderboardEntry[]>),
      fetch(`${BASE_URL}/users`).then((res) => res.json() as Promise<ApiUser[]>),
      fetch(`${BASE_URL}/challenges`).then((res) => res.json() as Promise<ApiChallenge[]>),
    ])
      .then(([currentUser, badgesData, leaderboardData, usersData, challengesData]) => {
        setUser(currentUser)
        setBadges(badgesData.filter((b) => b.unlocked).slice(0, 3))
        setChallenge(challengesData.find((c) => c.active && c.type === 'daily') ?? null)

        const topEntries = leaderboardData
          .sort((a, b) => a.rank - b.rank)
          .slice(0, 4)
          .map((entry) => {
            const entryUser = usersData.find((u) => u.id === entry.userId)
            const isCurrentUser = entry.userId === currentUser.id
            return {
              rank: entry.rank,
              name: isCurrentUser ? 'You' : entryUser ? userFullName(entryUser) : 'Étudiant',
              xp: `${entry.xp.toLocaleString('fr-FR')} XP`,
              highlight: isCurrentUser,
              change: entry.trend === 'up' ? '+2' : undefined,
            }
          })
        setLeaderboard(topEntries)
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

  const xpPercent = Math.round((user.xp / user.xpNext) * 100)

  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--sw-bg)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
          <Link to="/profile" className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5" aria-label="Retour">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <h1 className="flex-1 text-center text-lg font-semibold text-[var(--sw-text-strong)]">Gamification</h1>
          <div className="h-10 w-10" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-2 md:px-6">
        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold text-[var(--sw-orange)]">Current Level</div>
              <div className="text-3xl font-extrabold text-[var(--sw-pink)]">Level {user.level}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-[var(--sw-orange)]">Total Points</div>
              <div className="text-2xl font-extrabold text-[var(--sw-text-strong)]">{user.totalPoints.toLocaleString('fr-FR')} UP</div>
            </div>
          </div>
          <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            🔥 {user.streak} Day Streak
          </div>
          <div className="mt-4 flex items-center justify-between text-xs font-semibold">
            <span className="text-[var(--sw-muted)]">Next Level: {user.xpNext} XP</span>
            <span className="text-[var(--sw-pink)]">{xpPercent}%</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-neutral-100">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${xpPercent}%` }} />
          </div>
        </section>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
            <CoverImage src={imageForBadge('teamwork', 200)} className="h-16 w-full object-cover" />
            <div className="p-4 pt-3">
              <div className="text-sm font-semibold text-[var(--sw-text-strong)]">Swaps</div>
              <div className="text-xs text-[var(--sw-muted)]">{user.swaps} Total</div>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
            <CoverImage src={imageForBadge('success', 200)} className="h-16 w-full object-cover" />
            <div className="p-4 pt-3">
              <div className="text-sm font-semibold text-[var(--sw-text-strong)]">Rating</div>
              <div className="text-xs text-[var(--sw-muted)]">{user.rating.toFixed(1)} / 5.0</div>
            </div>
          </div>
        </div>

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--sw-text-strong)]">Unlocked Badges</h2>
            <button type="button" className="text-sm font-semibold text-[var(--sw-pink)]">View All</button>
          </div>
          <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
            {badges.map((b) => (
              <div key={b.id} className="flex shrink-0 flex-col items-center gap-2">
                <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-full ring-4 ring-[var(--sw-pink)]/20 text-2xl" style={{ backgroundColor: b.color }}>
                  {b.icon}
                </div>
                <span className="text-xs font-semibold text-[var(--sw-muted)]">{b.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-semibold text-[var(--sw-text-strong)]">Top Swappers</h2>
          <div className="mt-3 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
            {leaderboard.map((entry) => (
              <div
                key={`${entry.rank}-${entry.name}`}
                className={['flex items-center gap-3 px-4 py-3', entry.highlight ? 'bg-violet-50' : ''].join(' ')}
              >
                <span className="w-8 text-sm font-bold text-[var(--sw-orange)]">
                  {entry.rank === 1 ? '🥇' : entry.rank}
                </span>
                <AvatarImage name={entry.name} size={72} className="h-9 w-9" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-[var(--sw-text-strong)]">{entry.name}</div>
                  <div className="text-xs text-[var(--sw-muted)]">{entry.xp}</div>
                </div>
                {entry.change ? <span className="text-xs font-semibold text-emerald-600">↑ {entry.change}</span> : null}
              </div>
            ))}
          </div>
        </section>

        {challenge ? (
          <section className="relative mt-6 min-h-[140px] overflow-hidden rounded-2xl p-5 text-white">
            <CoverImage src={imageForChallenge()} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-violet-950/90 to-indigo-900/75" />
            <div className="relative flex items-end justify-between gap-4">
              <div>
                <span className="rounded-full bg-emerald-400 px-2 py-0.5 text-[10px] font-bold text-black">DAILY CHALLENGE</span>
                <h3 className="mt-2 text-xl font-bold">{challenge.title}</h3>
                <p className="mt-1 text-sm text-white/70">+{challenge.reward} XP Reward</p>
              </div>
              <button type="button" className="shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-violet-700">
                Accept
              </button>
            </div>
          </section>
        ) : null}
      </main>
    </>
  )
}
