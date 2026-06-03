import db from '../../db.json'

const REMOTE_API = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? ''

type DbRecord = Record<string, unknown>

function resolveLocal<T>(path: string): T {
  const trimmed = path.replace(/^\//, '')
  const [resource, idPart] = trimmed.split('/')
  const data = (db as DbRecord)[resource]

  if (data === undefined) {
    throw new Error(`Ressource inconnue : ${resource}`)
  }

  if (idPart !== undefined && idPart !== '') {
    const id = Number(idPart)
    if (!Array.isArray(data)) {
      throw new Error(`Not found: ${path}`)
    }
    const found = data.find((row) => Number((row as { id?: number }).id) === id)
    if (!found) throw new Error(`Not found: ${path}`)
    return found as T
  }

  return data as T
}

/** GET JSON — json-server en dev (`VITE_API_URL`), `db.json` embarqué en prod. */
export async function apiGet<T>(path: string): Promise<T> {
  const normalized = path.startsWith('/') ? path : `/${path}`

  if (REMOTE_API) {
    const res = await fetch(`${REMOTE_API}${normalized}`)
    if (!res.ok) throw new Error(`API ${normalized} → ${res.status}`)
    return res.json() as Promise<T>
  }

  return resolveLocal<T>(normalized)
}

export async function apiTryGet<T>(path: string): Promise<T | null> {
  try {
    return await apiGet<T>(path)
  } catch {
    return null
  }
}
