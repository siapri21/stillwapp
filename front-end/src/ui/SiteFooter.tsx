import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { assetUrl } from '../utils/assetUrl.ts'

export function SiteFooter() {
  return (
    <footer className="shrink-0 border-t border-black/10 bg-white lg:px-[10%]">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 pb-24 md:px-6 lg:px-0 lg:pb-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div>
            <img src={assetUrl('logoskillwapp.png')} alt="SkillWapp" className="h-9 w-11" />
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-[var(--sw-muted)] sm:text-sm">
              Échange tes compétences avec les étudiants de ton campus.
            </p>
          </div>

          <div>
            <h3 className="font-display text-xs text-[var(--sw-text-strong)] sm:text-sm">Navigation</h3>
            <ul className="mt-2 space-y-1.5 text-xs sm:text-sm">
              <li><FooterLink to="/">Accueil</FooterLink></li>
              <li><FooterLink to="/explore">Explorer</FooterLink></li>
              <li><FooterLink to="/search">Recherche</FooterLink></li>
              <li><FooterLink to="/matching">Matchs</FooterLink></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-xs text-[var(--sw-text-strong)] sm:text-sm">Mon compte</h3>
            <ul className="mt-2 space-y-1.5 text-xs sm:text-sm">
              <li><FooterLink to="/auth">Connexion</FooterLink></li>
              <li><FooterLink to="/auth?from=%2Fprofile">Profil</FooterLink></li>
              <li><FooterLink to="/auth?from=%2Fplanning">Planning</FooterLink></li>
              <li><FooterLink to="/auth?from=%2Fmessages">Messagerie</FooterLink></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-xs text-[var(--sw-text-strong)] sm:text-sm">Support</h3>
            <ul className="mt-2 space-y-1.5 text-xs text-[var(--sw-muted)] sm:text-sm">
              <li>Campus, Paris</li>
              <li>
                <a href="mailto:contact@skillwapp.fr" className="hover:text-[var(--sw-pink)]">
                  contact@skillwapp.fr
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-black/5 pt-4 text-center text-[10px] text-[var(--sw-muted)] sm:flex-row sm:text-left sm:text-xs">
          <span>© {new Date().getFullYear()} SkillWapp</span>
          <span className="text-[var(--sw-pink)]">Fait pour les étudiants, par les étudiants</span>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="text-[var(--sw-muted)] transition hover:text-[var(--sw-pink)]">
      {children}
    </Link>
  )
}
