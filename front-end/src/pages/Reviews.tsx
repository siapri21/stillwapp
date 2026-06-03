import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { apiGet } from '../api/request.ts'
import type { ApiSessionReview, ApiUser } from '../api/types.ts'
import { userFullName } from '../api/types.ts'
import { AvatarImage } from '../ui/AvatarImage.tsx'
import { Modal } from '../ui/Modal.tsx'
import { PageMain } from '../ui/PageMain.tsx'

export function Reviews() {
  const [searchParams, setSearchParams] = useSearchParams()
  const sessionId = searchParams.get('session')
  const [reviews, setReviews] = useState<ApiSessionReview[]>([])
  const [users, setUsers] = useState<ApiUser[]>([])
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const writeOpen = sessionId !== null

  useEffect(() => {
    Promise.all([
      apiGet<ApiSessionReview[]>('/sessionReviews'),
      apiGet<ApiUser[]>('/users'),
    ])
      .then(([reviewsData, usersData]) => {
        setReviews(reviewsData)
        setUsers(usersData)
      })
      .finally(() => setLoading(false))
  }, [])

  const authorLabel = (userId: number) => {
    const u = users.find((x) => x.id === userId)
    return u ? userFullName(u) : 'Étudiant'
  }

  const closeWrite = () => {
    setSearchParams({})
    setSubmitted(false)
    setComment('')
    setRating(5)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    window.setTimeout(closeWrite, 1200)
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--sw-bg)]/90 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/planning" className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5" aria-label="Retour">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <h1 className="flex-1 text-center font-display text-lg text-[var(--sw-text-strong)]">Avis</h1>
          <div className="h-10 w-10" />
        </div>
      </header>

      <PageMain className="pt-2 lg:pt-4">
        <h1 className="hidden font-display text-3xl text-[var(--sw-text-strong)] lg:block">Avis des sessions</h1>
        <p className="mt-1 hidden text-sm text-[var(--sw-muted)] lg:block">
          Consulte et laisse des avis après une session terminée.
        </p>

        <div className="mt-4 flex flex-col gap-4 lg:mt-6 lg:grid lg:grid-cols-2">
          {loading ? (
            <p className="text-sm text-[var(--sw-muted)]">Chargement…</p>
          ) : (
            reviews.map((r) => (
              <article key={r.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
                <div className="flex items-start gap-3">
                  <AvatarImage name={authorLabel(r.authorId)} size={72} className="h-10 w-10" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-body text-sm font-semibold text-[var(--sw-text-strong)]">
                        {authorLabel(r.authorId)}
                      </span>
                      <span className="text-[var(--sw-orange)]">{'★'.repeat(Math.round(r.rating))}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-[var(--sw-muted)]">
                      {r.skill} · {r.date}
                    </p>
                    <p className="mt-2 font-body text-sm text-[var(--sw-text)]">{r.comment}</p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </PageMain>

      <Modal open={writeOpen} onClose={closeWrite} title="Laisser un avis">
        {submitted ? (
          <div className="py-6 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-2xl">✓</div>
            <p className="mt-3 font-semibold text-[var(--sw-text-strong)]">Merci pour ton avis !</p>
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-semibold text-[var(--sw-text-strong)]">Note</label>
              <div className="mt-2 flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    className={[
                      'h-10 w-10 rounded-xl text-lg',
                      n <= rating ? 'bg-[var(--sw-yellow)] text-black' : 'bg-neutral-100 text-[var(--sw-muted)]',
                    ].join(' ')}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partage ton expérience…"
              className="w-full resize-none rounded-2xl bg-[var(--sw-bg)] p-3 text-sm outline-none ring-1 ring-black/5"
              required
            />
            <button type="submit" className="rounded-2xl bg-[var(--sw-pink)] py-3 text-sm font-semibold text-white">
              Publier l&apos;avis
            </button>
          </form>
        )}
      </Modal>
    </>
  )
}
