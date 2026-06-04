import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiGet } from '../api/request.ts'
import type { ApiCurrentUser, ApiMySwap, ApiSkill } from '../api/types.ts'
import { userFullName } from '../api/types.ts'
import { useAuth } from '../context/AuthContext.tsx'
import { AvatarImage } from '../ui/AvatarImage.tsx'
import { CoverImage } from '../ui/CoverImage.tsx'
import { Modal } from '../ui/Modal.tsx'
import { PageMain } from '../ui/PageMain.tsx'
import { allLevelBadges } from '../utils/levelBadge.ts'

type ProfileTab = 'talents' | 'wishes'

export function Profile() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [user, setUser] = useState<ApiCurrentUser | null>(null)
  const [talents, setTalents] = useState<ApiSkill[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<ProfileTab>('talents')
  const [swapsOpen, setSwapsOpen] = useState(false)

  useEffect(() => {
    Promise.all([
      apiGet<ApiCurrentUser>('/currentUser'),
      apiGet<ApiSkill[]>('/skills'),
    ])
      .then(([currentUser, skillsData]) => {
        setUser(currentUser)
        setTalents(skillsData.filter((s) => s.userId === currentUser.id))
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
  const levelBadges = allLevelBadges(user.swaps, user.rating)

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--sw-bg)]/90 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2 md:px-6">
          <AvatarImage name={fullName} size={80} className="h-9 w-9" />
          <span className="truncate text-sm font-semibold text-[var(--sw-text-strong)]">{fullName}</span>
          <button
            type="button"
            className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--sw-text-strong)] hover:bg-black/5"
            aria-label="Réglages"
          >
            <GearIcon />
          </button>
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
                    <StatCard
                      value={String(user.swaps)}
                      label="Échanges"
                      onClick={() => setSwapsOpen(true)}
                      clickable
                    />
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
              <h2 className="font-display text-lg text-[var(--sw-text-strong)]">Badges de niveau</h2>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {levelBadges.map((b) => (
                  <div
                    key={b.tier}
                    className={[
                      'rounded-2xl p-4 ring-1',
                      b.active ? 'bg-white shadow-md ring-[var(--sw-pink)]/30' : 'bg-white/70 opacity-80 ring-black/5',
                    ].join(' ')}
                  >
                    <div className="text-2xl">{b.emoji}</div>
                    <div className="mt-2 font-display text-sm text-[var(--sw-text-strong)]">{b.label}</div>
                    <p className="mt-1 text-xs text-[var(--sw-muted)]">{b.description}</p>
                  </div>
                ))}
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
                    Python, UI Design. Configure tes souhaits depuis les paramètres (bientôt).
                  </p>
                )}
              </div>
            </section>
          </div>

          <aside className="flex flex-col gap-5 lg:sticky lg:top-20">
            <MentorSection />

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

      <SwapsHistoryModal open={swapsOpen} onClose={() => setSwapsOpen(false)} />
    </>
  )
}

