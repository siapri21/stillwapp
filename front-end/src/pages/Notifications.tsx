import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiGet } from '../api/request.ts'
import type { ApiNotification } from '../api/types.ts'
import { PageMain } from '../ui/PageMain.tsx'

export function Notifications() {
  const [items, setItems] = useState<ApiNotification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiGet<ApiNotification[]>('/notifications').then(setItems)
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--sw-bg)]/90 backdrop-blur supports-[backdrop-filter]:bg-[var(--sw-bg)]/70 lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
          <Link to="/" className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5" aria-label="Retour">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <h1 className="flex-1 text-center font-display text-lg text-[var(--sw-text-strong)]">Notifications</h1>
          <div className="h-10 w-10" />
        </div>
      </header>

      <PageMain className="pt-2 lg:pt-4">
        <h1 className="hidden font-display text-3xl text-[var(--sw-text-strong)] lg:block">Notifications</h1>
        <p className="mt-1 hidden text-sm text-[var(--sw-muted)] lg:block">Tes alertes swap, messages et badges.</p>

        <div className="mt-4 flex flex-col gap-3 lg:mt-6 lg:grid lg:grid-cols-2 lg:gap-4">
          {loading ? (
            <p className="text-sm text-[var(--sw-muted)]">Chargement…</p>
          ) : items.length === 0 ? (
            <p className="rounded-2xl bg-white p-6 text-center text-sm text-[var(--sw-muted)] shadow-sm ring-1 ring-black/5">
              Aucune notification pour le moment.
            </p>
          ) : (
            items.map((n) => (
              <article
                key={n.id}
                className={[
                  'rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5',
                  !n.read ? 'ring-2 ring-[var(--sw-pink)]/25' : '',
                ].join(' ')}
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--sw-orange)]/15 text-lg">
                    {n.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="font-body text-sm font-semibold text-[var(--sw-text-strong)]">{n.title}</h2>
                      <span className="shrink-0 text-xs text-[var(--sw-muted)]">{n.time}</span>
                    </div>
                    <p className="mt-1 font-body text-sm text-[var(--sw-muted)]">{n.body}</p>
                    {n.link ? (
                      <Link to={n.link} className="mt-2 inline-block text-sm font-semibold text-[var(--sw-pink)] hover:underline">
                        Voir
                      </Link>
                    ) : null}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </PageMain>
    </>
  )
}
