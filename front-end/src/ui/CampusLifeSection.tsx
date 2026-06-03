import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { CoverImage } from './CoverImage.tsx'
import { imageForCampus, imageForChallenge, imageForHero, unsplashUrl } from '../utils/images.ts'

const moments = [
  {
    title: 'Ateliers entre pairs',
    text: 'Design, code, musique — on apprend ensemble sur le campus.',
    image: imageForHero(800, 600),
    className: 'min-h-[220px] sm:col-span-2 sm:row-span-2 sm:min-h-[320px] lg:min-h-0',
  },
  {
    title: 'Café & échanges',
    text: 'Un café, une compétence, un nouveau contact.',
    image: imageForCampus(600, 400),
    className: 'min-h-[160px] lg:min-h-0',
  },
  {
    title: 'Sessions validées',
    text: 'Chaque swap laisse une trace positive dans la communauté.',
    image: imageForChallenge(600, 400),
    className: 'min-h-[160px] lg:min-h-0',
  },
  {
    title: 'Vie étudiante',
    text: 'Bibliothèque, résidence, amphi — le réseau suit ton rythme.',
    image: unsplashUrl('étudiants campus', 700, 400),
    className: 'min-h-[160px] sm:col-span-2 lg:min-h-0',
  },
] as const

export function CampusLifeSection() {
  return (
    <section className="mt-10 pb-4" aria-labelledby="campus-life-heading">
      <div className="mb-4">
        <h2
          id="campus-life-heading"
          className="font-display text-xl text-[var(--sw-text-strong)] md:text-2xl"
        >
          La vie sur le campus
        </h2>
        <p className="mt-1 text-sm text-[var(--sw-muted)]">Moments réels, talents partagés, communauté active</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:grid-rows-[repeat(3,minmax(0,1fr))] lg:grid-cols-4 lg:grid-rows-2 lg:gap-4 lg:min-h-[420px]">
        {moments.map((item) => (
          <article
            key={item.title}
            className={[
              'group relative overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5',
              item.className,
            ].join(' ')}
          >
            <CoverImage
              src={item.image}
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
            <div className="relative flex h-full min-h-[inherit] flex-col justify-end p-4 sm:p-5">
              <h3 className="font-display text-base text-white md:text-lg">{item.title}</h3>
              <p className="mt-1 max-w-md text-sm leading-relaxed text-white/90">{item.text}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-[var(--sw-muted)]">Rejoins la communauté sur ton campus</p>
        <Button asChild className="rounded-xl px-6">
          <Link to="/explore">Découvrir les tutorats</Link>
        </Button>
      </div>
    </section>
  )
}
