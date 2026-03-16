import { useInfiniteQuery } from "@tanstack/react-query"
import { useFeedStore }      from "@/src/stores/feed-store"
import { publicationService } from "@/src/services/publication-service"
import { useDebounce }        from "./useDebounce"
import type { Publication }   from "@/src/types/publication"

export function useFeed() {
  const filters        = useFeedStore((s) => s.filters)
  const debouncedSearch = useDebounce(filters.search, 400)

  const activeFilters = { ...filters, search: debouncedSearch }

  const query = useInfiniteQuery({
    queryKey:         ["feed", activeFilters],
    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      const res = await publicationService.list({ ...activeFilters, page: pageParam as number })
      return res.data
    },

    getNextPageParam: (lastPage) =>
      lastPage.meta.current_page < lastPage.meta.last_page
        ? lastPage.meta.current_page + 1
        : undefined,

    staleTime: 30_000,      // 30s antes de revalidar em background
    gcTime:    5 * 60_000,  // 5min no cache após desmontar
  })

  const posts: Publication[] = query.data?.pages.flatMap((p) => p.data) ?? []

  return { ...query, posts, queryKey: ["feed", activeFilters] }
}
