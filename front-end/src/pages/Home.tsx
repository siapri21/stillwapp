import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { apiGet } from '../api/request.ts'
import type { ApiFeedPost, ApiSkill, ApiUser } from '../api/types.ts'
import { userFullName } from '../api/types.ts'
import { useAuth } from '../context/AuthContext.tsx'
import { navTarget } from '../config/nav.ts'
import { CampusNewsCard, type CampusNewsItem } from '../ui/CampusNewsCard.tsx'
import { CampusLifeSection } from '../ui/CampusLifeSection.tsx'
import { CommunityCounter, type CommunityStats } from '../ui/CommunityCounter.tsx'
import { CoverImage } from '../ui/CoverImage.tsx'
import { PageMain } from '../ui/PageMain.tsx'
import { PeerCard } from '../ui/PeerCard.tsx'
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

const DEFAULT_STATS: CommunityStats = { students: 247, skills: 38, radiusKm: 2 }

export function Home() {
  const { isAuthenticated } = useAuth()
  const [skills, setSkills] = useState<ApiSkill[]>([])
  const [peers, setPeers] = useState<Peer[]>([])
  const [news, setNews] = useState<CampusNewsItem[]>([])
  const [communityStats, setCommunityStats] = useState<CommunityStats>(DEFAULT_STATS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiGet<ApiSkill[]>('/skills'),
      apiGet<ApiUser[]>('/users'),
      apiGet<ApiFeedPost[]>('/feed'),
      apiGet<CommunityStats>('/communityStats'),
    ])
      .then(([skillsData, usersData, feedData, statsData]) => {
        setCommunityStats(statsData)

        const topSkills = [...skillsData]
          .sort((a, b) => (b.swapCount ?? b.swaps ?? 0) - (a.swapCount ?? a.swaps ?? 0))
          .slice(0, 6)
        setSkills(topSkills)

        const nearbyPeers = usersData
          .filter((u) => u.id !== 1)
          .slice(0, 6)
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

        const mappedNews = feedData.slice(0, 3).map((post) => {
          const user = usersData.find((u) => u.id === post.userId)
          return {
            id: post.id,
            author: user ? userFullName(user) : 'Étudiant',
            skill: post.skill,
            with: post.partner,
            time: post.time,
            validated: post.validated,
            category: post.category ?? undefined,
            likes: post.likes,
            comments: post.comments,
            quote: post.quote,
            image: post.image,
          }
        })
        setNews(mappedNews)
      })
      .catch(() => {
        setCommunityStats(DEFAULT_STATS)
      })
      .finally(() => setLoading(false))
  }, [])

  const feedLink = navTarget({ to: '/feed', label: 'Fil', requiresAuth: true }, isAuthenticated)
  const matchingLink = '/matching'

  return (
    <>
      <PageMain className="pt-2 md:pt-6">
        <section className="relative overflow-hidden rounded-3xl p-6 text-white shadow-[0_18px_40px_rgba(0,0,0,0.12)] md:p-10 lg:p-12">
          <CoverImage src={imageForHero(1200, 400)} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(230,0,126,0.85),rgba(255,122,55,0.8))]" />
          <div className="relative max-w-2xl">
            <h1 className="text-balance font-display text-3xl leading-tight md:text-5xl lg:text-6xl">
              Prêt à troquer tes talents&nbsp;?
            </h1>
            <p className="mt-3 max-w-lg text-sm text-white/90 md:text-base">
              Trouve un pair sur le campus, échange une compétence contre une autre, simple et gratuit.
            </p>
            <SearchBar className="mt-6 max-w-xl" placeholder="Trouver une compétence…" />
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/explore"
                className="rounded-xl bg-[var(--sw-yellow)] px-5 py-2.5 text-sm font-bold text-black shadow-sm hover:brightness-95"
              >
                Explorer les cours
              </Link>
              {isAuthenticated ? (
                <Link
                  to={matchingLink}
                  className="rounded-xl bg-white/20 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/40 hover:bg-white/30"
                >
                  Voir les matchs
                </Link>
              ) : null}
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-xl text-[var(--sw-text-strong)] md:text-2xl">Top du moment</h2>
            <Link to="/explore" className="shrink-0 text-sm font-semibold text-[var(--sw-pink)] hover:underline">
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
                  className="min-w-[280px] shrink-0 snap-start md:min-w-[300px]"
                />
              ))}
            </SkillCarousel>
          )}
        </section>

        <section className="mt-10">
          {loading ? (
            <p className="text-sm text-[var(--sw-muted)]">Chargement…</p>
          ) : isAuthenticated ? (
            <>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl text-[var(--sw-text-strong)] md:text-2xl">Tes pairs à proximité</h2>
                  <p className="mt-1 text-sm text-[var(--sw-muted)]">Des profils près de toi, prêts à échanger</p>
                </div>
                <Button asChild variant="link" className="h-auto p-0 text-[var(--sw-pink)]">
                  <Link to={matchingLink}>Voir tout</Link>
                </Button>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {peers.map((peer) => (
                  <PeerCard key={peer.id} {...peer} />
                ))}
              </div>
            </>
          ) : (
            <CommunityCounter stats={communityStats} />
          )}
        </section>

        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-xl text-[var(--sw-text-strong)] md:text-2xl">Actus sur le campus</h2>
              <p className="mt-1 text-sm text-[var(--sw-muted)]">Ce que tes pairs apprennent en ce moment</p>
            </div>
            <Button asChild variant="link" className="h-auto p-0 text-[var(--sw-pink)]">
              <Link to={feedLink}>Voir tout le fil</Link>
            </Button>
          </div>

          {loading ? (
            <p className="mt-4 text-sm text-[var(--sw-muted)]">Chargement…</p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((post) => (
                <CampusNewsCard key={post.id} post={post} feedHref={feedLink} />
              ))}
            </div>
          )}
        </section>

        {/* Vie sur le campus — après les actus */}
        <CampusLifeSection />
      </PageMain>
    </>
  )
}
