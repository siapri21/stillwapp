export type ApiUser = {
  id: number
  name: string
  surname: string
  university: string
  email: string
  avatar: string
  color: string
  rating: number
  swaps: number
  friends: number
  level: number
  xp: number
  xpNext: number
  title: string
  online?: boolean
  location: string
  distance: string
}

export type ApiSkill = {
  id: number
  userId: number
  title: string
  category: string
  description: string
  image: string
  duration: string
  rating: number
  swapCount?: number
  swaps?: number
  tags: string[]
  learnings: string[]
  reviews: Array<{ author: string; rating: number; comment: string }>
}

export type ApiSession = {
  id: number
  userId: number
  skillId: number
  skill: string
  status: 'confirmed' | 'pending' | 'completed'
  date: string
  time: string
  location: string
  locationIcon: string
}

export type ApiMatch = {
  id: number
  userId: number
  hasSkill: string
  wantsSkill: string
  matchPercent: number
  location: string
  distance: string
}

export type ApiFeedPost = {
  id: number
  userId: number
  action: string
  skill: string
  partner: string
  time: string
  image: string | null
  category: string | null
  validated: boolean
  likes: number
  comments: number
  endorsements?: number
  quote?: string
}

export type ApiBadge = {
  id: number
  name: string
  icon: string
  color: string
  unlocked: boolean
}

export type ApiLeaderboardEntry = {
  userId: number
  rank: number
  xp: number
  trend: 'up' | 'down' | 'stable'
}

export type ApiChallenge = {
  id: number
  title: string
  reward: number
  type: string
  active: boolean
}

export type ApiCurrentUser = {
  id: number
  name: string
  surname: string
  university: string
  avatar: string
  color: string
  level: number
  xp: number
  xpNext: number
  title: string
  streak: number
  totalPoints: number
  rank: number
  rating: number
  swaps: number
  friends: number
}

export function userFullName(user: Pick<ApiUser, 'name' | 'surname'>) {
  return `${user.name} ${user.surname}`
}

export function findUser(users: ApiUser[], id: number) {
  return users.find((u) => u.id === id)
}
