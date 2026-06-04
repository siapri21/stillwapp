import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Modal } from './Modal.tsx'
import { AvatarImage } from './AvatarImage.tsx'

type PeerRowProps = {
  id: string
  name: string
  offer: string
  distance: string
  place: string
  rating: number
  online?: boolean
}

export function PeerRow({ id, name, offer, distance, place, rating, online }: PeerRowProps) {
  const [messageOpen, setMessageOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const openMessage = () => {
    setMessage(`Salut ${name.split(' ')[0]} ! Je suis intéressé(e) par ton offre « ${offer} ». On peut en discuter ?`)
    setSent(false)
    setMessageOpen(true)
  }

  const handleSend = () => {
    setSent(true)
    window.setTimeout(() => {
      setMessageOpen(false)
      setSent(false)
    }, 1500)
  }

  return (
    <>
      <div className="flex items-center gap-3 px-4 py-3">
        <Link to={`/user/${id}`} className="relative shrink-0" aria-label={`Profil de ${name}`}>
          <AvatarImage name={name} size={96} rounded="2xl" className="h-12 w-12 transition hover:ring-2 hover:ring-[var(--sw-pink)]/40" />
          {online ? (
            <span className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          ) : null}
        </Link>

        <div className="min-w-0 flex-1 text-left">
          <div className="flex items-center justify-between gap-3">
            <Link to={`/user/${id}`} className="truncate text-sm font-semibold text-[var(--sw-text-strong)] hover:text-[var(--sw-pink)]">
              {name}
            </Link>
            <div className="flex items-center gap-1 text-[var(--sw-text-strong)]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 17.3l-5.3 3 1.5-6-4.7-4.1 6.2-.5L12 4l2.3 5.7 6.2.5-4.7 4.1 1.5 6-5.3-3Z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-xs font-semibold">{rating.toFixed(1)}</span>
            </div>
          </div>

          <div className="mt-0.5 truncate text-xs text-[var(--sw-muted)]">
            Propose : <span className="font-semibold text-[var(--sw-pink)]">{offer}</span>
          </div>
          <div className="mt-0.5 truncate text-xs text-[var(--sw-muted)]">
            À {distance}, {place}
          </div>
        </div>

        <button
          type="button"
          onClick={openMessage}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[var(--sw-text-strong)] ring-1 ring-black/5 hover:bg-black/5 active:bg-black/10"
          aria-label={`Contacter ${name}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M8 10h8M8 14h5M21 12a8.5 8.5 0 0 1-8.5 8.5H6l-3 1.5 1.2-3A8.5 8.5 0 1 1 21 12Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <Modal open={messageOpen} onClose={() => setMessageOpen(false)} title={`Message à ${name.split(' ')[0]}`}>
        {sent ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-2xl">✓</div>
            <p className="text-base font-semibold text-[var(--sw-text-strong)]">Message envoyé !</p>
          </div>
        ) : (
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
          >
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full resize-none rounded-2xl bg-[var(--sw-bg)] p-3 text-sm text-[var(--sw-text-strong)] outline-none ring-1 ring-black/5 focus:ring-[var(--sw-pink)]"
              aria-label="Message"
            />
            <button
              type="submit"
              className="rounded-2xl bg-[var(--sw-pink)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-95"
            >
              Envoyer
            </button>
          </form>
        )}
      </Modal>
    </>
  )
}
