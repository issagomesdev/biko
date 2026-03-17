import { useQuery }     from "@tanstack/react-query"
import { useDebounce }  from "./useDebounce"
import { userService }  from "@/src/services/user-service"

export function useUserSearch(query: string, perPage = 10) {
  const debounced = useDebounce(query, 300)

  return useQuery({
    queryKey: ["user-search", debounced, perPage],
    queryFn:  () => userService.search(debounced, perPage),
    select:   (res) => res.data.data,
    staleTime: 10_000,
  })
}
