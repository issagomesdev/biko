import type { ApiResponse, PaginatedData } from "@/src/types/api"

export interface UserOption {
  id:       number
  name:     string
  username: string
  avatar:   { url: string; thumb_url: string } | null
}

async function internalGet<T>(path: string): Promise<T> {
  const res  = await fetch(path, { headers: { "Accept": "application/json" }, credentials: "include" })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message ?? `Erro ${res.status}`)
  return data as T
}

export const userService = {
  search: (query: string, perPage = 10) => {
    const params = new URLSearchParams({ per_page: String(perPage) })
    if (query) params.set("search", query)
    return internalGet<ApiResponse<PaginatedData<UserOption>>>(`/api/users?${params}`)
  },
}
