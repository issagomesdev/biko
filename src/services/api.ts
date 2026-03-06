const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
...options,
  })

  const isJson = res.headers.get("content-type")?.includes("application/json")

  if (!res.ok) {
    const error = isJson ? await res.json().catch(() => ({})) : {}
    const firstFieldError = error.errors
      ? Object.values(error.errors as Record<string, string[]>)[0]?.[0]
      : null
    throw new Error(firstFieldError ?? error.message ?? `Erro ${res.status}`)
  }

  return isJson ? res.json() : ({} as T)
}

export const api = {
  get:  <T>(url: string)                => fetcher<T>(url),
  post: <T>(url: string, body: unknown) => fetcher<T>(url, { method: "POST", body: JSON.stringify(body) }),
}
