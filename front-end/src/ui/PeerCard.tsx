import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AvatarImage } from './AvatarImage.tsx'
import { Modal } from './Modal.tsx'

type PeerCardProps = {
  id: string
  name: string
  offer: string
  distance: string
  place: string
  rating: number
  online?: boolean
}

export function PeerCard({ id, name, offer, distance, place, rating, online }: PeerCardProps) {
  const [messageOpen, setMessageOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const openMessage = () => {
    setMessage(`Salut ${name.split(' ')[0]} ! Je suis intéressé(e) par « ${offer} ». On échange ?`)
    setSent(false)
    setMessageOpen(true)
  }

  return (
    <>
      <Card className="flex h-full flex-col transition hover:shadow-md hover:ring-[var(--sw-pink)]/25">
        <CardHeader className="flex-row items-start gap-3 space-y-0">
          <Link to={`/user/${id}`} className="relative shrink-0">
            <AvatarImage name={name} size={128} rounded="2xl" className="h-14 w-14" />
            {online ? (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
            ) : null}
          </Link>
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-base">
              <Link to={`/user/${id}`} className="hover:text-[var(--sw-pink)]">
                {name}
              </Link>
            </CardTitle>
            <div className="mt-1 flex items-center gap-1 text-sm text-[var(--sw-orange)]">
              <span>★</span>
              <span className="font-semibold">{rating.toFixed(1)}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-2">
          <p className="text-sm text-[var(--sw-muted)]">
            Propose{' '}
            <span className="font-semibold text-[var(--sw-pink)]">{offer}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{distance}</Badge>
            <Badge variant="outline">{place}</Badge>
          </div>
        </CardContent>

        <CardFooter className="gap-2">
          <Button asChild variant="outline" className="flex-1">
            <Link to={`/user/${id}`}>Profil</Link>
          </Button>
          <Button type="button" className="flex-1" onClick={openMessage}>
            Contacter
          </Button>
        </CardFooter>
      </Card>

      <Modal open={messageOpen} onClose={() => setMessageOpen(false)} title={`Message à ${name.split(' ')[0]}`}>
        {sent ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-2xl">✓</div>
            <p className="font-semibold text-[var(--sw-text-strong)]">Message envoyé !</p>
          </div>
        ) : (
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              setSent(true)
              window.setTimeout(() => setMessageOpen(false), 1500)
            }}
          >
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full resize-none rounded-xl bg-[var(--sw-bg)] p-3 text-sm outline-none ring-1 ring-black/5"
            />
            <Button type="submit">Envoyer</Button>
          </form>
        )}
      </Modal>
    </>
  )
}
