import { CoverImage } from './CoverImage.tsx'
import { imageForPerson } from '../utils/images.ts'

type AvatarImageProps = {
  name: string
  size?: number
  className?: string
  rounded?: 'full' | '2xl' | 'xl'
}

const roundedClass = {
  full: 'rounded-full',
  '2xl': 'rounded-2xl',
  xl: 'rounded-xl',
}

export function AvatarImage({ name, size = 96, className = '', rounded = 'full' }: AvatarImageProps) {
  return (
    <CoverImage
      src={imageForPerson(name, size)}
      alt={name}
      className={[roundedClass[rounded], 'object-cover', className].join(' ')}
    />
  )
}
