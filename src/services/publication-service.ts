import type { ApiResponse, PaginatedData } from "@/src/types/api"
import type { FeedFilters, Publication } from "@/src/types/publication"

function buildQuery(filters: Partial<FeedFilters> & { page?: number }): string {
  const params = new URLSearchParams()

  if (filters.search)                 params.set("search",   filters.search)
  if (filters.type != null)           params.set("type",     String(filters.type))
  if (filters.state_id != null)       params.set("state_id", String(filters.state_id))
  if (filters.city_id != null)        params.set("city_id",  String(filters.city_id))
  if (filters.date)                   params.set("date",    filters.date)
  if (filters.orderBy)                params.set("orderBy", filters.orderBy)
  if (filters.page)                   params.set("page",    String(filters.page))
  filters.categories?.forEach((id) => params.append("categories[]", String(id)))

  params.set("per_page", "20")

  return params.toString()
}

async function internalGet<T>(path: string): Promise<T> {
  const res = await fetch(path, {
    headers: { "Accept": "application/json" },
    credentials: "include",
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message ?? `Erro ${res.status}`)
  return data as T
}

export const publicationService = {
  list: (filters: Partial<FeedFilters> & { page?: number }) =>
    internalGet<ApiResponse<PaginatedData<Publication>>>(
      `/api/publications?${buildQuery(filters)}`
    ),
}
