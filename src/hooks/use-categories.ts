import { useQuery } from "@tanstack/react-query"
import { categoryService } from "@/src/services/category-service"

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn:  () => categoryService.getAll(),
    staleTime: Infinity,
  })
}
