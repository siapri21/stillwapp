import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiGet, apiTryGet } from '../api/request.ts'
import type { ApiSkill, ApiUser, ApiUserWish } from '../api/types.ts'
import { userFullName } from '../api/types.ts'
import { AvatarImage } from '../ui/AvatarImage.tsx'
import { CoverImage } from '../ui/CoverImage.tsx'
import { PageMain } from '../ui/PageMain.tsx'
import { allLevelBadges } from '../utils/levelBadge.ts'

export function UserProfile() {
  const { userId } = useParams()
  const id = Number(userId)
  const [user, setUser] = useState<ApiUser | null>(null)
  const [skills, setSkills] = useState<ApiSkill[]>([])
  const [wishes, setWishes] = useState<string[]>([])
  const [conversationId, setConversationId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id || Number.isNaN(id)) return

    let cancelled = false
    setLoading(true)
    setUser(null)

    const load = async () => {
      try {
        const userData =
          (await apiTryGet<ApiUser>(`/users/${id}`)) ??
          (await apiGet<ApiUser[]>('/users')).find((u) => Number(u.id) === id) ??
          null

        if (cancelled) return
        if (!userData) {
          setUser(null)
          return
        }
        setUser(userData)

        const [skillsData, wishesData, convData] = await Promise.all([
          apiGet<ApiSkill[]>('/skills').catch(() => [] as ApiSkill[]),
          apiGet<ApiUserWish[]>('/userWishes').catch(() => [] as ApiUserWish[]),
          apiGet<{ id: number; participantIds: number[] }[]>('/conversations').catch(
            () => [] as { id: number; participantIds: number[] }[],
          ),
        ])

        if (cancelled) return

        setSkills(skillsData.filter((s) => Number(s.userId) === id))

        const wishEntry = wishesData.find((w) => Number(w.userId) === id)
        setWishes(wishEntry?.skills ?? [])

        const conv = convData.find(
          (c) =>
            c.participantIds.map(Number).includes(id) &&
            c.participantIds.map(Number).includes(1),
        )
        setConversationId(conv?.id ?? null)
      } catch {
        if (!cancelled) setUser(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [id])

  const reviews = useMemo(() => {
    return skills.flatMap((skill) =>
      (skill.reviews ?? []).map((r) => ({
        skill: skill.title,
        author: r.author,
        rating: r.rating,
        comment: r.comment,
      })),
    )
  }, [skills])

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[var(--sw-bg)]">
        <p className="text-sm text-[var(--sw-muted)]">Chargement…</p>
      </div>
    )
  }

  if (!user) {
    return (
      <PageMain>
        <p className="text-sm text-[var(--sw-muted)]">Profil introuvable.</p>
        <Link to="/" className="mt-4 inline-block text-sm font-semibold text-[var(--sw-pink)]">
          Retour à l&apos;accueil
        </Link>
      </PageMain>
    )
  }

  const fullName = userFullName(user)
  const levelBadges = allLevelBadges(user.swaps, user.rating)
  const messageTo = conversationId ? `/messages/${conversationId}` : '/messages'

  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--sw-bg)]/90 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/matching" className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5" aria-label="Retour">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <h1 className="flex-1 truncate text-center font-display text-lg text-[var(--sw-text-strong)]">{fullName}</h1>
          <div className="h-10 w-10" />
        </div>
      </header>

      <PageMain className="pt-2 lg:pt-4">
        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 lg:p-7">
          <div className="flex flex-col items-center lg:flex-row lg:items-start lg:gap-8">
            <div className="relative shrink-0">
              <AvatarImage name={fullName} size={224} className="h-24 w-24 ring-4 ring-white lg:h-32 lg:w-32" />
              {user.online ? (
                <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-white" />
              ) : null}
            </div>
            <div className="mt-4 w-full text-center lg:mt-0 lg:text-left">
              <h1 className="font-display text-2xl text-[var(--sw-text-strong)] lg:text-4xl">{fullName}</h1>
              <p className="mt-1 text-sm text-[var(--sw-muted)]">{user.university}</p>
              <p className="mt-2 text-sm text-[var(--sw-muted)]">
                {user.location}
                {user.distance ? `, ${user.distance}` : ''}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-4 lg:justify-start">
                <Stat label="Note" value={`${user.rating.toFixed(1)} ★`} />
                <Stat label="Échanges" value={String(user.swaps)} />
                <Stat label="Amis" value={String(user.friends)} />
              </div>
              <Link
                to={messageTo}
                className="mt-5 inline-flex rounded-2xl bg-[var(--sw-pink)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-95"
              >
                Envoyer un message
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="font-display text-lg text-[var(--sw-text-strong)]">Badges de niveau</h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {levelBadges.map((b) => (
              <div
                key={b.tier}
                className={[
                  'rounded-2xl p-4 ring-1 transition',
                  b.active ? 'bg-white shadow-md ring-[var(--sw-pink)]/30' : 'bg-white/60 opacity-70 ring-black/5',
                ].join(' ')}
              >
                <div className="text-2xl">{b.emoji}</div>
                <div className="mt-2 font-display text-sm text-[var(--sw-text-strong)]">{b.label}</div>
                <p className="mt-1 text-xs text-[var(--sw-muted)]">{b.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-6 lg:grid lg:grid-cols-2 lg:gap-8">
          <section>
            <h2 className="font-display text-lg text-[var(--sw-text-strong)]">Talents proposés</h2>
            <div className="mt-4 flex flex-col gap-4">
              {skills.length === 0 ? (
                <p className="text-sm text-[var(--sw-muted)]">Aucun talent publié.</p>
              ) : (
                skills.map((skill) => (
                  <Link
                    key={skill.id}
                    to={`/explore/${skill.id}`}
                    className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                      <CoverImage src={skill.image} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[var(--sw-text-strong)]">{skill.title}</div>
                      <div className="mt-0.5 text-xs text-[var(--sw-pink)]">{skill.category}</div>
                      <div className="mt-1 text-xs text-[var(--sw-muted)]">{skill.duration}</div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>

          <section>
            <h2 className="font-display text-lg text-[var(--sw-text-strong)]">Souhaits</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {wishes.length === 0 ? (
                <p className="text-sm text-[var(--sw-muted)]">Aucun souhait renseigné.</p>
              ) : (
                wishes.map((w) => (
                  <span
                    key={w}
                    className="rounded-full bg-[var(--sw-orange)]/15 px-4 py-2 text-sm font-semibold text-[var(--sw-orange)]"
                  >
                    {w}
                  </span>
                ))
              )}
            </div>

            <h2 className="mt-8 font-display text-lg text-[var(--sw-text-strong)]">Avis reçus</h2>
            <div className="mt-4 flex flex-col gap-3">
              {reviews.length === 0 ? (
                <p className="text-sm text-[var(--sw-muted)]">Pas encore d&apos;avis.</p>
              ) : (
                reviews.map((r, i) => (
                  <article key={`${r.author}-${i}`} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-[var(--sw-text-strong)]">{r.author}</span>
                      <span className="text-sm text-[var(--sw-orange)]">{'★'.repeat(Math.round(r.rating))}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-[var(--sw-pink)]">{r.skill}</p>
                    <p className="mt-2 text-sm text-[var(--sw-muted)]">{r.comment}</p>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </PageMain>
    </>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-lg font-bold text-[var(--sw-text-strong)]">{value}</div>
      <div className="text-xs text-[var(--sw-muted)]">{label}</div>
    </div>
  )
}
