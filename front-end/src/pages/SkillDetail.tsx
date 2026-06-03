import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiGet } from '../api/request.ts'
import type { ApiSkill, ApiUser } from '../api/types.ts'
import { userFullName } from '../api/types.ts'
import { Modal } from '../ui/Modal.tsx'
import { AvatarImage } from '../ui/AvatarImage.tsx'
import { CoverImage } from '../ui/CoverImage.tsx'

const tagTints = [
  'bg-emerald-100 text-emerald-700',
  'bg-violet-100 text-violet-700',
  'bg-sky-100 text-sky-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
] as const

export function SkillDetail() {
  const { id } = useParams<{ id: string }>()
  const [skill, setSkill] = useState<ApiSkill | null>(null)
  const [author, setAuthor] = useState<ApiUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [swapOpen, setSwapOpen] = useState(false)
  const [swapSent, setSwapSent] = useState(false)
  const [message, setMessage] = useState('')
  const [datetime, setDatetime] = useState('')

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    apiGet<ApiSkill>(`/skills/${id}`)
      .then((skillData) => {
        setSkill(skillData)
        return apiGet<ApiUser>(`/users/${skillData.userId}`)
      })
      .then(setAuthor)
      .catch(() => {
        setSkill(null)
        setAuthor(null)
      })
      .finally(() => setLoading(false))
  }, [id])

  const authorName = author ? userFullName(author) : 'Anonyme'
  const authorRating = author?.rating ?? skill?.rating ?? 0
  const swapCount = skill?.swapCount ?? skill?.swaps ?? 0

  const openSwapModal = () => {
    if (!skill) return
    setMessage(
      `Salut ${author?.name ?? ''} ! J'aimerais échanger avec toi pour « ${skill.title} ». Je propose une session de 1h contre 1h. Dis-moi si ça te convient !`,
    )
    setDatetime('')
    setSwapSent(false)
    setSwapOpen(true)
  }

  const handleSendSwap = () => {
    setSwapSent(true)
    window.setTimeout(() => {
      setSwapOpen(false)
      setSwapSent(false)
    }, 1800)
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[var(--sw-bg)]">
        <p className="text-sm text-[var(--sw-muted)]">Chargement…</p>
      </div>
    )
  }

  if (!skill) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[var(--sw-bg)] px-4">
        <p className="text-lg font-semibold text-[var(--sw-text-strong)]">Compétence introuvable</p>
        <Link to="/explore" className="text-sm font-semibold text-[var(--sw-pink)] hover:underline">
          Retour à Explorer
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-[var(--sw-bg)] pb-28 text-[var(--sw-text)] lg:px-[10%]">
      <div className="relative h-56 w-full overflow-hidden md:h-72">
        <CoverImage src={skill.image} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/20" />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3 md:px-6">
          <Link
            to="/explore"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[var(--sw-text-strong)] shadow-sm backdrop-blur-sm"
            aria-label="Retour"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          <button
            type="button"
            onClick={() => setLiked((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[var(--sw-pink)] shadow-sm backdrop-blur-sm"
            aria-label={liked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} aria-hidden="true">
              <path
                d="M12 21s-7-4.4-9.5-8.5C.5 9.5 2.5 5 6.5 5c2 0 3.5 1.2 4.5 2.8C12 6.2 13.5 5 15.5 5 19.5 5 21.5 9.5 21.5 12.5 19 16.6 12 21 12 21Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <span className="absolute bottom-4 left-4 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
          {skill.category}
        </span>
      </div>

      <main className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:max-w-none lg:px-0">
        <div className="-mt-6 relative z-10 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-black/5">
          <div className="flex items-center gap-3">
            <AvatarImage name={authorName} size={96} className="h-12 w-12 shrink-0" />
            <div className="min-w-0 text-left">
              <div className="truncate text-sm font-semibold text-[var(--sw-text-strong)]">{authorName}</div>
              {author ? <div className="truncate text-xs text-[var(--sw-muted)]">{author.university}</div> : null}
              <div className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <span>★</span>
                {authorRating.toFixed(1)}
                <span className="font-normal text-[var(--sw-muted)]">· {swapCount} swaps</span>
              </div>
            </div>
          </div>
        </div>

        <h1 className="mt-5 text-2xl font-semibold text-[var(--sw-text-strong)] md:text-3xl">{skill.title}</h1>

        <p className="mt-4 rounded-2xl bg-white p-4 text-sm leading-relaxed text-[var(--sw-muted)] shadow-sm ring-1 ring-black/5">
          {skill.description}
        </p>

        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-wide text-[var(--sw-muted)]">Ce que tu vas apprendre</h2>
          <div className="mt-3 flex flex-col gap-3">
            {skill.tags.map((tag, i) => (
              <div key={tag} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
                <span className={`inline-flex rounded-xl px-3 py-1.5 text-xs font-semibold ${tagTints[i % tagTints.length]}`}>
                  {tag}
                </span>
                {skill.learnings[i] ? (
                  <p className="mt-2 text-sm text-[var(--sw-muted)]">{skill.learnings[i]}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-wide text-[var(--sw-muted)]">Derniers retours</h2>
          <div className="mt-3 -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
            {skill.reviews.length === 0 ? (
              <p className="text-sm text-[var(--sw-muted)]">Aucun avis pour le moment.</p>
            ) : (
              skill.reviews.map((review, i) => (
                <article
                  key={`${review.author}-${i}`}
                  className="min-w-[260px] shrink-0 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-[var(--sw-text-strong)]">{review.author}</div>
                    <div className="text-xs font-semibold text-emerald-600">★ {review.rating.toFixed(1)}</div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--sw-muted)]">{review.comment}</p>
                </article>
              ))
            )}
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/10 bg-white/95 p-4 backdrop-blur lg:px-[10%]">
        <div className="mx-auto w-full max-w-6xl lg:max-w-none">
          <button
            type="button"
            onClick={openSwapModal}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--sw-pink)] px-6 py-4 text-base font-semibold text-white shadow-[0_12px_32px_rgba(230,0,126,0.35)] hover:brightness-95 active:brightness-90"
          >
            Proposer un Swap
          </button>
        </div>
      </div>

      <Modal open={swapOpen} onClose={() => setSwapOpen(false)} title="Proposer un Swap">
        {swapSent ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-2xl">✓</div>
            <p className="text-base font-semibold text-[var(--sw-text-strong)]">Swap proposé !</p>
            <p className="text-sm text-[var(--sw-muted)]">{authorName} recevra ta proposition.</p>
          </div>
        ) : (
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              handleSendSwap()
            }}
          >
            <div>
              <label htmlFor="swap-message" className="text-xs font-semibold uppercase tracking-wide text-[var(--sw-muted)]">
                Message
              </label>
              <textarea
                id="swap-message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-2 w-full resize-none rounded-2xl bg-[var(--sw-bg)] p-3 text-sm text-[var(--sw-text-strong)] outline-none ring-1 ring-black/5 focus:ring-[var(--sw-pink)]"
              />
            </div>
            <div>
              <label htmlFor="swap-datetime" className="text-xs font-semibold uppercase tracking-wide text-[var(--sw-muted)]">
                Date et heure
              </label>
              <input
                id="swap-datetime"
                type="datetime-local"
                value={datetime}
                onChange={(e) => setDatetime(e.target.value)}
                className="mt-2 w-full rounded-2xl bg-[var(--sw-bg)] p-3 text-sm text-[var(--sw-text-strong)] outline-none ring-1 ring-black/5 focus:ring-[var(--sw-pink)]"
              />
            </div>
            <button
              type="submit"
              className="rounded-2xl bg-[var(--sw-pink)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-95"
            >
              Envoyer
            </button>
          </form>
        )}
      </Modal>
    </div>
  )
}
