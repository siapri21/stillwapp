import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiGet } from '../api/request.ts'
import type { ApiFeedPost, ApiUser } from '../api/types.ts'
import { userFullName } from '../api/types.ts'
import { AvatarImage } from '../ui/AvatarImage.tsx'
import { CoverImage } from '../ui/CoverImage.tsx'
import { PageMain } from '../ui/PageMain.tsx'
import { unsplashUrl } from '../utils/images.ts'

type FeedView = {
  id: number
  author: string
  skill: string
  with: string
  time: string
  validated: boolean
  category?: string
  likes: number
  comments: number
  quote?: string
  image?: string | null
  endorsements: number
}

export function Feed() {
  const [posts, setPosts] = useState<FeedView[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiGet<ApiFeedPost[]>('/feed'),
      apiGet<ApiUser[]>('/users'),
    ])
      .then(([feedData, usersData]) => {
        const mapped = feedData.map((post) => {
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
            endorsements: post.endorsements ?? 0,
          }
        })
        setPosts(mapped)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--sw-bg)]/90 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
          <Link to="/" className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5" aria-label="Retour">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <div className="flex-1 text-center">
            <div className="text-lg font-bold text-violet-600">Fil du campus</div>
            <div className="text-xs text-[var(--sw-muted)]">Découvre ce que tes pairs apprennent aujourd&apos;hui.</div>
          </div>
          <div className="h-10 w-10" />
        </div>
      </header>

      <PageMain className="pt-2">
        {loading ? (
          <p className="text-sm text-[var(--sw-muted)]">Chargement…</p>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <article key={post.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
                <div className="flex items-start gap-3">
                  <AvatarImage name={post.author} size={80} className="h-10 w-10 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-[var(--sw-text-strong)]">
                        <span className="font-semibold">{post.author}</span> a appris{' '}
                        <span className="font-semibold">{post.skill}</span>
                        <span className="text-[var(--sw-muted)]">
                          {' '}
                          avec {post.with} • {post.time}
                        </span>
                      </p>
                      {post.validated ? (
                        <span className="shrink-0 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
                          VALIDÉ
                        </span>
                      ) : null}
                    </div>

                    {post.quote ? (
                      <blockquote className="mt-3 border-l-4 border-violet-400 pl-3 text-sm italic text-[var(--sw-muted)]">
                        {post.quote}
                      </blockquote>
                    ) : (
                      <div className="relative mt-3 h-36 overflow-hidden rounded-xl">
                        <CoverImage
                          src={post.image ?? unsplashUrl(post.skill, 400, 200)}
                          className="h-full w-full object-cover"
                        />
                        {post.category ? (
                          <span className="absolute bottom-2 right-2 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white">
                            {post.category}
                          </span>
                        ) : null}
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-[var(--sw-muted)]">+{post.endorsements} recommandations de pairs</span>
                      <div className="flex gap-3 text-xs text-[var(--sw-muted)]">
                        <span>♥ {post.likes}</span>
                        <span>💬 {post.comments}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--sw-pink)] py-3 text-sm font-semibold text-white"
                    >
                      👍 Recommander
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </PageMain>
    </>
  )
}
