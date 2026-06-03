import { GraduationCap, MapPin, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export type CommunityStats = {
  students: number
  skills: number
  radiusKm: number
}

export function CommunityCounter({ stats }: { stats: CommunityStats }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm md:p-6">
      <h2 className="font-display text-base leading-snug tracking-wide text-[var(--sw-text-strong)] md:text-lg">
        Rencontre des talents sur ton campus
      </h2>

      <div className="mt-5 grid grid-cols-3 gap-4 sm:gap-6">
        <StatItem
          icon={<GraduationCap className="h-5 w-5 text-[var(--sw-pink)]" strokeWidth={2} />}
          value={String(stats.students)}
          label="étudiants"
        />
        <StatItem
          icon={<Sparkles className="h-5 w-5 text-[var(--sw-pink)]" strokeWidth={2} />}
          value={String(stats.skills)}
          label="compétences"
        />
        <StatItem
          icon={<MapPin className="h-5 w-5 text-[var(--sw-pink)]" strokeWidth={2} />}
          value={`${stats.radiusKm} km`}
          label="rayon campus"
        />
      </div>

      <p className="mt-5 text-center text-xs text-[var(--sw-muted)] md:text-sm">
        Connecte-toi pour voir qui est disponible autour de toi.
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <Button asChild variant="outline" size="sm" className="h-9 px-4 text-xs">
          <Link to="/auth?from=%2F&mode=login">Se connecter</Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="h-9 px-4 text-xs">
          <Link to="/auth?from=%2F&mode=signup">Créer un compte</Link>
        </Button>
      </div>
    </div>
  )
}

function StatItem({
  icon,
  value,
  label,
}: {
  icon: ReactNode
  value: string
  label: string
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-2 grid h-10 w-10 place-items-center rounded-full bg-[var(--sw-pink)]/8">{icon}</div>
      <div className="font-display text-xl text-[var(--sw-pink)] md:text-2xl">{value}</div>
      <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--sw-muted)] md:text-xs">
        {label}
      </div>
    </div>
  )
}
