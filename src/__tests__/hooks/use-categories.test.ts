import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createElement } from "react"
import { useCategories } from "@/src/hooks/use-categories"
import * as categoryService from "@/src/services/category-service"

function wrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client }, children)
}

beforeEach(() => vi.restoreAllMocks())

describe("useCategories", () => {
  it("retorna categorias em sucesso", async () => {
    vi.spyOn(categoryService.categoryService, "getAll").mockResolvedValue({
      success: true,
      data:    [{ id: 1, name: "Eletricista", slug: "eletricista" }],
      message: "",
    })

    const { result } = renderHook(() => useCategories(), { wrapper: wrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data[0].slug).toBe("eletricista")
  })

  it("retorna erro quando o serviço falha", async () => {
    vi.spyOn(categoryService.categoryService, "getAll").mockRejectedValue(new Error("Falha"))

    const { result } = renderHook(() => useCategories(), { wrapper: wrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })

  it("chama o serviço apenas uma vez (staleTime Infinity)", async () => {
    const spy = vi.spyOn(categoryService.categoryService, "getAll").mockResolvedValue({
      success: true, data: [], message: "",
    })

    const { result } = renderHook(() => useCategories(), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(spy).toHaveBeenCalledTimes(1)
  })
})
