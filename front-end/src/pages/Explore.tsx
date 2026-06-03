import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BASE_URL } from '../api/config.js'
import type { ApiSkill, ApiUser } from '../api/types.ts'
import { userFullName } from '../api/types.ts'
import { exploreCategories, type ExploreCategory } from '../data/categories.ts'
import { CategoryCard } from '../ui/CategoryCard.tsx'
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
