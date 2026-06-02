export type ExploreCategory =
  | 'Développement'
  | 'Design'
  | 'Langues'
  | 'Musique'
  | 'Photographie'
  | 'Cuisine'

export type Skill = {
  id: string
  tag: string
  title: string
  subtitle: string
  rating: number
  category: string
  exploreCategory: ExploreCategory
  author: string
  authorRole: string
  description: string
  learnings: Array<{ title: string; subtitle: string; tint: 'green' | 'purple' | 'blue' }>
  reviews: Array<{ name: string; role: string; rating: number; text: string }>
}

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

export type Peer = {
  id: string
  name: string
  offer: string
  distance: string
  place: string
  rating: number
  online?: boolean
}

export type Match = {
  id: string
  name: string
  location: string
  distance: string
  matchPercent: number
  hasSkill: string
  wantsSkill: string
}

export type Session = {
  id: string
  name: string
  title: string
  status: 'Confirmed' | 'Pending' | 'Completed'
  when: string
  place: string
}

export type FeedPost = {
  id: string
  author: string
  skill: string
  with: string
  time: string
  validated: boolean
  category?: string
  likes: number
  comments: number
  quote?: string
}

export const skills: Skill[] = [
  {
    id: 'python-scripting',
    tag: 'Tech',
    title: 'Python Scripting',
    subtitle: 'Automatise tes tâches en 5 séances.',
    rating: 4.9,
    category: 'Tech & Creative',
    exploreCategory: 'Développement',
    author: 'Alex',
    authorRole: 'M1 Design',
    description:
      "Apprends à prototyper comme un pro sur Figma. Je t'apprends les bases (Auto-layout, Components, Prototypage) en échange de cours de JavaScript pour m'aider sur mes projets web.",
    learnings: [
      { title: 'Auto-layout Expert', subtitle: 'Maîtriser les grilles fluides', tint: 'green' },
      { title: 'Components', subtitle: 'Systèmes réutilisables', tint: 'purple' },
      { title: 'Prototyping', subtitle: 'Micro-interactions', tint: 'blue' },
    ],
    reviews: [
      {
        name: 'Léa',
        role: 'L3 Info',
        rating: 5,
        text: 'Super session, Alex explique très bien et adapte le rythme.',
      },
    ],
  },
  {
    id: 'ui-design',
    tag: 'Design',
    title: 'UI Design',
    subtitle: 'Crée des interfaces clean.',
    rating: 5.0,
    category: 'Tech & Creative',
    exploreCategory: 'Design',
    author: 'Sofia',
    authorRole: 'M2 UX',
    description: 'Design systems, composants réutilisables et bonnes pratiques Figma pour des interfaces modernes.',
    learnings: [
      { title: 'Design System', subtitle: 'Tokens & composants', tint: 'purple' },
      { title: 'Wireframes', subtitle: 'Structure avant le visuel', tint: 'green' },
      { title: 'Handoff Dev', subtitle: 'Specs pour les devs', tint: 'blue' },
    ],
    reviews: [{ name: 'Marc', role: 'L2 Dev', rating: 5, text: 'Parfait pour mon projet de fin d\'année.' }],
  },
  {
    id: 'lightroom',
    tag: 'Photo',
    title: 'Lightroom',
    subtitle: 'Retouche rapide et pro.',
    rating: 4.7,
    category: 'Creative Arts',
    exploreCategory: 'Photographie',
    author: 'Emma',
    authorRole: 'L3 Photo',
    description: 'Retouche portrait, presets et workflow Lightroom pour des photos pro en quelques clics.',
    learnings: [
      { title: 'Presets', subtitle: 'Créer ton style', tint: 'green' },
      { title: 'Portrait', subtitle: 'Peau & lumière', tint: 'purple' },
      { title: 'Export', subtitle: 'Formats optimisés', tint: 'blue' },
    ],
    reviews: [{ name: 'Julie', role: 'M1 Art', rating: 4.5, text: 'Très pratique, j\'ai appris plein de raccourcis.' }],
  },
  {
    id: 'figma-prototyping',
    tag: 'Design',
    title: 'Prototypage UI/UX sur Figma',
    subtitle: 'Du wireframe au prototype interactif.',
    rating: 4.9,
    category: 'Tech & Creative',
    exploreCategory: 'Design',
    author: 'Alex',
    authorRole: 'M1 Design',
    description:
      "Apprends à prototyper comme un pro sur Figma. Auto-layout, Components et Prototypage en échange de cours JavaScript.",
    learnings: [
      { title: 'Auto-layout Expert', subtitle: 'Maîtriser les grilles fluides', tint: 'green' },
      { title: 'Components', subtitle: 'Systèmes réutilisables', tint: 'purple' },
      { title: 'Prototyping', subtitle: 'Micro-interactions', tint: 'blue' },
    ],
    reviews: [
      { name: 'Léa', role: 'L3 Info', rating: 5, text: 'Session top, j\'ai enfin compris les variants.' },
    ],
  },
  {
    id: 'espagnol-conversation',
    tag: 'Langues',
    title: 'Espagnol conversationnel',
    subtitle: 'Parler couramment en 4 séances.',
    rating: 4.8,
    category: 'Langues',
    exploreCategory: 'Langues',
    author: 'Lucas M.',
    authorRole: 'L2 Lettres',
    description: 'Sessions de conversation pour gagner en fluidité et en confiance à l\'oral.',
    learnings: [
      { title: 'Prononciation', subtitle: 'Accent et intonation', tint: 'green' },
      { title: 'Vocabulaire', subtitle: 'Expressions du quotidien', tint: 'purple' },
    ],
    reviews: [{ name: 'Nina', role: 'M1 Eco', rating: 4.9, text: 'Ambiance détendue, j\'ai adoré.' }],
  },
  {
    id: 'piano-jazz',
    tag: 'Musique',
    title: 'Master Class Piano Jazz',
    subtitle: 'Improvisation et harmonies.',
    rating: 4.9,
    category: 'Musique',
    exploreCategory: 'Musique',
    author: 'Lucas M.',
    authorRole: 'M2 Musique',
    description: 'Apprends les bases du jazz au piano : accords, gammes et improvisation.',
    learnings: [
      { title: 'Accords jazz', subtitle: '7ème et extensions', tint: 'purple' },
      { title: 'Impro', subtitle: 'Phrases mélodiques', tint: 'blue' },
    ],
    reviews: [{ name: 'Tom', role: 'L3 Art', rating: 5, text: 'Lucas est un super pédagogue.' }],
  },
  {
    id: 'cuisine-italienne',
    tag: 'Cuisine',
    title: 'Cuisine italienne',
    subtitle: 'Pâtes fraîches & sauces maison.',
    rating: 4.6,
    category: 'Cuisine',
    exploreCategory: 'Cuisine',
    author: 'Giulia R.',
    authorRole: 'L3 Hôtellerie',
    description: 'Atelier pratique pour préparer pâtes fraîches et sauces authentiques.',
    learnings: [
      { title: 'Pâtes fraîches', subtitle: 'Technique et texture', tint: 'green' },
      { title: 'Sauces', subtitle: 'Base tomate & crème', tint: 'blue' },
    ],
    reviews: [{ name: 'Paul', role: 'M1 Droit', rating: 4.7, text: 'Délicieux et très fun.' }],
  },
]

