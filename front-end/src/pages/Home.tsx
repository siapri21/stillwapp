import { Link } from 'react-router-dom'
import { peers, skills } from '../data/mock.ts'
import { CoverImage } from '../ui/CoverImage.tsx'
import { PeerRow } from '../ui/PeerRow.tsx'
import { SkillCard } from '../ui/SkillCard.tsx'
import { imageForHero } from '../utils/images.ts'

export function Home() {
  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--sw-bg)]/90 backdrop-blur supports-[backdrop-filter]:bg-[var(--sw-bg)]/70">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
          <img src="/logoskillwapp.png" alt="SkillWapp" className="h-10 w-10 rounded-xl object-cover shadow-sm" />
          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/feed"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--sw-text-strong)] hover:bg-black/5 active:bg-black/10"
              aria-label="Fil d'actu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 22a2.2 2.2 0 0 0 2.2-2.2H9.8A2.2 2.2 0 0 0 12 22Zm7-6.3V11a7 7 0 0 0-5.2-6.8V3a1.8 1.8 0 0 0-3.6 0v1.2A7 7 0 0 0 5 11v4.7l-1.6 1.6V19h19.2v-1.7L19 15.7Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link
              to="/matching"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--sw-text-strong)] hover:bg-black/5 active:bg-black/10"
              aria-label="Matching"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path d="M21 21l-4.2-4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-4 md:px-6 md:pt-6">
        <section className="relative overflow-hidden rounded-3xl p-5 text-white shadow-[0_18px_40px_rgba(0,0,0,0.12)] md:p-7">
          <CoverImage
            src={imageForHero(900, 360)}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(230,0,126,0.82),rgba(255,122,55,0.78))]" />
          <div className="relative">
          <h1 className="text-balance text-2xl font-semibold leading-tight md:text-4xl">
            Prêt à troquer tes talents&nbsp;?
          </h1>
          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white/95 p-3 text-[var(--sw-text-strong)] shadow-sm md:mt-5 md:max-w-xl">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black/5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="2" />
                <path d="M21 21l-4.2-4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <input
              className="w-full bg-transparent text-[15px] outline-none placeholder:text-[var(--sw-muted)] md:text-base"
              placeholder="Trouver une compétence…"
              aria-label="Trouver une compétence"
            />
          </div>
          </div>
        </section>

        <section className="mt-7">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-lg font-semibold text-[var(--sw-text-strong)] md:text-xl">Top du moment</h2>
            <Link to="/explore" className="text-sm font-semibold text-[var(--sw-pink)] hover:underline">
              Voir tout
            </Link>
          </div>

          <div className="mt-4 -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 lg:grid-cols-3">
            {skills.slice(0, 3).map((skill) => (
              <SkillCard key={skill.id} {...skill} className="lg:block" />
            ))}
          </div>
        </section>

        <section className="mt-7">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-[var(--sw-text-strong)] md:text-xl">Tes pairs à proximité</h2>
            <Link
              to="/matching"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--sw-text-strong)] hover:bg-black/5 active:bg-black/10"
              aria-label="Voir les matchs"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </Link>
          </div>

          <div className="mt-4 rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
            {peers.map((peer, i) => (
              <div key={peer.id}>
                {i > 0 ? <div className="h-px bg-black/5" /> : null}
                <PeerRow {...peer} />
              </div>
            ))}
          </div>
        </section>

        <Link
          to="/auth"
          className="fixed bottom-24 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--sw-orange)] text-white shadow-[0_16px_32px_rgba(0,0,0,0.18)] active:translate-y-px md:bottom-8"
          aria-label="Ajouter"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </Link>
      </main>
    </>
  )
}
