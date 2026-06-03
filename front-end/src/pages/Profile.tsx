import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BASE_URL } from '../api/config.js'
import type { ApiBadge, ApiCurrentUser, ApiSkill } from '../api/types.ts'
import { userFullName } from '../api/types.ts'
import { useAuth } from '../context/AuthContext.tsx'
import { AvatarImage } from '../ui/AvatarImage.tsx'
import { CoverImage } from '../ui/CoverImage.tsx'
import { NotificationLink } from '../ui/NotificationLink.tsx'
import { PageMain } from '../ui/PageMain.tsx'

type ProfileTab = 'talents' | 'wishes'

export function Profile() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [user, setUser] = useState<ApiCurrentUser | null>(null)
  const [talents, setTalents] = useState<ApiSkill[]>([])
  const [badges, setBadges] = useState<ApiBadge[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<ProfileTab>('talents')
  const [mentorSubmitted, setMentorSubmitted] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch(`${BASE_URL}/currentUser`).then((res) => res.json() as Promise<ApiCurrentUser>),
      fetch(`${BASE_URL}/skills`).then((res) => res.json() as Promise<ApiSkill[]>),
      fetch(`${BASE_URL}/badges`).then((res) => res.json() as Promise<ApiBadge[]>),
    ])
      .then(([currentUser, skillsData, badgesData]) => {
        setUser(currentUser)
        setTalents(skillsData.filter((s) => s.userId === currentUser.id))
        setBadges(badgesData.filter((b) => b.unlocked))
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading || !user) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[var(--sw-bg)]">
        <p className="text-sm text-[var(--sw-muted)]">Chargement…</p>
      </div>
    )
  }

  const fullName = userFullName(user)
  const xpPercent = Math.round((user.xp / user.xpNext) * 100)

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--sw-bg)]/90 backdrop-blur supports-[backdrop-filter]:bg-[var(--sw-bg)]/70 lg:hidden">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
          <AvatarImage name={fullName} size={80} className="h-10 w-10" />
          <div className="ml-auto flex items-center gap-2">
            <NotificationLink />
            <Link
              to="/search"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--sw-text-strong)] hover:bg-black/5 active:bg-black/10"
              aria-label="Recherche"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="2" />
                <path d="M21 21l-4.2-4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--sw-text-strong)] hover:bg-black/5 active:bg-black/10"
              aria-label="Réglages"
            >
              <GearIcon />
            </button>
          </div>
        </div>
      </header>

      <PageMain className="pt-2 lg:pt-4">
        <h1 className="hidden font-display text-3xl text-[var(--sw-text-strong)] lg:block">Mon profil</h1>
        <p className="mt-1 hidden text-sm text-[var(--sw-muted)] lg:block">
          Gère tes compétences, badges et candidature mentor.
        </p>

        <div className="mt-4 lg:mt-6 lg:grid lg:grid-cols-[1fr_380px] lg:items-start lg:gap-8 xl:grid-cols-[1fr_420px]">
          <div className="flex flex-col gap-5">
            <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-7">
              <div className="flex flex-col items-center lg:flex-row lg:items-start lg:gap-8">
                <div className="relative shrink-0">
                  <AvatarImage name={fullName} size={224} className="h-24 w-24 ring-4 ring-white lg:h-32 lg:w-32" />
                  <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-white" />
                  <span className="absolute -inset-2 rounded-full ring-4 ring-[rgba(230,0,126,0.22)]" />
                </div>

                <div className="mt-4 w-full text-center lg:mt-0 lg:text-left">
                  <h2 className="font-display text-2xl text-[var(--sw-text-strong)] lg:text-3xl">{fullName}</h2>
                  <p className="mt-1 text-sm text-[var(--sw-muted)]">{user.university}</p>

                  <div className="mt-4 flex items-center justify-between gap-3 lg:justify-start lg:gap-8">
                    <span className="text-sm font-semibold text-[var(--sw-pink)]">Niveau Karma {user.level}</span>
                    <span className="text-sm font-semibold text-[var(--sw-muted)]">{user.title}</span>
                  </div>

                  <div className="mt-3">
                    <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-100 ring-1 ring-black/5">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,var(--sw-pink),var(--sw-orange))]"
                        style={{ width: `${xpPercent}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-[var(--sw-muted)] lg:text-left">
                      {user.xp} / {user.xpNext} XP pour le Niveau {user.level + 1}
                    </p>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <StatCard value={String(user.swaps)} label="Échanges" />
                    <StatCard value={user.rating.toFixed(1)} label="Note" icon="star" />
                    <StatCard value={String(user.friends)} label="Amis" />
                  </div>

                  <Link
                    to="/dashboard"
                    className="mt-5 hidden rounded-2xl bg-[var(--sw-orange)] px-5 py-3 text-center text-sm font-semibold text-black shadow-sm hover:brightness-95 lg:inline-block"
                  >
                    Voir le tableau de bord
                  </Link>
                </div>
              </div>
            </section>

            <section>
              <div className="grid grid-cols-2 gap-3 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-black/5">
                <button
                  type="button"
                  onClick={() => setTab('talents')}
                  className={[
                    'rounded-xl px-4 py-3 text-sm font-semibold transition',
                    tab === 'talents' ? 'bg-[var(--sw-pink)] text-white shadow-sm' : 'text-[var(--sw-muted)] hover:bg-black/5',
                  ].join(' ')}
                >
                  Mes Talents
                </button>
                <button
                  type="button"
                  onClick={() => setTab('wishes')}
                  className={[
                    'rounded-xl px-4 py-3 text-sm font-semibold transition',
                    tab === 'wishes' ? 'bg-[var(--sw-pink)] text-white shadow-sm' : 'text-[var(--sw-muted)] hover:bg-black/5',
                  ].join(' ')}
                >
                  Mes Souhaits
                </button>
              </div>

              <div className="mt-4 flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-5">
                {tab === 'talents' ? (
                  talents.length === 0 ? (
                    <p className="rounded-2xl bg-white p-6 text-center text-sm text-[var(--sw-muted)] shadow-sm ring-1 ring-black/5 lg:col-span-2">
                      Tu n&apos;as pas encore publié de talent.
                    </p>
                  ) : (
                    talents.map((skill) => <TalentCard key={skill.id} skill={skill} />)
                  )
                ) : (
                  <p className="rounded-2xl bg-white p-6 text-center text-sm text-[var(--sw-muted)] shadow-sm ring-1 ring-black/5 lg:col-span-2">
                    Ajoute les compétences que tu souhaites apprendre (bientôt disponible).
                  </p>
                )}
              </div>
            </section>

            <section className="lg:hidden">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-display text-lg text-[var(--sw-text-strong)]">Badges &amp; Succès</h2>
                <Link to="/dashboard" className="text-sm font-semibold text-[var(--sw-pink)] hover:underline">
                  Tableau de bord
                </Link>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {badges.slice(0, 3).map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
            </section>
          </div>

          <aside className="flex flex-col gap-5 lg:sticky lg:top-20">
            <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 lg:p-6">
              <h2 className="font-display text-lg text-[var(--sw-text-strong)]">Devenir Mentor</h2>
              <p className="mt-2 text-sm text-[var(--sw-muted)]">
                Téléverse ton relevé de notes, ton diplôme ou une certification pour valider ton profil mentor.
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <MentorUpload label="Relevé de notes" accept=".pdf,.jpg,.jpeg,.png" />
                <MentorUpload label="Diplôme" accept=".pdf,.jpg,.jpeg,.png" />
                <MentorUpload label="Certification" accept=".pdf,.jpg,.jpeg,.png" />
              </div>
              {mentorSubmitted ? (
                <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-center text-sm font-semibold text-emerald-700">
                  Candidature envoyée — nous te recontactons sous 48h.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setMentorSubmitted(true)}
                  className="mt-4 w-full rounded-2xl bg-[var(--sw-yellow)] py-3.5 text-sm font-semibold text-black shadow-sm hover:brightness-95"
                >
                  Soumettre ma candidature mentor
                </button>
              )}
            </section>

            <section className="hidden lg:block">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-display text-lg text-[var(--sw-text-strong)]">Badges débloqués</h2>
                <Link to="/dashboard" className="text-sm font-semibold text-[var(--sw-pink)] hover:underline">
                  Tout voir
                </Link>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                {badges.slice(0, 4).map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} compact />
                ))}
              </div>
            </section>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-2xl border border-red-200 bg-white py-3.5 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-red-100 hover:bg-red-50 active:bg-red-100"
            >
              Se déconnecter
            </button>
          </aside>
        </div>
      </PageMain>
    </>
  )
}

function StatCard({ value, label, icon }: { value: string; label: string; icon?: 'star' }) {
  return (
    <div className="rounded-2xl bg-[var(--sw-bg)] p-3 text-center ring-1 ring-black/5 lg:bg-white lg:p-4">
      <div className="flex items-center justify-center gap-1 text-lg font-extrabold text-[var(--sw-text-strong)]">
        <span>{value}</span>
        {icon === 'star' ? <span className="text-[var(--sw-orange)]">★</span> : null}
      </div>
      <div className="mt-1 text-xs font-semibold text-[var(--sw-muted)]">{label}</div>
    </div>
  )
}

function TalentCard({ skill }: { skill: ApiSkill }) {
  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl">
          <CoverImage src={skill.image} className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <div className="flex items-center justify-between gap-3">
            <Link to={`/explore/${skill.id}`} className="truncate text-sm font-semibold text-[var(--sw-text-strong)] hover:text-[var(--sw-pink)]">
              {skill.title}
            </Link>
            <span className="shrink-0 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
              {skill.category}
            </span>
          </div>
          <p className="mt-0.5 truncate text-xs text-[var(--sw-muted)]">{skill.tags.join(' • ')}</p>
          <button
            type="button"
            className="mt-4 inline-flex items-center justify-center rounded-xl bg-[var(--sw-pink)] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:brightness-95 active:brightness-90"
          >
            Éditer
          </button>
        </div>
      </div>
    </article>
  )
}

function BadgeCard({ badge, compact }: { badge: ApiBadge; compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5">
        <div
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-xl ring-2 ring-[var(--sw-yellow)]/40"
          style={{ backgroundColor: badge.color }}
        >
          {badge.icon}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-[var(--sw-text-strong)]">{badge.name}</div>
          <p className="line-clamp-2 text-xs text-[var(--sw-muted)]">
            {badge.description ?? 'Badge débloqué'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:shadow-lg hover:ring-[var(--sw-pink)]/25">
      <div
        className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-20 blur-xl transition group-hover:opacity-40"
        style={{ backgroundColor: badge.color }}
      />
      <div
        className="relative grid h-16 w-16 place-items-center rounded-2xl text-3xl ring-4 ring-[var(--sw-yellow)]/40 transition group-hover:scale-105"
        style={{ backgroundColor: badge.color }}
      >
        {badge.icon}
      </div>
      <h3 className="relative mt-3 font-display text-sm text-[var(--sw-text-strong)]">{badge.name}</h3>
      <p className="relative mt-1 text-xs text-[var(--sw-muted)]">
        {badge.description ?? 'Badge obtenu grâce à ton activité sur le campus.'}
      </p>
    </div>
  )
}

function MentorUpload({ label, accept }: { label: string; accept: string }) {
  const [fileName, setFileName] = useState<string | null>(null)
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-[var(--sw-pink)]/35 bg-[var(--sw-bg)] px-4 py-3 transition hover:border-[var(--sw-pink)] hover:bg-[var(--sw-pink)]/5">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--sw-pink)]/10 text-lg">📄</span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-[var(--sw-text-strong)]">{label}</div>
        <div className="truncate text-xs text-[var(--sw-muted)]">{fileName ?? 'PDF, JPG ou PNG'}</div>
      </div>
      <input
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
      />
    </label>
  )
}

function GearIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M19.4 12a7.7 7.7 0 0 0-.1-1l2-1.6-2-3.4-2.4 1a7.9 7.9 0 0 0-1.7-1l-.4-2.6H9.2l-.4 2.6a7.9 7.9 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.6a7.7 7.7 0 0 0 0 2l-2 1.6 2 3.4 2.4-1c.5.4 1.1.7 1.7 1l.4 2.6h5.6l.4-2.6c.6-.3 1.2-.6 1.7-1l2.4 1 2-3.4-2-1.6c.1-.3.1-.7.1-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}
