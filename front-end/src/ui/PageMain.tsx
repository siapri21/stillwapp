import type { ReactNode } from 'react'

type PageMainProps = {
  children: ReactNode
  className?: string
}

/**
 * Mobile / tablette : max-w-6xl centré (design inchangé).
 * Desktop (lg+) : pleine largeur du shell parent (marges 10 % via MainLayout).
 */
export function PageMain({ children, className = '' }: PageMainProps) {
  return (
    <main
      className={[
        'mx-auto w-full max-w-6xl px-4 pb-28 pt-4 md:px-6',
        'lg:mx-0 lg:max-w-none lg:px-0 lg:pb-12 lg:pt-6',
        className,
      ].join(' ')}
    >
      {children}
    </main>
  )
}
