import { Link } from 'react-router-dom'
import { AvatarImage } from '../ui/AvatarImage.tsx'
import { CoverImage } from '../ui/CoverImage.tsx'
import { imageForBadge, imageForChallenge } from '../utils/images.ts'

const leaderboard = [
  { rank: 12, name: 'You', xp: '2,450 XP', highlight: true, change: '+2' },
  { rank: 1, name: 'Luna Storm', xp: '12,890 XP', medal: true },
  { rank: 2, name: 'Kai Jensen', xp: '11,240 XP' },
  { rank: 3, name: 'Aria Vane', xp: '9,800 XP' },
]

export function Dashboard() {
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
              <div className="text-3xl font-extrabold text-[var(--sw-pink)]">Level 14</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-[var(--sw-orange)]">Total Points</div>
              <div className="text-2xl font-extrabold text-[var(--sw-text-strong)]">2,450 UP</div>
            </div>
          </div>
          <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            🔥 12 Day Streak
          </div>
          <div className="mt-4 flex items-center justify-between text-xs font-semibold">
            <span className="text-[var(--sw-muted)]">Next Level: 3,000 XP</span>
            <span className="text-[var(--sw-pink)]">82%</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-neutral-100">
            <div className="h-full w-[82%] rounded-full bg-emerald-500" />
          </div>
        </section>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
            <CoverImage src={imageForBadge('teamwork', 200)} className="h-16 w-full object-cover" />
            <div className="p-4 pt-3">
              <div className="text-sm font-semibold text-[var(--sw-text-strong)]">Swaps</div>
              <div className="text-xs text-[var(--sw-muted)]">24 Total</div>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
            <CoverImage src={imageForBadge('success', 200)} className="h-16 w-full object-cover" />
            <div className="p-4 pt-3">
              <div className="text-sm font-semibold text-[var(--sw-text-strong)]">Rating</div>
              <div className="text-xs text-[var(--sw-muted)]">4.9 / 5.0</div>
            </div>
          </div>
        </div>

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--sw-text-strong)]">Unlocked Badges</h2>
            <button type="button" className="text-sm font-semibold text-[var(--sw-pink)]">View All</button>
          </div>
          <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
            {[
              { label: 'First Swap', keyword: 'celebration' },
              { label: 'Skill Guru', keyword: 'coding' },
              { label: '7 Day Hero', keyword: 'fitness' },
            ].map((b) => (
              <div key={b.label} className="flex shrink-0 flex-col items-center gap-2">
                <div className="h-16 w-16 overflow-hidden rounded-full ring-4 ring-[var(--sw-pink)]/20">
                  <CoverImage src={imageForBadge(b.keyword, 128)} className="h-full w-full object-cover" />
                </div>
                <span className="text-xs font-semibold text-[var(--sw-muted)]">{b.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-semibold text-[var(--sw-text-strong)]">Top Swappers</h2>
          <div className="mt-3 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
            {leaderboard.map((entry) => (
              <div
                key={entry.name}
                className={[
                  'flex items-center gap-3 px-4 py-3',
                  entry.highlight ? 'bg-violet-50' : '',
                ].join(' ')}
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
            <button type="button" className="w-full py-3 text-sm font-semibold text-[var(--sw-orange)]">
              See Full Leaderboard
            </button>
          </div>
        </section>

        <section className="relative mt-6 min-h-[140px] overflow-hidden rounded-2xl p-5 text-white">
          <CoverImage src={imageForChallenge()} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-violet-950/90 to-indigo-900/75" />
          <div className="relative flex items-end justify-between gap-4">
            <div>
              <span className="rounded-full bg-emerald-400 px-2 py-0.5 text-[10px] font-bold text-black">DAILY CHALLENGE</span>
              <h3 className="mt-2 text-xl font-bold">Host a 30m Session</h3>
              <p className="mt-1 text-sm text-white/70">+500 XP Reward</p>
            </div>
            <button type="button" className="shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-violet-700">
              Accept
            </button>
          </div>
        </section>
      </main>
    </>
  )
}
