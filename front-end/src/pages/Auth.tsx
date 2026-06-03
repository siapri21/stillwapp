import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiGet } from '../api/request.ts'
import type { ApiUser } from '../api/types.ts'
import { userFullName } from '../api/types.ts'
import { useAuth } from '../context/AuthContext.tsx'
import { AvatarImage } from '../ui/AvatarImage.tsx'
import { CoverImage } from '../ui/CoverImage.tsx'
import { assetUrl } from '../utils/assetUrl.ts'
import { imageForCampus } from '../utils/images.ts'



export function Auth() {

  const navigate = useNavigate()

  const [searchParams] = useSearchParams()

  const { login, isAuthenticated } = useAuth()

  const redirectAfterAuth = () => {
    const from = searchParams.get('from')
    navigate(from && from.startsWith('/') ? from : '/', { replace: true })
  }

  const initialMode = searchParams.get('mode') === 'login' ? 'login' : 'signup'
  const [mode, setMode] = useState<'signup' | 'login'>(initialMode)

  const [users, setUsers] = useState<ApiUser[]>([])

  const [error, setError] = useState('')



  const [signupName, setSignupName] = useState('')

  const [signupSurname, setSignupSurname] = useState('')

  const [signupUniversity, setSignupUniversity] = useState('')

  const [signupEmail, setSignupEmail] = useState('')

  const [loginEmail, setLoginEmail] = useState('')



  useEffect(() => {
    const m = searchParams.get('mode')
    if (m === 'login' || m === 'signup') setMode(m)
  }, [searchParams])

  useEffect(() => {

    apiGet<ApiUser[]>('/users').then(setUsers)

  }, [])



  useEffect(() => {

    if (isAuthenticated) {

      redirectAfterAuth()

    }

  }, [isAuthenticated, navigate])



  const handleLogin = (e: React.FormEvent) => {

    e.preventDefault()

    setError('')

    const user = users.find((u) => u.email.toLowerCase() === loginEmail.trim().toLowerCase())

    if (!user) {

      setError('Aucun compte trouvé avec cet email.')

      return

    }

    login(user)

    redirectAfterAuth()

  }



  const handleSignup = (e: React.FormEvent) => {

    e.preventDefault()

    setError('')

    if (!signupName.trim() || !signupSurname.trim() || !signupEmail.trim()) {

      setError('Remplis au minimum prénom, nom et email.')

      return

    }



    const newUser: ApiUser = {

      id: Date.now(),

      name: signupName.trim(),

      surname: signupSurname.trim(),

      university: signupUniversity.trim() || 'Campus',

      email: signupEmail.trim().toLowerCase(),

      avatar: `${signupName[0] ?? ''}${signupSurname[0] ?? ''}`.toUpperCase(),

      color: '#E8B4C8',

      rating: 4.5,

      swaps: 0,

      friends: 0,

      level: 1,

      xp: 0,

      xpNext: 150,

      title: 'Débutant',

      online: true,

      location: 'Campus',

      distance: '—',

    }



    login(newUser)

    redirectAfterAuth()

  }



  return (

    <div className="relative min-h-dvh px-4 py-8">

      <CoverImage src={imageForCampus()} className="absolute inset-0 h-full w-full object-cover" />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,122,55,0.88),rgba(230,0,126,0.92))]" />



      <div className="relative mx-auto max-w-md text-center">

        <img src={assetUrl('logoskillwapp.png')} alt="SkillWapp" className="mx-auto h-14 w-14" />

        <p className="mt-4 text-sm font-medium text-white/90">

          Libère le potentiel du campus grâce à l&apos;apprentissage entre pairs.

        </p>

      </div>



      <div className="relative mx-auto mt-6 max-w-md rounded-3xl bg-white p-5 shadow-xl md:p-7">

        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-neutral-100 p-1">

          <button

            type="button"

            onClick={() => { setMode('signup'); setError('') }}

            className={[

              'rounded-xl py-2.5 text-sm font-semibold',

              mode === 'signup' ? 'bg-black text-[var(--sw-orange)]' : 'text-[var(--sw-muted)]',

            ].join(' ')}

          >

            Inscription

          </button>

          <button

            type="button"

            onClick={() => { setMode('login'); setError('') }}

            className={[

              'rounded-xl py-2.5 text-sm font-semibold',

              mode === 'login' ? 'bg-black text-[var(--sw-orange)]' : 'text-[var(--sw-muted)]',

            ].join(' ')}

          >

            Connexion

          </button>

        </div>



        {error ? (

          <p className="mt-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>

        ) : null}



        {mode === 'signup' ? (

          <form className="mt-5 space-y-3" onSubmit={handleSignup}>

            <div className="grid grid-cols-2 gap-3">

              <input

                className="rounded-xl bg-neutral-100 px-4 py-3 text-sm outline-none"

                placeholder="Prénom"

                value={signupName}

                onChange={(e) => setSignupName(e.target.value)}

              />

              <input

                className="rounded-xl bg-neutral-100 px-4 py-3 text-sm outline-none"

                placeholder="Nom"

                value={signupSurname}

                onChange={(e) => setSignupSurname(e.target.value)}

              />

            </div>

            <input

              className="w-full rounded-xl bg-neutral-100 px-4 py-3 text-sm outline-none"

              placeholder="École / Université"

              value={signupUniversity}

              onChange={(e) => setSignupUniversity(e.target.value)}

            />

            <input

              className="w-full rounded-xl bg-neutral-100 px-4 py-3 text-sm outline-none"

              placeholder="Adresse email"

              type="email"

              value={signupEmail}

              onChange={(e) => setSignupEmail(e.target.value)}

              required

            />

            <input className="w-full rounded-xl bg-neutral-100 px-4 py-3 text-sm outline-none" placeholder="Mot de passe" type="password" />



            <button type="submit" className="mt-2 w-full rounded-2xl bg-[var(--sw-orange)] py-3.5 text-base font-bold text-black">

              S&apos;inscrire

            </button>

          </form>

        ) : (

          <form className="mt-5 space-y-3" onSubmit={handleLogin}>

            <input

              className="w-full rounded-xl bg-neutral-100 px-4 py-3 text-sm outline-none"

              placeholder="Adresse email"

              type="email"

              value={loginEmail}

              onChange={(e) => setLoginEmail(e.target.value)}

              required

            />

            <input className="w-full rounded-xl bg-neutral-100 px-4 py-3 text-sm outline-none" placeholder="Mot de passe" type="password" />



            <button type="submit" className="mt-2 w-full rounded-2xl bg-[var(--sw-orange)] py-3.5 text-base font-bold text-black">

              Se connecter

            </button>

          </form>

        )}



        <p className="mt-4 text-center text-sm text-[var(--sw-muted)]">

          {mode === 'signup' ? 'Déjà un compte ?' : 'Pas encore de compte ?'}{' '}

          <button type="button" onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')} className="font-semibold text-[var(--sw-orange)]">

            {mode === 'signup' ? 'Se connecter' : "S'inscrire"}

          </button>

        </p>

      </div>



      <div className="relative mx-auto mt-8 flex max-w-md items-center justify-center gap-3">

        <div className="flex -space-x-2">

          {users.slice(0, 4).map((user) => (

            <AvatarImage key={user.id} name={userFullName(user)} size={64} className="h-8 w-8 ring-2 ring-white/80" />

          ))}

        </div>

        <span className="rounded-full bg-sky-500 px-2 py-0.5 text-xs font-bold text-white">+2,4k</span>

        <span className="text-xs text-white/90">

          Rejoins {users.length > 0 ? `${users.length}+` : '2 400+'} étudiants qui échangent leurs compétences aujourd&apos;hui

        </span>

      </div>



      <Link to="/" className="relative mx-auto mt-6 block text-center text-sm font-semibold text-white/80 hover:text-white">

        ← Retour à l&apos;accueil

      </Link>

    </div>

  )

}


