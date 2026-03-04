import { api } from "./api"
import type { ApiResponse, Category } from "@/src/types/api"

export const categoryService = {
  getAll: () => api.get<ApiResponse<Category[]>>("/categories"),
}
