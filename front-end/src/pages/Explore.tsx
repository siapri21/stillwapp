import { useState } from 'react'
import { Link } from 'react-router-dom'
import { exploreCategories, skills, type ExploreCategory } from '../data/mock.ts'
import { CategoryCard } from '../ui/CategoryCard.tsx'
import { OfferCard } from '../ui/OfferCard.tsx'
import { TagChip } from '../ui/TagChip.tsx'

export function Explore() {
  const [selectedCategory, setSelectedCategory] = useState<ExploreCategory | null>(null)

  const filteredSkills = selectedCategory
    ? skills.filter((skill) => skill.exploreCategory === selectedCategory)
    : skills

  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--sw-bg)]/90 backdrop-blur supports-[backdrop-filter]:bg-[var(--sw-bg)]/70">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
          <div className="relative">
            <img src="/logoskillwapp.png" alt="SkillWapp" className="h-10 w-10 rounded-full object-cover shadow-sm" />            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[var(--sw-bg)]" />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/matching"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--sw-text-strong)] hover:bg-black/5"
              aria-label="Matching"
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
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-2 md:px-6 md:pt-4">
        <section className="mt-3">
          <h1 className="text-balance text-2xl font-semibold leading-tight text-[var(--sw-text-strong)] md:text-4xl">
            Qu&apos;est-ce que tu veux apprendre aujourd&apos;hui&nbsp;?
          </h1>

          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white/95 p-3 text-[var(--sw-text-strong)] shadow-sm ring-1 ring-black/5 md:mt-5 md:max-w-xl">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black/5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="2" />
                <path d="M21 21l-4.2-4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <input
              className="w-full bg-transparent text-[15px] outline-none placeholder:text-[var(--sw-muted)] md:text-base"
              placeholder="Rechercher une compétence…"
              aria-label="Rechercher une compétence"
            />
          </div>
        </section>

        <section className="mt-7">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-lg font-semibold text-[var(--sw-text-strong)] md:text-xl">Catégories</h2>
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className="text-sm font-semibold text-[var(--sw-pink)] hover:underline"
            >
              Voir tout
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {exploreCategories.map((cat) => (
              <CategoryCard
                key={cat.id}
                title={cat.title}
                tint={cat.tint}
                icon={cat.icon}
                active={selectedCategory === cat.id}
                onClick={() => setSelectedCategory((prev) => (prev === cat.id ? null : cat.id))}
              />
            ))}
          </div>
        </section>

        <section className="mt-7">
          <h2 className="text-lg font-semibold text-[var(--sw-text-strong)] md:text-xl">Populaire maintenant</h2>
          <div className="mt-3 -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
            <TagChip label="#ReactJS" />
            <TagChip label="#Español" />
            <TagChip label="#Beatmaking" />
            <TagChip label="#UI" />
          </div>
        </section>

        <section className="mt-7">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-[var(--sw-text-strong)] md:text-xl">Offres de swap</h2>
            {selectedCategory ? (
              <span className="text-sm text-[var(--sw-muted)]">{filteredSkills.length} résultat{filteredSkills.length !== 1 ? 's' : ''}</span>
            ) : null}
          </div>
          <div className="mt-4 flex flex-col gap-4">
            {filteredSkills.length === 0 ? (
              <p className="rounded-2xl bg-white p-6 text-center text-sm text-[var(--sw-muted)] shadow-sm ring-1 ring-black/5">
                Aucune offre dans cette catégorie pour le moment.
              </p>
            ) : (
              filteredSkills.map((skill) => (
                <Link key={skill.id} to={`/explore/${skill.id}`} className="block">
                  <OfferCard
                    title={skill.title}
                    author={skill.author}
                    duration="1h pour 1h"
                    rating={skill.rating}
                    category={skill.exploreCategory}
                  />
                </Link>
              ))
            )}
          </div>
        </section>
      </main>
    </>
  )
}
