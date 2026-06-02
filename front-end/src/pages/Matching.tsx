import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BASE_URL } from '../api/config.js'
import type { ApiMatch, ApiUser } from '../api/types.ts'
import { userFullName } from '../api/types.ts'
import { AvatarImage } from '../ui/AvatarImage.tsx'
import { CoverImage } from '../ui/CoverImage.tsx'
import { unsplashUrl } from '../utils/images.ts'

type MatchView = {
  id: number
  name: string
  location: string
  distance: string
  matchPercent: number
  hasSkill: string
  wantsSkill: string
}

export function Matching() {
  const [matches, setMatches] = useState<MatchView[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${BASE_URL}/matches`).then((res) => res.json() as Promise<ApiMatch[]>),
      fetch(`${BASE_URL}/users`).then((res) => res.json() as Promise<ApiUser[]>),
    ])
      .then(([matchesData, usersData]) => {
        const mapped = matchesData.map((match) => {
          const user = usersData.find((u) => u.id === match.userId)
          return {
            id: match.id,
            name: user ? userFullName(user) : 'Étudiant',
            location: match.location,
            distance: match.distance,
            matchPercent: match.matchPercent,
            hasSkill: match.hasSkill,
            wantsSkill: match.wantsSkill,
          }
        })
        setMatches(mapped)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--sw-bg)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
          <Link to="/" className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5" aria-label="Retour">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <div className="ml-auto text-lg font-bold italic text-[var(--sw-text-strong)]">
            skill<span className="text-[var(--sw-yellow)]">.</span>swap
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-2 md:px-6">
        <h1 className="text-3xl font-semibold text-[var(--sw-text-strong)] md:text-4xl">Perfect Matches</h1>
        <p className="mt-1 text-sm text-[var(--sw-muted)]">Students nearby who want what you have.</p>

        <div className="mt-6 flex flex-col gap-4">
          {loading ? (
            <p className="text-sm text-[var(--sw-muted)]">Chargement…</p>
          ) : (
            matches.map((match) => (
              <article key={match.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
                <div className="flex items-start gap-3">
                  <AvatarImage name={match.name} size={128} rounded="2xl" className="h-16 w-16 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-[var(--sw-text-strong)]">{match.name}</div>
                        <div className="mt-0.5 text-xs text-[var(--sw-muted)]">
                          📍 {match.location} • {match.distance}
                        </div>
                      </div>
                      <span
                        className={[
                          'shrink-0 rounded-full px-2 py-1 text-xs font-bold',
                          match.matchPercent >= 85 ? 'bg-emerald-400 text-black' : 'bg-neutral-200 text-neutral-600',
                        ].join(' ')}
                      >
                        ⚡ {match.matchPercent}%
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="overflow-hidden rounded-xl bg-violet-50">
                        <CoverImage src={unsplashUrl(match.hasSkill, 200, 80)} className="h-12 w-full object-cover" />
                        <div className="p-2">
                          <div className="text-[10px] font-semibold uppercase text-violet-600">Has Skill</div>
                          <div className="mt-0.5 text-sm font-semibold text-[var(--sw-text-strong)]">{match.hasSkill}</div>
                        </div>
                      </div>
                      <div className="overflow-hidden rounded-xl bg-violet-50">
                        <CoverImage src={unsplashUrl(match.wantsSkill, 200, 80)} className="h-12 w-full object-cover" />
                        <div className="p-2">
                          <div className="text-[10px] font-semibold uppercase text-violet-600">Wants Skill</div>
                          <div className="mt-0.5 text-sm font-semibold text-[var(--sw-pink)]">{match.wantsSkill}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-3">
                      <button type="button" className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-semibold text-[var(--sw-muted)]">
                        Pass
                      </button>
                      <button type="button" className="flex-[2] rounded-xl bg-[var(--sw-pink)] py-2.5 text-sm font-semibold text-white">
                        💬 Contact
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
    </>
  )
}
