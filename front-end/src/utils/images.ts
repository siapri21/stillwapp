/** IDs de photos Unsplash (CDN — source.unsplash.com est hors service). */
const photos: Record<string, string> = {
  coding: '1498050108023-c5249f4df085',
  design: '1561070791-2526d30994b5',
  photography: '1452587925148-ce544e77ee70',
  language: '1546410531-bb4caa6e4247',
  music: '1511379938543-c1f69419868d',
  cooking: '1556910103-1c02745aae4d',
  skills: '1522202176988-66273c2fd55f',
  react: '1633356122544-f134324a6cee',
  ui: '1586717799231-816b978721ab',
  data: '1551288049-bebda4e38f71',
  pottery: '1578662996442-48f60103fc96',
  marketing: '1557838923-56a781388279',
  video: '1574710013094-9a9c243e2a0a',
  photoshop: '1542038784456-1cf308f66e00',
  maths: '1635077072172-43a8c9a2a7c5',
  hero: '1522202176988-66273c2fd55f',
  campus: '1523050856448-2759adffadfb',
  challenge: '1517245386807-bb43a82910c7',
  trophy: '1513151232409-29a492ff1268',
  french: '1546410531-bb4caa6e4247',
  guitar: '1511379938543-c1f69419868d',
}

const portraits = [
  '1507003211169-0a1dd7228f2d',
  '1534528741775-53994a69daeb',
  '1506794778202-cad84cf45f1d',
  '1494790108377-be9c29b29330',
  '1438761681033-6461ffad8d80',
  '1472099645785-5658abf4ff4e',
  '1519344809611-ae4b5fad7915',
  '1524504388940-b1c1722653fe',
  '1500648767791-00dcc994a43e',
  '1539574510400-0361a4d4b6d2',
]

const tagKeywords: Record<string, string> = {
  Tech: 'coding',
  Design: 'design',
  Photo: 'photography',
  Langues: 'language',
  Musique: 'music',
  Cuisine: 'cooking',
  Growth: 'language',
}

const categoryKeywords: Record<string, string> = {
  Développement: 'coding',
  Design: 'design',
  Langues: 'language',
  Musique: 'music',
  Photographie: 'photography',
  Cuisine: 'cooking',
}

function hashString(value: string) {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

function photoUrl(photoId: string, width = 400, height = 200) {
  return `https://images.unsplash.com/photo-${photoId}?w=${width}&h=${height}&fit=crop&auto=format&q=80`
}

function resolveKeyword(raw: string): string {
  const key = raw.toLowerCase().trim()
  if (photos[key]) return key

  if (key.includes('code') || key.includes('python') || key.includes('javascript') || key.includes('react')) {
    return key.includes('react') ? 'react' : 'coding'
  }
  if (key.includes('design') || key.includes('ui') || key.includes('ux') || key.includes('figma')) return 'design'
  if (key.includes('photo') || key.includes('lightroom') || key.includes('premiere') || key.includes('davinci')) {
    return 'video'
  }
  if (key.includes('lang') || key.includes('espagnol') || key.includes('mandarin') || key.includes('french')) {
    return 'language'
  }
  if (key.includes('music') || key.includes('piano') || key.includes('jazz') || key.includes('guitar')) return 'music'
  if (key.includes('cuisin') || key.includes('cook') || key.includes('food')) return 'cooking'
  if (key.includes('data')) return 'data'
  if (key.includes('pottery')) return 'pottery'
  if (key.includes('market')) return 'marketing'
  if (key.includes('video') || key.includes('montage') || key.includes('editing')) return 'video'
  if (key.includes('math')) return 'maths'
  if (key.includes('speaking') || key.includes('public')) return 'skills'
  if (key.includes('web')) return 'coding'

  return 'skills'
}

export function unsplashUrl(keyword: string, width = 400, height = 200) {
  const resolved = resolveKeyword(keyword)
  const photoId = photos[resolved] ?? photos.skills
  return photoUrl(photoId, width, height)
}

export function imageForTag(tag: string, width = 400, height = 200) {
  const keyword = tagKeywords[tag] ?? tag.toLowerCase()
  return unsplashUrl(keyword, width, height)
}

export function imageForCategory(category: string, width = 400, height = 200) {
  const keyword = categoryKeywords[category] ?? category.toLowerCase()
  return unsplashUrl(keyword, width, height)
}

export function imageForPerson(name: string, size = 96) {
  const photoId = portraits[hashString(name) % portraits.length]
  return photoUrl(photoId, size, size)
}

export function imageForHero(width = 900, height = 400) {
  return photoUrl(photos.hero, width, height)
}

export function imageForCampus(width = 900, height = 500) {
  return photoUrl(photos.campus, width, height)
}

export function imageForChallenge(width = 800, height = 300) {
  return photoUrl(photos.challenge, width, height)
}

export function imageForBadge(title: string, size = 112) {
  return unsplashUrl(title, size, size)
}
