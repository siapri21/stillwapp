import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MessageCircle, X, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { apiGet } from '../api/request.ts'
import type { ApiMatch, ApiUser } from '../api/types.ts'
import { userFullName } from '../api/types.ts'
import { AvatarImage } from '../ui/AvatarImage.tsx'
import { CoverImage } from '../ui/CoverImage.tsx'
import { PageMain } from '../ui/PageMain.tsx'
import { useAuth } from '../context/AuthContext.tsx'
import { markMatchPassed, readPassedMatchIds } from '../utils/matchDeck.ts'
import { unsplashUrl } from '../utils/images.ts'

type MatchView = {
  id: number
  userId: number
  name: string
  location: string
  distance: string
  matchPercent: number
  hasSkill: string
  wantsSkill: string
}

function MatchCard({
  match,
  onPass,
  onContact,
  swiping,
}: {
  match: MatchView
  onPass: () => void
  onContact: () => void
  swiping: boolean
}) {
  const highMatch = match.matchPercent >= 85

  return (
    <article className="overflow-hidden rounded-3xl bg-white shadow-[0_12px_40px_rgba(25,22,36,0.08)] ring-1 ring-black/5">
      <div className="relative h-28">
        <CoverImage
          src={unsplashUrl(match.hasSkill, 600, 160)}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        <span
          className={[
            'absolute right-4 top-4 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold',
            highMatch ? 'bg-emerald-400 text-black' : 'bg-white/90 text-[var(--sw-text-strong)]',
          ].join(' ')}
        >
          <Zap className="h-3.5 w-3.5" aria-hidden />
          {match.matchPercent}%
        </span>
      </div>

      <div className="-mt-10 px-5 pb-5">
        <AvatarImage
          name={match.name}
          size={128}
          rounded="2xl"
          className="mx-auto h-20 w-20 ring-4 ring-white shadow-md"
        />
        <div className="mt-3 text-center">
          <h2 className="font-display text-xl text-[var(--sw-text-strong)]">{match.name}</h2>
          <p className="mt-1 text-xs text-[var(--sw-muted)]">
            {match.location}, {match.distance}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="overflow-hidden rounded-2xl bg-violet-50/80 ring-1 ring-violet-100">
            <CoverImage src={unsplashUrl(match.hasSkill, 240, 100)} className="h-16 w-full object-cover" />
            <div className="p-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-violet-600">Propose</p>
              <p className="mt-0.5 text-sm font-semibold text-[var(--sw-text-strong)]">{match.hasSkill}</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl bg-pink-50/80 ring-1 ring-pink-100">
            <CoverImage src={unsplashUrl(match.wantsSkill, 240, 100)} className="h-16 w-full object-cover" />
            <div className="p-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--sw-pink)]">Recherche</p>
              <p className="mt-0.5 text-sm font-semibold text-[var(--sw-text-strong)]">{match.wantsSkill}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={onPass}
            disabled={swiping}
          >
            <X className="h-4 w-4" aria-hidden />
            Passer
          </Button>
          <Button
            type="button"
            size="lg"
            className="flex-[1.4]"
            onClick={onContact}
            disabled={swiping}
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Contacter
          </Button>
        </div>
      </div>
    </article>
  )
}

