export type LevelTier = 'debutant' | 'intermediaire' | 'expert'

export type LevelBadgeInfo = {
  tier: LevelTier
  label: string
  emoji: string
  color: string
  ring: string
  description: string
}

export const LEVEL_BADGES: Record<LevelTier, LevelBadgeInfo> = {
  debutant: {
    tier: 'debutant',
    label: 'Débutant',
    emoji: '🟢',
    color: '#22c55e',
    ring: 'ring-emerald-400/50',
    description: 'Profil créé, moins de 3 swaps réalisés.',
  },
  intermediaire: {
    tier: 'intermediaire',
    label: 'Intermédiaire',
    emoji: '🟡',
    color: '#eab308',
    ring: 'ring-[var(--sw-yellow)]/60',
    description: 'Entre 3 et 10 swaps avec une note ≥ 3/5.',
  },
  expert: {
    tier: 'expert',
    label: 'Expert',
    emoji: '🔴',
    color: '#e6007e',
    ring: 'ring-[var(--sw-pink)]/40',
    description: 'Plus de 10 swaps avec une note ≥ 4/5.',
  },
}

export function computeLevelTier(swaps: number, rating: number): LevelTier {
  if (swaps > 10 && rating >= 4) return 'expert'
  if (swaps >= 3 && swaps <= 10 && rating >= 3) return 'intermediaire'
  return 'debutant'
}

export function allLevelBadges(swaps: number, rating: number) {
  const current = computeLevelTier(swaps, rating)
  return (['debutant', 'intermediaire', 'expert'] as const).map((tier) => ({
    ...LEVEL_BADGES[tier],
    active: tier === current,
  }))
}
