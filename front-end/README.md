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

## API

Créer un fichier :

```ts
src/api/api.ts
```

Exemple :

```ts
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

export default API;
```

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
