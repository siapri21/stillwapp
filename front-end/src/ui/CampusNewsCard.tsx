import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AvatarImage } from './AvatarImage.tsx'
import { CoverImage } from './CoverImage.tsx'
import { unsplashUrl } from '../utils/images.ts'

export type CampusNewsItem = {
  id: number
  author: string
  skill: string
  with: string
  time: string
  validated: boolean
  category?: string
  likes: number
  comments: number
  quote?: string
  image?: string | null
}

export function CampusNewsCard({ post, feedHref = '/feed' }: { post: CampusNewsItem; feedHref?: string }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition hover:shadow-md hover:ring-[var(--sw-pink)]/20">
      {post.quote ? (
        <CardHeader className="pb-2">
          <div className="flex items-start gap-3">
            <AvatarImage name={post.author} size={64} className="h-10 w-10 shrink-0" />
            <div className="min-w-0">
              <CardTitle className="text-sm font-semibold">{post.author}</CardTitle>
              <p className="mt-1 line-clamp-3 text-sm italic text-[var(--sw-muted)]">&laquo; {post.quote} &raquo;</p>
            </div>
          </div>
        </CardHeader>
      ) : (
        <div className="relative h-36 shrink-0">
          <CoverImage
            src={post.image ?? unsplashUrl(post.skill, 400, 200)}
            className="h-full w-full object-cover"
          />
          {post.category ? (
            <Badge variant="accent" className="absolute bottom-2 right-2">
              {post.category}
            </Badge>
          ) : null}
        </div>
      )}

      <CardHeader className={post.quote ? 'pt-0' : ''}>
        <div className="flex items-start justify-between gap-2">
          {!post.quote ? (
            <div className="flex items-center gap-2">
              <AvatarImage name={post.author} size={64} className="h-9 w-9" />
              <div>
                <CardTitle className="text-sm">{post.author}</CardTitle>
                <p className="text-xs text-[var(--sw-muted)]">avec {post.with}</p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[var(--sw-muted)]">avec {post.with}</p>
          )}
          {post.validated ? <Badge variant="secondary">Validé</Badge> : null}
        </div>
        <p className="mt-2 text-sm text-[var(--sw-text)]">
          A appris <span className="font-semibold text-[var(--sw-pink)]">{post.skill}</span>
          <span className="text-[var(--sw-muted)]"> · {post.time}</span>
        </p>
      </CardHeader>

      <CardContent className="mt-auto pt-0">
        <div className="flex gap-4 text-xs text-[var(--sw-muted)]">
          <span>♥ {post.likes}</span>
          <span>💬 {post.comments}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link to={feedHref}>Voir le fil</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
