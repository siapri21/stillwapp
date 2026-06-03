import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BASE_URL } from '../api/config.js'
import type { ApiSkill, ApiUser } from '../api/types.ts'
import { userFullName } from '../api/types.ts'
import { CoverImage } from '../ui/CoverImage.tsx'
import { NotificationLink } from '../ui/NotificationLink.tsx'
import { PageMain } from '../ui/PageMain.tsx'
import { PeerRow } from '../ui/PeerRow.tsx'
import { SearchBar } from '../ui/SearchBar.tsx'
import { SkillCard } from '../ui/SkillCard.tsx'
import { SkillCarousel } from '../ui/SkillCarousel.tsx'
import { imageForHero } from '../utils/images.ts'

type Peer = {
  id: string
  name: string
  offer: string
  distance: string
  place: string
  rating: number
  online?: boolean
}

export function Home() {
  const [skills, setSkills] = useState<ApiSkill[]>([])
  const [peers, setPeers] = useState<Peer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${BASE_URL}/skills`).then((res) => res.json() as Promise<ApiSkill[]>),
      fetch(`${BASE_URL}/users`).then((res) => res.json() as Promise<ApiUser[]>),
    ])
      .then(([skillsData, usersData]) => {
        const topSkills = [...skillsData]
          .sort((a, b) => (b.swapCount ?? b.swaps ?? 0) - (a.swapCount ?? a.swaps ?? 0))
          .slice(0, 6)
        setSkills(topSkills)

        const nearbyPeers = usersData
          .filter((u) => u.id !== 1)
          .slice(0, 3)
          .map((user) => {
            const offer = skillsData.find((s) => s.userId === user.id)?.title ?? 'Compétence'
            return {
              id: String(user.id),
              name: userFullName(user),
              offer,
              distance: user.distance,
              place: user.location,
              rating: user.rating,
              online: user.online,
            }
          })
        setPeers(nearbyPeers)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--sw-bg)]/90 backdrop-blur supports-[backdrop-filter]:bg-[var(--sw-bg)]/70 lg:hidden">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
          <img src="/logoskillwapp.png" alt="SkillWapp" className="h-10 w-12" />
          <div className="ml-auto flex items-center gap-2">
            <NotificationLink />
            <Link
              to="/search"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--sw-text-strong)] hover:bg-black/5 active:bg-black/10"
              aria-label="Recherche"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="2" />
                <path d="M21 21l-4.2-4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <PageMain className="md:pt-6">
        <div className="lg:grid lg:grid-cols-[1.2fr_1fr] lg:gap-8">
          <section className="relative overflow-hidden rounded-3xl p-5 text-white shadow-[0_18px_40px_rgba(0,0,0,0.12)] md:p-7">
            <CoverImage src={imageForHero(900, 360)} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(230,0,126,0.82),rgba(255,122,55,0.78))]" />
            <div className="relative">
              <h1 className="text-balance font-display text-2xl leading-tight md:text-4xl lg:text-5xl">
                Prêt à troquer tes talents&nbsp;?
              </h1>
              <SearchBar className="mt-4 md:mt-5 md:max-w-xl" placeholder="Trouver une compétence…" />
            </div>
          </section>

          <section className="mt-7 lg:mt-0">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-lg text-[var(--sw-text-strong)] md:text-xl">Tes pairs à proximité</h2>
              <Link to="/matching" className="text-sm font-semibold text-[var(--sw-pink)] hover:underline">
                Voir tout
              </Link>
            </div>
            <div className="mt-4 rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
              {loading ? (
                <p className="px-4 py-6 text-sm text-[var(--sw-muted)]">Chargement…</p>
              ) : (
                peers.map((peer, i) => (
                  <div key={peer.id}>
                    {i > 0 ? <div className="h-px bg-black/5" /> : null}
                    <PeerRow {...peer} />
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <section className="mt-7">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-lg text-[var(--sw-text-strong)] md:text-xl">Top du moment</h2>
            <Link to="/explore" className="text-sm font-semibold text-[var(--sw-pink)] hover:underline">
              Voir tout
            </Link>
          </div>

          {loading ? (
            <p className="mt-4 text-sm text-[var(--sw-muted)]">Chargement…</p>
          ) : (
            <SkillCarousel>
              {skills.map((skill) => (
                <SkillCard
                  key={skill.id}
                  id={skill.id}
                  tag={skill.category}
                  title={skill.title}
                  subtitle={skill.description.slice(0, 60) + (skill.description.length > 60 ? '…' : '')}
                  rating={skill.rating}
                  image={skill.image}
                  className="min-w-[280px] shrink-0 snap-start md:min-w-[300px] lg:min-w-[320px]"
                />
              ))}
            </SkillCarousel>
          )}
        </section>
      </PageMain>
    </>
  )
}
