import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createElement } from "react"
import { useCities } from "@/src/hooks/use-cities"
import * as locationService from "@/src/services/location-service"

function wrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client }, children)
}

beforeEach(() => vi.restoreAllMocks())

describe("useCities", () => {
  it("não faz requisição quando stateId é null", () => {
    const spy = vi.spyOn(locationService.locationService, "getCitiesByState").mockResolvedValue({
      success: true, data: [], message: "",
    })

    const { result } = renderHook(() => useCities(null), { wrapper: wrapper() })

    expect(result.current.fetchStatus).toBe("idle")
    expect(spy).not.toHaveBeenCalled()
  })

  it("faz requisição quando stateId é fornecido", async () => {
    vi.spyOn(locationService.locationService, "getCitiesByState").mockResolvedValue({
      success: true,
      data:    [{ id: 10, name: "São Paulo", state_id: 1 }],
      message: "",
    })

    const { result } = renderHook(() => useCities(1), { wrapper: wrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data[0].name).toBe("São Paulo")
  })

  it("usa stateId na queryKey", async () => {
    const spy = vi.spyOn(locationService.locationService, "getCitiesByState").mockResolvedValue({
      success: true, data: [], message: "",
    })

    const { result } = renderHook(() => useCities(5), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(spy).toHaveBeenCalledWith(5)
  })
})
