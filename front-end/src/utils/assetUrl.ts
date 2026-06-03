/** Chemins vers `public/` — compatible déploiement sous sous-dossier (GitHub Pages, etc.). */
export function assetUrl(path: string) {
  const base = import.meta.env.BASE_URL || '/'
  const clean = path.replace(/^\//, '')
  return `${base}${clean}`
}
