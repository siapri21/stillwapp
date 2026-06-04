import { useState } from 'react'
import { Heart, MessageCircle, ThumbsUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { AvatarImage } from './AvatarImage.tsx'
import { CoverImage } from './CoverImage.tsx'
import { unsplashUrl } from '../utils/images.ts'

export type FeedPostItem = {
  id: number
  author: string
  skill: string
  with: string
  time: string
  validated: boolean
  category?: string
  likes: number
  comments: number
  endorsements: number
  quote?: string
  image?: string | null
}

export function FeedPostCard({ post }: { post: FeedPostItem }) {
  const [liked, setLiked] = useState(false)
  const [endorsed, setEndorsed] = useState(false)
  const likeCount = post.likes + (liked ? 1 : 0)
  const endorsementCount = post.endorsements + (endorsed ? 1 : 0)

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-2xl border-black/5 shadow-[0_8px_30px_rgba(25,22,36,0.06)]">
      <div className="flex items-start gap-2.5 p-3 pb-2">
        <AvatarImage name={post.author} size={80} className="h-9 w-9 shrink-0 ring-2 ring-white" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-1.5">
            <p className="text-sm leading-tight text-[var(--sw-text-strong)]">{post.author}</p>
            {post.validated ? (
              <Badge variant="secondary" className="shrink-0 px-2 py-0 text-[9px] uppercase">
                Validé
              </Badge>
            ) : null}
          </div>
          <p className="mt-0.5 text-sm leading-tight text-[var(--sw-pink)]">{post.skill}</p>
          <p className="mt-1 text-xs text-[var(--sw-muted)]">
            {post.with}, {post.time}
          </p>
        </div>
      </div>

      {post.quote ? (
        <div className="mx-3 mb-3 flex flex-1 items-center rounded-xl bg-gradient-to-br from-violet-50 via-white to-pink-50 px-3 py-4 ring-1 ring-violet-100/80">
          <p className="line-clamp-4 text-center text-sm leading-relaxed text-[var(--sw-text)]">
            &laquo;&nbsp;{post.quote}&nbsp;&raquo;
          </p>
        </div>
      ) : (
        <div className="relative aspect-[4/3] w-full shrink-0">
          <CoverImage
            src={post.image ?? unsplashUrl(post.skill, 600, 450)}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          {post.category ? (
            <Badge variant="accent" className="absolute bottom-2 right-2 px-2 py-0 text-[10px] shadow-sm">
              {post.category}
            </Badge>
          ) : null}
        </div>
      )}

      <CardContent className="mt-auto flex flex-wrap items-center justify-between gap-2 px-3 py-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLiked((v) => !v)}
            className={[
              'inline-flex items-center gap-1 text-sm transition',
              liked ? 'text-[var(--sw-pink)]' : 'text-[var(--sw-muted)] hover:text-[var(--sw-pink)]',
            ].join(' ')}
          >
            <Heart className={`h-3.5 w-3.5 ${liked ? 'fill-current' : ''}`} aria-hidden />
            {likeCount}
          </button>
          <span className="inline-flex items-center gap-1 text-sm text-[var(--sw-muted)]">
            <MessageCircle className="h-3.5 w-3.5" aria-hidden />
            {post.comments}
          </span>
        </div>
        <span className="text-xs text-[var(--sw-muted)]">+{endorsementCount}</span>
      </CardContent>

      <CardFooter className="mt-0 border-t border-black/5 px-3 py-2.5">
        <Button
          type="button"
          variant={endorsed ? 'default' : 'outline'}
          size="sm"
          className="w-full gap-1.5"
          onClick={() => setEndorsed(true)}
          disabled={endorsed}
        >
          <ThumbsUp className="h-3.5 w-3.5" aria-hidden />
          {endorsed ? 'Recommandé' : 'Recommander'}
        </Button>
      </CardFooter>
    </Card>
  )
}
