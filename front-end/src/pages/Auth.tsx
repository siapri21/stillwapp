import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { AvatarImage } from '../ui/AvatarImage.tsx'
import { CoverImage } from '../ui/CoverImage.tsx'
import { imageForCampus } from '../utils/images.ts'

const studentNames = ['Luna Storm', 'Kai Jensen', 'Aria Vane', 'Jordan Chen']

export function Auth() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'signup' | 'login'>('signup')

  return (
    <div className="relative min-h-dvh px-4 py-8">
      <CoverImage src={imageForCampus()} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,122,55,0.88),rgba(230,0,126,0.92))]" />

      <div className="relative mx-auto max-w-md text-center">
        <img src="/logoskillwapp.png" alt="SkillWapp" className="mx-auto h-14 w-14 rounded-2xl object-cover shadow-lg ring-2 ring-white/30" />
        <p className="mt-4 text-sm font-medium text-white/90">
          Unlock campus potential through peer learning.
        </p>
      </div>

      <div className="relative mx-auto mt-6 max-w-md rounded-3xl bg-white p-5 shadow-xl md:p-7">
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-neutral-100 p-1">
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={[
              'rounded-xl py-2.5 text-sm font-semibold',
              mode === 'signup' ? 'bg-black text-[var(--sw-orange)]' : 'text-[var(--sw-muted)]',
            ].join(' ')}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => setMode('login')}
            className={[
              'rounded-xl py-2.5 text-sm font-semibold',
              mode === 'login' ? 'bg-black text-[var(--sw-orange)]' : 'text-[var(--sw-muted)]',
            ].join(' ')}
          >
            Log In
          </button>
        </div>

        {mode === 'signup' ? (
          <form className="mt-5 space-y-3" onSubmit={(e) => { e.preventDefault(); navigate('/') }}>
            <div className="grid grid-cols-2 gap-3">
              <input className="rounded-xl bg-neutral-100 px-4 py-3 text-sm outline-none" placeholder="Name" />
              <input className="rounded-xl bg-neutral-100 px-4 py-3 text-sm outline-none" placeholder="Surname" />
            </div>
            <input className="w-full rounded-xl bg-neutral-100 px-4 py-3 text-sm outline-none" placeholder="School / University" />
            <input className="w-full rounded-xl bg-neutral-100 px-4 py-3 text-sm outline-none" placeholder="Email Address" type="email" />
            <input className="w-full rounded-xl bg-neutral-100 px-4 py-3 text-sm outline-none" placeholder="Password" type="password" />

            <div>
              <div className="text-sm font-semibold text-[var(--sw-orange)]">Skills to Teach</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {['Python', 'UX Design', 'Photography', 'French'].map((s) => (
                  <span key={s} className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">{s}</span>
                ))}
                <button type="button" className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-[var(--sw-orange)]">+ Add</button>
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-emerald-600">Skills to Learn</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {['Web Dev', 'Guitar', 'Marketing'].map((s) => (
                  <span key={s} className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{s}</span>
                ))}
                <button type="button" className="rounded-full bg-[var(--sw-yellow)] px-3 py-1 text-xs font-semibold text-emerald-700">+ Add</button>
              </div>
            </div>

            <button type="submit" className="mt-2 w-full rounded-2xl bg-[var(--sw-orange)] py-3.5 text-base font-bold text-black">
              Sign Up
            </button>
          </form>
        ) : (
          <form className="mt-5 space-y-3" onSubmit={(e) => { e.preventDefault(); navigate('/') }}>
            <input className="w-full rounded-xl bg-neutral-100 px-4 py-3 text-sm outline-none" placeholder="Email Address" type="email" />
            <input className="w-full rounded-xl bg-neutral-100 px-4 py-3 text-sm outline-none" placeholder="Password" type="password" />
            <button type="submit" className="mt-2 w-full rounded-2xl bg-[var(--sw-orange)] py-3.5 text-base font-bold text-black">
              Log In
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-sm text-[var(--sw-muted)]">
          Already have an account?{' '}
          <button type="button" onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')} className="font-semibold text-[var(--sw-orange)]">
            {mode === 'signup' ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>

      <div className="relative mx-auto mt-8 flex max-w-md items-center justify-center gap-3">
        <div className="flex -space-x-2">
          {studentNames.map((name) => (
            <AvatarImage key={name} name={name} size={64} className="h-8 w-8 ring-2 ring-white/80" />
          ))}
        </div>
        <span className="rounded-full bg-sky-500 px-2 py-0.5 text-xs font-bold text-white">+2.4k</span>
        <span className="text-xs text-white/90">Join 2,400+ students swapping skills today</span>
      </div>

      <Link to="/" className="relative mx-auto mt-6 block text-center text-sm font-semibold text-white/80 hover:text-white">
        ← Retour à l&apos;accueil
      </Link>
    </div>
  )
}
