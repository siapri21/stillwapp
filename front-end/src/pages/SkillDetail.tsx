import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getSkillById } from '../data/mock.ts'
import { Modal } from '../ui/Modal.tsx'
import { AvatarImage } from '../ui/AvatarImage.tsx'
import { CoverImage } from '../ui/CoverImage.tsx'
import { imageForTag } from '../utils/images.ts'

const tintClass = {
  green: 'bg-emerald-100 text-emerald-700',
  purple: 'bg-violet-100 text-violet-700',
  blue: 'bg-sky-100 text-sky-700',
}

export function SkillDetail() {
  const { id } = useParams<{ id: string }>()
  const skill = id ? getSkillById(id) : undefined
  const [swapOpen, setSwapOpen] = useState(false)
  const [swapSent, setSwapSent] = useState(false)
  const [message, setMessage] = useState('')
  const [datetime, setDatetime] = useState('')

  const openSwapModal = () => {
    if (!skill) return
    setMessage(
      `Salut ${skill.author} ! J'aimerais échanger avec toi pour "${skill.title}". Je propose une session de 1h contre 1h. Dis-moi si ça te convient !`,
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
    <div className="min-h-dvh bg-[var(--sw-bg)] pb-28 text-[var(--sw-text)]">
      <div className="relative h-56 w-full overflow-hidden md:h-72">
        <CoverImage
          src={imageForTag(skill.tag, 800, 400)}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3 md:px-6">
          <Link
            to="/explore"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[var(--sw-text-strong)] shadow-sm"
            aria-label="Retour"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <div className="flex gap-2">
            <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm" aria-label="Partager">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <span className="absolute right-4 top-16 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white">
          {skill.category}
        </span>

        <div className="absolute -bottom-8 left-4 rounded-2xl bg-white p-3 shadow-lg ring-1 ring-black/5 md:left-6">
          <div className="flex items-center gap-3">
            <AvatarImage name={skill.author} size={96} className="h-12 w-12" />
            <div className="text-left">
              <div className="text-sm font-semibold text-[var(--sw-pink)]">
                {skill.author}, {skill.authorRole}
              </div>
              <div className="flex items-center gap-1 text-xs text-[var(--sw-muted)]">
                <span className="text-emerald-600">★</span>
                {skill.rating.toFixed(1)} (12 swaps)
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto mt-12 w-full max-w-6xl px-4 md:px-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold text-[var(--sw-text-strong)] md:text-3xl">{skill.title}</h1>
          <button type="button" className="text-[var(--sw-pink)]" aria-label="Favori">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 21s-7-4.4-9.5-8.5C.5 9.5 2.5 5 6.5 5c2 0 3.5 1.2 4.5 2.8C12 6.2 13.5 5 15.5 5 19.5 5 21.5 9.5 21.5 12.5 19 16.6 12 21 12 21Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <p className="mt-4 rounded-2xl bg-white p-4 text-sm leading-relaxed text-[var(--sw-muted)] shadow-sm ring-1 ring-black/5">
          {skill.description}
        </p>

        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-wide text-[var(--sw-muted)]">Ce que tu vas apprendre</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {skill.learnings.map((item, i) => (
              <div
                key={item.title}
                className={[
                  'rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5',
                  i === 0 ? 'md:col-span-2' : '',
                ].join(' ')}
              >
                <div className={`inline-flex rounded-xl px-3 py-1 text-xs font-semibold ${tintClass[item.tint]}`}>
                  {item.title}
                </div>
                <p className="mt-2 text-sm text-[var(--sw-muted)]">{item.subtitle}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wide text-[var(--sw-muted)]">Derniers retours</h2>
            <button type="button" className="text-sm font-semibold text-[var(--sw-pink)] hover:underline">
              Voir tout
            </button>
          </div>
          <div className="mt-3 -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
            {skill.reviews.map((review) => (
              <article key={review.name} className="min-w-[260px] rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-[var(--sw-text-strong)]">
                    {review.name}, {review.role}
                  </div>
                  <div className="text-xs font-semibold text-emerald-600">★ {review.rating.toFixed(1)}</div>
                </div>
                <p className="mt-2 text-sm text-[var(--sw-muted)]">{review.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 border-t border-black/10 bg-white/95 p-4 backdrop-blur">
        <div className="mx-auto max-w-6xl">
          <button
            type="button"
            onClick={openSwapModal}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--sw-pink)] px-6 py-4 text-base font-semibold text-white shadow-[0_12px_32px_rgba(230,0,126,0.35)] hover:brightness-95"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 7h11l-2.5-2.5M17 17H6l2.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Proposer un Swap
          </button>
        </div>
      </div>

      <Modal open={swapOpen} onClose={() => setSwapOpen(false)} title="Proposer un Swap">
        {swapSent ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-2xl">✓</div>
            <p className="text-base font-semibold text-[var(--sw-text-strong)]">Swap proposé !</p>
            <p className="text-sm text-[var(--sw-muted)]">{skill.author} recevra ta proposition.</p>
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
