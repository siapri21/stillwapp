import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiGet } from '../api/request.ts'
import type { ApiSkill, ApiUser } from '../api/types.ts'
import { userFullName } from '../api/types.ts'
import { OfferCard } from '../ui/OfferCard.tsx'
import { PageMain } from '../ui/PageMain.tsx'

export function Search() {
  const [skills, setSkills] = useState<ApiSkill[]>([])
  const [users, setUsers] = useState<ApiUser[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiGet<ApiSkill[]>('/skills'),
      apiGet<ApiUser[]>('/users'),
    ])
      .then(([skillsData, usersData]) => {
        setSkills(skillsData)
        setUsers(usersData)
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return skills
    return skills.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q)),
    )
  }, [skills, query])

  const authorName = (userId: number) => {
    const user = users.find((u) => u.id === userId)
    return user ? userFullName(user) : 'Anonyme'
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--sw-bg)]/90 backdrop-blur supports-[backdrop-filter]:bg-[var(--sw-bg)]/70 lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
          <Link to="/" className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5" aria-label="Retour">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <h1 className="flex-1 text-center font-display text-lg text-[var(--sw-text-strong)]">Recherche</h1>
          <div className="h-10 w-10" />
        </div>
      </header>

      <PageMain className="pt-2 lg:pt-4">
        <h1 className="hidden font-display text-3xl text-[var(--sw-text-strong)] lg:block">Recherche</h1>

        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5 lg:mt-6 lg:max-w-xl">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black/5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4.2-4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <input
            className="w-full bg-transparent font-body text-[15px] outline-none placeholder:text-[var(--sw-muted)] md:text-base"
            placeholder="Rechercher une compétence, un tag…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Rechercher"
            autoFocus
          />
        </div>

        <p className="mt-3 text-sm text-[var(--sw-muted)]">
          {loading ? 'Chargement…' : `${filtered.length} résultat${filtered.length !== 1 ? 's' : ''}`}
        </p>

        <div className="mt-4 flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-5">
          {!loading &&
            filtered.map((skill) => (
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
            ))}
        </div>
      </PageMain>
    </>
  )
}