export function Matching() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const meId = currentUser?.id ?? 1
  const [deck, setDeck] = useState<MatchView[]>([])
  const [convByPartner, setConvByPartner] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(true)
  const [exitingId, setExitingId] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    const passedIds = new Set(readPassedMatchIds())

    Promise.all([
      apiGet<ApiMatch[]>('/matches'),
      apiGet<ApiUser[]>('/users'),
      apiGet<{ id: number; participantIds: number[] }[]>('/conversations').catch(() => []),
    ])
      .then(([matchesData, usersData, convData]) => {
        if (cancelled) return
        const users = Array.isArray(usersData) ? usersData : []
        const mapped = matchesData
          .map((match) => {
            const user = users.find((u) => Number(u.id) === Number(match.userId))
            return {
              id: match.id,
              userId: Number(match.userId),
              name: user ? userFullName(user) : 'Étudiant',
              location: match.location,
              distance: match.distance,
              matchPercent: match.matchPercent,
              hasSkill: match.hasSkill,
              wantsSkill: match.wantsSkill,
            }
          })
          .filter((m) => !passedIds.has(m.id))

        const partnerConvs: Record<number, number> = {}
        for (const conv of Array.isArray(convData) ? convData : []) {
          const partner = conv.participantIds.map(Number).find((id) => id !== meId)
          if (partner != null) partnerConvs[partner] = conv.id
        }

        setConvByPartner(partnerConvs)
        setDeck(mapped)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const current = deck[0]
  const remaining = deck.length

  const pass = () => {
    if (!current || exitingId != null) return
    const passedId = current.id
    markMatchPassed(passedId)
    setExitingId(passedId)
    window.setTimeout(() => {
      setDeck((prev) => prev.filter((m) => m.id !== passedId))
      setExitingId(null)
    }, 220)
  }

  const contact = () => {
    if (!current) return
    const convId = convByPartner[current.userId]
    if (convId) {
      navigate(`/messages/${convId}`)
      return
    }
    navigate(`/messages?partner=${current.userId}`)
  }

  return (
    <PageMain className="pt-2 md:pt-4">
      <div className="mx-auto max-w-lg lg:max-w-xl">
        <header className="text-center lg:text-left">
          <h1 className="font-display text-3xl text-[var(--sw-text-strong)] md:text-4xl">Matchs parfaits</h1>
          <p className="mt-1 text-sm text-[var(--sw-muted)]">
            Des étudiants près de toi qui veulent ce que tu proposes.
          </p>
        </header>

        <div className="mt-8">
          {loading ? (
            <p className="text-center text-sm text-[var(--sw-muted)]">Chargement…</p>
          ) : !current ? (
            <div className="rounded-3xl bg-white px-8 py-12 text-center shadow-sm ring-1 ring-black/5">
              <p className="font-display text-xl text-[var(--sw-text-strong)]">Plus de matchs pour aujourd&apos;hui</p>
              <p className="mt-2 text-sm text-[var(--sw-muted)]">
                Reviens demain ou explore les compétences du campus.
              </p>
              <Button asChild className="mt-6" variant="link">
                <Link to="/explore">Explorer les cours</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative w-full">
                {deck[1] ? (
                  <div
                    className="pointer-events-none absolute inset-x-3 top-3 -z-10 h-[calc(100%-8px)] rounded-3xl bg-white shadow-sm ring-1 ring-black/5"
                    style={{ transform: 'scale(0.97) translateY(8px)', opacity: 0.35 }}
                    aria-hidden
                  />
                ) : null}

                <div
                  key={current.id}
                  className={[
                    'relative transition duration-200 ease-out',
                    exitingId === current.id
                      ? '-translate-x-[110%] rotate-[-8deg] opacity-0'
                      : 'translate-x-0 rotate-0 opacity-100',
                  ].join(' ')}
                >
                  <MatchCard
                    match={current}
                    onPass={pass}
                    onContact={contact}
                    swiping={exitingId === current.id}
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col items-center gap-3">
                <div className="flex gap-1.5" aria-hidden>
                  {deck.slice(0, Math.min(remaining, 8)).map((m) => (
                    <span
                      key={m.id}
                      className={[
                        'h-1.5 rounded-full transition-all',
                        m.id === current.id ? 'w-6 bg-[var(--sw-pink)]' : 'w-1.5 bg-black/15',
                      ].join(' ')}
                    />
                  ))}
                </div>
                <p className="text-xs text-[var(--sw-muted)]">
                  {remaining} profil{remaining !== 1 ? 's' : ''} restant{remaining !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageMain>
  )
}
