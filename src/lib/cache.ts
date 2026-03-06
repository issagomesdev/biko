const THREE_DAYS = 3 * 24 * 60 * 60 * 1000

function get<T>(key: string): T | null {
  if (typeof window === "undefined") return null
  try {
    const item = localStorage.getItem(key)
    if (!item) return null
    const { data, expiresAt } = JSON.parse(item)
    if (Date.now() > expiresAt) {
      localStorage.removeItem(key)
      return null
    }
    return data as T
  } catch {
    return null
  }
}

function set<T>(key: string, data: T) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify({ data, expiresAt: Date.now() + THREE_DAYS }))
  } catch {}
}

export async function withCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = get<T>(key)
  if (cached !== null) return cached
  const data = await fetcher()
  set(key, data)
  return data
}
