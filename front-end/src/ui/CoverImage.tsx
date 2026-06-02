import { useState } from 'react'

type CoverImageProps = {
  src: string
  alt?: string
  className?: string
}

export function CoverImage({ src, alt = '', className = '' }: CoverImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={[
          className,
          'bg-[linear-gradient(135deg,rgba(230,0,126,0.16),rgba(255,122,55,0.18),rgba(255,237,0,0.22))]',
        ].join(' ')}
        role="img"
        aria-label={alt}
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  )
}
