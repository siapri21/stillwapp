/** URL json-server en local. Vide en prod → données depuis `db.json` embarqué. */
export const BASE_URL = import.meta.env.VITE_API_URL ?? ''
