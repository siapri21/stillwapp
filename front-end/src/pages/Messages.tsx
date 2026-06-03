import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BASE_URL } from '../api/config.js'
import type { ApiConversation, ApiMessage, ApiUser } from '../api/types.ts'
import { userFullName } from '../api/types.ts'
import { AvatarImage } from '../ui/AvatarImage.tsx'
import { PageMain } from '../ui/PageMain.tsx'

export function Messages() {
  const { conversationId } = useParams()
  const [conversations, setConversations] = useState<ApiConversation[]>([])
  const [users, setUsers] = useState<ApiUser[]>([])
  const [messages, setMessages] = useState<ApiMessage[]>([])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)

  const activeId = conversationId ? Number(conversationId) : null

  useEffect(() => {
    Promise.all([
      fetch(`${BASE_URL}/conversations`).then((res) => res.json() as Promise<ApiConversation[]>),
      fetch(`${BASE_URL}/users`).then((res) => res.json() as Promise<ApiUser[]>),
      fetch(`${BASE_URL}/messages`).then((res) => res.json() as Promise<ApiMessage[]>),
    ])
      .then(([convData, usersData, msgData]) => {
        setConversations(convData)
        setUsers(usersData)
        setMessages(msgData)
      })
      .finally(() => setLoading(false))
  }, [])

  const partnerFor = (conv: ApiConversation) => {
    const partnerId = conv.participantIds.find((id) => id !== 1) ?? conv.participantIds[0]
    const user = users.find((u) => u.id === partnerId)
    return user ? userFullName(user) : 'Utilisateur'
  }

  const threadMessages = activeId
    ? messages.filter((m) => m.conversationId === activeId).sort((a, b) => a.id - b.id)
    : []

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft.trim() || !activeId) return
    const newMsg: ApiMessage = {
      id: messages.length + 100,
      conversationId: activeId,
      senderId: 1,
      text: draft.trim(),
      time: 'À l\'instant',
    }
    setMessages((prev) => [...prev, newMsg])
    setDraft('')
  }

  if (activeId) {
    const conv = conversations.find((c) => c.id === activeId)
    const partnerName = conv ? partnerFor(conv) : 'Conversation'

    return (
      <>
        <header className="sticky top-0 z-30 bg-[var(--sw-bg)]/90 backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
            <Link to="/messages" className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5" aria-label="Retour">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <h1 className="flex-1 truncate text-center font-display text-lg text-[var(--sw-text-strong)]">{partnerName}</h1>
            <div className="h-10 w-10" />
          </div>
        </header>

        <PageMain className="flex min-h-[calc(100dvh-8rem)] flex-col pb-32 pt-2 lg:min-h-[70vh]">
          <div className="hidden items-center gap-3 lg:flex">
            <Link to="/messages" className="text-sm font-semibold text-[var(--sw-pink)] hover:underline">
              ← Messages
            </Link>
            <h1 className="font-display text-2xl text-[var(--sw-text-strong)]">{partnerName}</h1>
          </div>

          <div className="mt-4 flex flex-1 flex-col gap-3 overflow-y-auto rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 lg:mt-6">
            {threadMessages.map((m) => {
              const mine = m.senderId === 1
              return (
                <div key={m.id} className={['flex', mine ? 'justify-end' : 'justify-start'].join(' ')}>
                  <div
                    className={[
                      'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm',
                      mine ? 'bg-[var(--sw-pink)] text-white' : 'bg-neutral-100 text-[var(--sw-text-strong)]',
                    ].join(' ')}
                  >
                    <p>{m.text}</p>
                    <span className={`mt-1 block text-[10px] ${mine ? 'text-white/70' : 'text-[var(--sw-muted)]'}`}>
                      {m.time}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <form onSubmit={handleSend} className="mt-4 flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Écrire un message…"
              className="flex-1 rounded-2xl bg-white px-4 py-3 text-sm outline-none ring-1 ring-black/5 focus:ring-[var(--sw-pink)]"
            />
            <button
              type="submit"
              className="rounded-2xl bg-[var(--sw-orange)] px-5 py-3 text-sm font-semibold text-black"
            >
              Envoyer
            </button>
          </form>
        </PageMain>
      </>
    )
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--sw-bg)]/90 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <h1 className="flex-1 text-center font-display text-lg text-[var(--sw-text-strong)]">Messagerie</h1>
        </div>
      </header>

      <PageMain className="pt-2 lg:pt-4">
        <h1 className="hidden font-display text-3xl text-[var(--sw-text-strong)] lg:block">Messagerie</h1>
        <p className="mt-1 hidden text-sm text-[var(--sw-muted)] lg:block">Tes conversations avec les pairs mis en relation.</p>

        <div className="mt-4 flex flex-col gap-3 lg:mt-6 lg:grid lg:grid-cols-2 lg:gap-4">
          {loading ? (
            <p className="text-sm text-[var(--sw-muted)]">Chargement…</p>
          ) : (
            conversations.map((conv) => {
              const name = partnerFor(conv)
              return (
                <Link
                  key={conv.id}
                  to={`/messages/${conv.id}`}
                  className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition hover:ring-[var(--sw-pink)]/30"
                >
                  <AvatarImage name={name} size={96} rounded="2xl" className="h-12 w-12 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-body text-sm font-semibold text-[var(--sw-text-strong)]">{name}</span>
                      <span className="text-xs text-[var(--sw-muted)]">{conv.lastTime}</span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-[var(--sw-muted)]">{conv.lastMessage}</p>
                  </div>
                  {conv.unread ? (
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--sw-pink)]" />
                  ) : null}
                </Link>
              )
            })
          )}
        </div>
      </PageMain>
    </>
  )
}
