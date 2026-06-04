import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiGet } from '../api/request.ts'
import type { ApiFeedPost, ApiUser } from '../api/types.ts'
import { userFullName } from '../api/types.ts'
import { FeedPostCard, type FeedPostItem } from '../ui/FeedPostCard.tsx'
import { PageMain } from '../ui/PageMain.tsx'

export function Feed() {
  const [posts, setPosts] = useState<FeedPostItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([apiGet<ApiFeedPost[]>('/feed'), apiGet<ApiUser[]>('/users')])
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
      <header className="sticky top-0 z-30 border-b border-black/5 bg-[var(--sw-bg)]/95 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link
            to="/"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5"
            aria-label="Retour"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <div className="flex-1 text-center">
            <h1 className="font-display text-lg text-[var(--sw-text-strong)]">Fil du campus</h1>
            <p className="text-xs text-[var(--sw-muted)]">Ce que tes pairs apprennent</p>
          </div>
          <div className="h-10 w-10" aria-hidden />
        </div>
      </header>

      <PageMain className="pt-2 md:pt-4">
        <header className="mb-6 hidden lg:block">
          <h1 className="font-display text-3xl text-[var(--sw-text-strong)]">Fil du campus</h1>
          <p className="mt-1 text-base text-[var(--sw-muted)]">
            Découvre les échanges validés et les retours de la communauté.
          </p>
        </header>

        {loading ? (
          <p className="text-sm text-[var(--sw-muted)]">Chargement…</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <FeedPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </PageMain>
    </>
  )
}
