import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BASE_URL } from '../api/config.js'
import type { ApiSkill, ApiUser } from '../api/types.ts'
import { userFullName } from '../api/types.ts'
import { AvatarImage } from '../ui/AvatarImage.tsx'
import { CoverImage } from '../ui/CoverImage.tsx'
import { PageMain } from '../ui/PageMain.tsx'

export function UserProfile() {
  const { userId } = useParams()
  const id = Number(userId)
  const [user, setUser] = useState<ApiUser | null>(null)
  const [skills, setSkills] = useState<ApiSkill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([
      fetch(`${BASE_URL}/users`).then((res) => res.json() as Promise<ApiUser[]>),
      fetch(`${BASE_URL}/skills`).then((res) => res.json() as Promise<ApiSkill[]>),
    ])
      .then(([usersData, skillsData]) => {
        setUser(usersData.find((u) => u.id === id) ?? null)
        setSkills(skillsData.filter((s) => s.userId === id))
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[var(--sw-bg)]">
        <p className="text-sm text-[var(--sw-muted)]">Chargement…</p>
      </div>
    )
  }

  if (!user) {
    return (
      <PageMain>
        <p className="text-sm text-[var(--sw-muted)]">Profil introuvable.</p>
        <Link to="/" className="mt-4 inline-block text-sm font-semibold text-[var(--sw-pink)]">
          Retour à l&apos;accueil
        </Link>
      </PageMain>
    )
  }

  const fullName = userFullName(user)

  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--sw-bg)]/90 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/" className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5" aria-label="Retour">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <h1 className="flex-1 truncate text-center font-display text-lg text-[var(--sw-text-strong)]">{fullName}</h1>
          <div className="h-10 w-10" />
        </div>
      </header>

      <PageMain className="pt-2 lg:pt-4">
        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 lg:p-7">
          <div className="flex flex-col items-center lg:flex-row lg:items-start lg:gap-8">
            <div className="relative shrink-0">
              <AvatarImage name={fullName} size={224} className="h-24 w-24 ring-4 ring-white lg:h-32 lg:w-32" />
              {user.online ? (
                <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-white" />
              ) : null}
            </div>
            <div className="mt-4 text-center lg:mt-0 lg:text-left">
              <h1 className="font-display text-2xl text-[var(--sw-text-strong)] lg:text-4xl">{fullName}</h1>
              <p className="mt-1 font-body text-sm text-[var(--sw-muted)]">{user.university}</p>
              <p className="mt-2 font-body text-sm text-[var(--sw-muted)]">
                {user.location} · {user.distance}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-4 lg:justify-start">
                <Stat label="Note" value={`${user.rating.toFixed(1)} ★`} />
                <Stat label="Swaps" value={String(user.swaps)} />
                <Stat label="Niveau" value={String(user.level)} />
              </div>
              <Link
                to={`/messages/1`}
                className="mt-5 inline-flex rounded-2xl bg-[var(--sw-pink)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-95"
              >
                Envoyer un message
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="font-display text-lg text-[var(--sw-text-strong)] lg:text-xl">Compétences proposées</h2>
          <div className="mt-4 flex flex-col gap-4 lg:grid lg:grid-cols-2">
            {skills.length === 0 ? (
              <p className="text-sm text-[var(--sw-muted)]">Aucune compétence publiée.</p>
            ) : (
              skills.map((skill) => (
                <Link
                  key={skill.id}
                  to={`/explore/${skill.id}`}
                  className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                    <CoverImage src={skill.image} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-body text-sm font-semibold text-[var(--sw-text-strong)]">{skill.title}</div>
                    <div className="mt-0.5 text-xs text-[var(--sw-pink)]">{skill.category}</div>
                    <div className="mt-1 text-xs text-[var(--sw-muted)]">{skill.duration}</div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </PageMain>
    </>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="font-body text-lg font-bold text-[var(--sw-text-strong)]">{value}</div>
      <div className="text-xs text-[var(--sw-muted)]">{label}</div>
    </div>
  )
}