function StatCard({
  value,
  label,
  icon,
  onClick,
  clickable,
}: {
  value: string
  label: string
  icon?: 'star'
  onClick?: () => void
  clickable?: boolean
}) {
  const className = [
    'rounded-2xl bg-[var(--sw-bg)] p-3 text-center ring-1 ring-black/5 lg:bg-white lg:p-4',
    clickable ? 'cursor-pointer transition hover:ring-[var(--sw-pink)]/40 hover:shadow-sm' : '',
  ].join(' ')

  if (clickable && onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        <div className="flex items-center justify-center gap-1 text-lg font-extrabold text-[var(--sw-text-strong)]">
          <span>{value}</span>
          {icon === 'star' ? <span className="text-[var(--sw-orange)]">★</span> : null}
        </div>
        <div className="mt-1 text-xs font-semibold text-[var(--sw-pink)]">{label}</div>
      </button>
    )
  }

  return (
    <div className={className}>
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
          <p className="mt-0.5 truncate text-xs text-[var(--sw-muted)]">{skill.tags.join(', ')}</p>
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

const MENTOR_FILIERES = [
  'Informatique & Data',
  'Design & Création',
  'Commerce & Marketing',
  'Droit & Sciences Po',
  'Ingénierie',
  'Santé & Pharma',
  'Langues & Lettres',
  'Musique & Arts',
  'Autre filière',
] as const

function MentorSection() {
  const [files, setFiles] = useState({ releve: false, diplome: false, cert: false })
  const [filiere, setFiliere] = useState('')
  const [profApproved, setProfApproved] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const hasFile = files.releve || files.diplome || files.cert
  const canSubmit = hasFile && filiere !== '' && profApproved

  const setFile = (key: keyof typeof files, value: boolean) => {
    setFiles((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 lg:p-6">
      <h2 className="font-display text-lg text-[var(--sw-text-strong)]">Devenir Mentor</h2>
      <p className="mt-2 text-sm text-[var(--sw-muted)]">
        Indique ta filière, confirme l&apos;accord d&apos;un professeur et joins au moins un justificatif.
      </p>

      <label className="mt-4 block">
        <span className="text-sm font-semibold text-[var(--sw-text-strong)]">Filière concernée</span>
        <select
          value={filiere}
          onChange={(e) => setFiliere(e.target.value)}
          className="mt-2 w-full rounded-xl bg-[var(--sw-bg)] px-4 py-3 text-sm outline-none ring-1 ring-black/5 focus:ring-[var(--sw-pink)]"
        >
          <option value="">Sélectionne ta filière…</option>
          {MENTOR_FILIERES.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl bg-[var(--sw-bg)] p-4 ring-1 ring-black/5">
        <input
          type="checkbox"
          checked={profApproved}
          onChange={(e) => setProfApproved(e.target.checked)}
          className="mt-1 h-5 w-5 shrink-0 accent-[var(--sw-pink)]"
        />
        <span className="text-sm text-[var(--sw-text-strong)]">
          <span className="font-semibold">Validation professeur</span>
          <span className="mt-1 block text-[var(--sw-muted)]">
            Je confirme que ma candidature mentor a été approuvée par un professeur référent de ma filière.
          </span>
        </span>
      </label>

      <div className="mt-4 flex flex-col gap-3">
        <MentorUpload label="Relevé de notes" accept=".pdf,.jpg,.jpeg,.png" onFileChange={(v) => setFile('releve', v)} />
        <MentorUpload label="Diplôme" accept=".pdf,.jpg,.jpeg,.png" onFileChange={(v) => setFile('diplome', v)} />
        <MentorUpload label="Certification" accept=".pdf,.jpg,.jpeg,.png" onFileChange={(v) => setFile('cert', v)} />
      </div>

      {submitted ? (
        <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-center text-sm font-semibold text-emerald-700">
          Candidature envoyée pour la filière « {filiere} ». Nous te recontactons sous 48h.
        </p>
      ) : (
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => canSubmit && setSubmitted(true)}
          className={[
            'mt-4 w-full rounded-2xl py-3.5 text-sm font-semibold shadow-sm transition',
            canSubmit
              ? 'bg-[var(--sw-yellow)] text-black hover:brightness-95'
              : 'cursor-not-allowed bg-neutral-200 text-neutral-500',
          ].join(' ')}
        >
          Soumettre ma candidature mentor
        </button>
      )}
    </section>
  )
}

function MentorUpload({
  label,
  accept,
  onFileChange,
}: {
  label: string
  accept: string
  onFileChange: (hasFile: boolean) => void
}) {
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
        onChange={(e) => {
          const name = e.target.files?.[0]?.name ?? null
          setFileName(name)
          onFileChange(!!name)
        }}
      />
    </label>
  )
}

function SwapsHistoryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [swaps, setSwaps] = useState<ApiMySwap[]>([])
  const [loading, setLoading] = useState(false)
  const [reviewingId, setReviewingId] = useState<number | null>(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  useEffect(() => {
    if (!open) return
    setLoading(true)
    apiGet<ApiMySwap[]>('/mySwaps').then(setSwaps)
      .finally(() => setLoading(false))
  }, [open])

  const submitReview = (swapId: number) => {
    setSwaps((prev) =>
      prev.map((s) =>
        s.id === swapId ? { ...s, myReviewLeft: true, myRating: rating, myComment: comment } : s,
      ),
    )
    setReviewingId(null)
    setRating(5)
    setComment('')
  }

  return (
    <Modal open={open} onClose={onClose} title="Mes échanges">
      {loading ? (
        <p className="text-sm text-[var(--sw-muted)]">Chargement…</p>
      ) : swaps.length === 0 ? (
        <p className="py-4 text-center text-sm text-[var(--sw-muted)]">Aucun échange pour le moment.</p>
      ) : (
        <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1">
          {swaps.map((swap) => (
            <article key={swap.id} className="rounded-2xl bg-[var(--sw-bg)] p-4 ring-1 ring-black/5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-[var(--sw-text-strong)]">{swap.skill}</h3>
                  <p className="mt-0.5 text-xs text-[var(--sw-muted)]">
                    avec {swap.partnerName}, {swap.date}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  Terminé
                </span>
              </div>

              {swap.ratingReceived != null ? (
                <div className="mt-3 rounded-xl bg-white p-3">
                  <p className="text-xs font-semibold text-[var(--sw-muted)]">Note reçue</p>
                  <p className="mt-1 text-sm text-[var(--sw-orange)]">{'★'.repeat(Math.round(swap.ratingReceived))}</p>
                  {swap.reviewReceived ? (
                    <p className="mt-2 text-sm text-[var(--sw-text)]">&laquo; {swap.reviewReceived} &raquo;</p>
                  ) : null}
                </div>
              ) : null}

              {swap.myReviewLeft && swap.myRating != null ? (
                <div className="mt-3 rounded-xl bg-white p-3">
                  <p className="text-xs font-semibold text-[var(--sw-muted)]">Ton avis</p>
                  <p className="text-sm text-[var(--sw-orange)]">{'★'.repeat(Math.round(swap.myRating))}</p>
                  {swap.myComment ? <p className="mt-1 text-sm text-[var(--sw-muted)]">{swap.myComment}</p> : null}
                </div>
              ) : !swap.myReviewLeft && reviewingId === swap.id ? (
                <form
                  className="mt-3 flex flex-col gap-3"
                  onSubmit={(e) => {
                    e.preventDefault()
                    submitReview(swap.id)
                  }}
                >
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRating(n)}
                        className={[
                          'h-9 w-9 rounded-lg text-sm',
                          n <= rating ? 'bg-[var(--sw-yellow)] text-black' : 'bg-neutral-100 text-neutral-400',
                        ].join(' ')}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={3}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Ton commentaire…"
                    className="w-full resize-none rounded-xl bg-white p-3 text-sm outline-none ring-1 ring-black/5"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setReviewingId(null)}
                      className="flex-1 rounded-xl bg-neutral-100 py-2 text-sm font-semibold text-[var(--sw-muted)]"
                    >
                      Annuler
                    </button>
                    <button type="submit" className="flex-1 rounded-xl bg-[var(--sw-pink)] py-2 text-sm font-semibold text-white">
                      Publier
                    </button>
                  </div>
                </form>
              ) : !swap.myReviewLeft ? (
                <button
                  type="button"
                  onClick={() => {
                    setReviewingId(swap.id)
                    setRating(5)
                    setComment('')
                  }}
                  className="mt-3 text-sm font-semibold text-[var(--sw-pink)] hover:underline"
                >
                  Laisser un avis
                </button>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </Modal>
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
