export type ExploreCategory =
  | 'Développement'
  | 'Design'
  | 'Langues'
  | 'Musique'
  | 'Photographie'
  | 'Cuisine'

export const exploreCategories: Array<{
  id: ExploreCategory
  title: ExploreCategory
  tint: 'mint' | 'lavender' | 'ice' | 'peach' | 'slate'
  icon: 'code' | 'pen' | 'translate' | 'music' | 'camera' | 'food'
}> = [
  { id: 'Développement', title: 'Développement', tint: 'mint', icon: 'code' },
  { id: 'Design', title: 'Design', tint: 'lavender', icon: 'pen' },
  { id: 'Langues', title: 'Langues', tint: 'ice', icon: 'translate' },
  { id: 'Musique', title: 'Musique', tint: 'peach', icon: 'music' },
  { id: 'Photographie', title: 'Photographie', tint: 'slate', icon: 'camera' },
  { id: 'Cuisine', title: 'Cuisine', tint: 'mint', icon: 'food' },
]
