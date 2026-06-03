import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BASE_URL } from '../api/config.js'
import type { ApiSkill, ApiUser } from '../api/types.ts'
import { userFullName } from '../api/types.ts'
import { exploreCategories, type ExploreCategory } from '../data/categories.ts'
import { CategoryCard } from '../ui/CategoryCard.tsx'
import { NotificationLink } from '../ui/NotificationLink.tsx'
import { OfferCard } from '../ui/OfferCard.tsx'
import { PageMain } from '../ui/PageMain.tsx'
import { SearchBar } from '../ui/SearchBar.tsx'

export function Explore() {
  const [skills, setSkills] = useState<ApiSkill[]>([])
  const [users, setUsers] = useState<ApiUser[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<ExploreCategory | null>(null)

  useEffect(() => {
    Promise.all([
      fetch(`${BASE_URL}/skills`).then((res) => res.json() as Promise<ApiSkill[]>),
      fetch(`${BASE_URL}/users`).then((res) => res.json() as Promise<ApiUser[]>),
    ])
      .then(([skillsData, usersData]) => {
        setSkills(skillsData)
        setUsers(usersData)
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredSkills = selectedCategory
    ? skills.filter((skill) => skill.category === selectedCategory)
    : skills

  const authorName = (userId: number) => {
    const user = users.find((u) => u.id === userId)
    return user ? userFullName(user) : 'Anonyme'
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--sw-bg)]/90 backdrop-blur supports-[backdrop-filter]:bg-[var(--sw-bg)]/70 lg:hidden">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
          <div className="relative">
            <img src="/logoskillwapp.png" alt="SkillWapp" className="h-10 w-10 rounded-full object-cover shadow-sm" />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[var(--sw-bg)]" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <NotificationLink />
            <Link
              to="/search"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--sw-text-strong)] hover:bg-black/5"
              aria-label="Recherche"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="2" />
                <path d="M21 21l-4.2-4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <PageMain className="pt-2 md:pt-4">
        <section className="mt-3 lg:grid lg:grid-cols-2 lg:gap-8">
          <div>
            <h1 className="text-balance font-display text-2xl leading-tight text-[var(--sw-text-strong)] md:text-4xl">
              Qu&apos;est-ce que tu veux apprendre aujourd&apos;hui&nbsp;?
            </h1>
            <SearchBar className="mt-4 md:mt-5 md:max-w-xl" placeholder="Rechercher une compétence…" />
          </div>
        </section>

        <section className="mt-7">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-lg text-[var(--sw-text-strong)] md:text-xl">Nos Tutorats</h2>
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
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-lg text-[var(--sw-text-strong)] md:text-xl">Cours les plus suivis</h2>
            {selectedCategory ? (
              <span className="text-sm text-[var(--sw-muted)]">
                {filteredSkills.length} résultat{filteredSkills.length !== 1 ? 's' : ''}
              </span>
            ) : null}
          </div>
          <div className="mt-4 flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-5">
            {loading ? (
              <p className="text-sm text-[var(--sw-muted)]">Chargement…</p>
            ) : filteredSkills.length === 0 ? (
              <p className="rounded-2xl bg-white p-6 text-center text-sm text-[var(--sw-muted)] shadow-sm ring-1 ring-black/5">
                Aucune offre dans cette catégorie pour le moment.
              </p>
            ) : (
              filteredSkills.map((skill) => (
                <Link key={skill.id} to={`/explore/${skill.id}`} className="block">
                  <OfferCard
                    title={skill.title}
                    author={authorName(skill.userId)}
                    duration={skill.duration}
                    rating={skill.rating}
                    category={skill.category}
                    image={skill.image}
                  />
                </Link>
              ))
            )}
          </div>
        </section>
      </PageMain>
    </>
  )
}