export const peers: Peer[] = [
  { id: '1', name: 'Léo Bernard', offer: 'Montage Vidéo', distance: '500m', place: 'Campus Centre', rating: 4.8, online: true },
  { id: '2', name: 'Sarah Klift', offer: 'Photoshop Masterclass', distance: '1.2km', place: 'Résidence A', rating: 5.0 },
  { id: '3', name: 'Marc Dubois', offer: 'Maths (Prépa)', distance: '2.5km', place: 'Bibliothèque', rating: 4.6 },
]

export const matches: Match[] = [
  { id: '1', name: 'Alex Rivera', location: 'Campus Library', distance: '200m away', matchPercent: 98, hasSkill: 'UI Design', wantsSkill: 'Python' },
  { id: '2', name: 'Jordan Chen', location: 'Résidence B', distance: '450m away', matchPercent: 85, hasSkill: 'Data Science', wantsSkill: 'Mandarin' },
  { id: '3', name: 'Mia Thompson', location: 'Atelier Arts', distance: '800m away', matchPercent: 72, hasSkill: 'Pottery', wantsSkill: 'Marketing' },
]

export const sessions: Session[] = [
  { id: '1', name: 'Alex Rivera', title: 'UI/UX Design Basics', status: 'Confirmed', when: 'Today, 4:00 PM', place: 'Zoom Link' },
  { id: '2', name: 'Jordan Chen', title: 'Data Structures', status: 'Pending', when: 'Tomorrow, 10:30 AM', place: 'Main Library, Room 402' },
  { id: '3', name: 'Mia Thompson', title: 'Public Speaking', status: 'Completed', when: 'Skill Level Up!', place: 'Leave Review' },
]

export const feedPosts: FeedPost[] = [
  {
    id: '1',
    author: 'Alex Chen',
    skill: 'React Hooks',
    with: 'Sarah M.',
    time: '2h ago',
    validated: true,
    category: 'Tech Mastery',
    likes: 24,
    comments: 8,
  },
  {
    id: '2',
    author: 'Maya M.',
    skill: 'Espagnol conversation',
    with: 'Lucas P.',
    time: '5h ago',
    validated: true,
    likes: 12,
    comments: 3,
    quote: 'Super échange ! J\'ai progressé en 1h plus qu\'en 1 semaine de cours.',
  },
  {
    id: '3',
    author: 'Jordan Lee',
    skill: 'UI Design',
    with: 'Emma B.',
    time: '1d ago',
    validated: true,
    category: 'Creative Arts',
    likes: 31,
    comments: 12,
  },
]

export function getSkillById(id: string): Skill | undefined {
  return skills.find((s) => s.id === id)
}
