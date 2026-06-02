import { Link } from 'react-router-dom'
import { feedPosts } from '../data/mock.ts'
import { AvatarImage } from '../ui/AvatarImage.tsx'
import { CoverImage } from '../ui/CoverImage.tsx'
import { unsplashUrl } from '../utils/images.ts'

export function Feed() {
  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--sw-bg)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
          <Link to="/" className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5" aria-label="Retour">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <div className="flex-1 text-center">
            <div className="text-lg font-bold text-violet-600">Campus Buzz</div>
            <div className="text-xs text-[var(--sw-muted)]">See what your peers are mastering today.</div>
          </div>
          <div className="h-10 w-10" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-2 md:px-6">
        <div className="flex flex-col gap-4">
          {feedPosts.map((post) => (
            <article key={post.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
              <div className="flex items-start gap-3">
                <AvatarImage name={post.author} size={80} className="h-10 w-10 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-[var(--sw-text-strong)]">
                      <span className="font-semibold">{post.author}</span> learned{' '}
                      <span className="font-semibold">{post.skill}</span>
                      <span className="text-[var(--sw-muted)]">
                        {' '}
                        with {post.with} • {post.time}
                      </span>
                    </p>
                    {post.validated ? (
                      <span className="shrink-0 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
                        VALIDATED
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
                        src={unsplashUrl(post.skill, 400, 200)}
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
                    <span className="text-xs text-[var(--sw-muted)]">+12 Endorsed by peers</span>
                    <div className="flex gap-3 text-xs text-[var(--sw-muted)]">
                      <span>♥ {post.likes}</span>
                      <span>💬 {post.comments}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--sw-pink)] py-3 text-sm font-semibold text-white"
                  >
                    👍 Endorse Skill
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  )
}
