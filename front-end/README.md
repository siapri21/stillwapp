# Front-end — React + TypeScript + Tailwind

## Stack

* React (Vite)
* TypeScript
* Tailwind CSS
* Axios

---

## Installation

```bash
cd front-end
npm install
```

---

## Lancer le projet

```bash
npm run dev
```

Application disponible sur :
http://localhost:5173

---

## Installation Tailwind

```bash
npm install tailwindcss @tailwindcss/vite
```

### Configuration `vite.config.ts`

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

### CSS global (`src/index.css`)

```css
@import "tailwindcss";
```

---

## Données (`db.json`)

Le fichier mock est à la racine de `front-end/db.json`.

### En local (avec json-server)

```bash
# Terminal 1
npm run api

# Terminal 2 — optionnel : copier .env.example vers .env
npm run dev
```

Avec `VITE_API_URL=http://localhost:3001` dans `.env`, l’app appelle json-server.

### En production (Netlify, Vercel, GitHub Pages…)

- **Ne pas** définir `VITE_API_URL` (ou laisser vide).
- Au build, `db.json` est **embarqué** dans le bundle : pas besoin de json-server en ligne.
- Les images des compétences dans `db.json` sont des URLs **Unsplash** (`https://images.unsplash.com/...`) — elles fonctionnent en prod.
- Le logo est dans `public/logoskillwapp.png` (servi via `assetUrl()`).

```bash
npm run build
# Publier le dossier dist/
```

Si le site est hébergé dans un **sous-dossier** (ex. GitHub Pages `/StillWapp/`), configurer dans `vite.config.ts` : `base: '/StillWapp/'`.

---

## Structure recommandée

```
src/
├── components/
├── pages/
├── api/
├── hooks/
└── styles/
```

---

## Commandes utiles

```bash
npm install
npm run dev
npm run build
```
Depuis `front-end/` : `npm run api`