import { api } from "./api"
import { withCache } from "@/src/lib/cache"
import type { ApiResponse, Category } from "@/src/types/api"

export const categoryService = {
  getAll: () =>
    withCache("categories", () => api.get<ApiResponse<Category[]>>("/categories")),
}
