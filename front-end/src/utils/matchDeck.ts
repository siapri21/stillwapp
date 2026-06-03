const PASSED_KEY = 'skillwapp_passed_match_ids'

export function readPassedMatchIds(): number[] {
  try {
    const raw = sessionStorage.getItem(PASSED_KEY)
    const parsed = raw ? (JSON.parse(raw) as unknown) : []
    return Array.isArray(parsed) ? parsed.map(Number).filter((n) => !Number.isNaN(n)) : []
  } catch {
    return []
  }
}

export function markMatchPassed(matchId: number) {
  const ids = readPassedMatchIds()
  if (ids.includes(matchId)) return
  sessionStorage.setItem(PASSED_KEY, JSON.stringify([...ids, matchId]))
}

export function conversationIdForPartner(
  conversations: { id: number; participantIds: number[] }[],
  meId: number,
  partnerId: number,
): number | null {
  const conv = conversations.find((c) => {
    const ids = c.participantIds.map(Number)
    return ids.includes(meId) && ids.includes(partnerId)
  })
  return conv?.id ?? null
}
