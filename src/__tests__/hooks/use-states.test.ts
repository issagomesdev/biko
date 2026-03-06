import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createElement } from "react"
import { useStates } from "@/src/hooks/use-states"
import * as locationService from "@/src/services/location-service"

function wrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client }, children)
}

beforeEach(() => vi.restoreAllMocks())

describe("useStates", () => {
  it("retorna estados em sucesso", async () => {
    vi.spyOn(locationService.locationService, "getStates").mockResolvedValue({
      success: true,
      data:    [{ id: 1, name: "São Paulo", uf: "SP" }],
      message: "",
    })

    const { result } = renderHook(() => useStates(), { wrapper: wrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data[0].uf).toBe("SP")
  })

  it("retorna erro quando o serviço falha", async () => {
    vi.spyOn(locationService.locationService, "getStates").mockRejectedValue(new Error("Falha"))

    const { result } = renderHook(() => useStates(), { wrapper: wrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toBeInstanceOf(Error)
  })

  it("usa staleTime Infinity (não refetch desnecessário)", async () => {
    const spy = vi.spyOn(locationService.locationService, "getStates").mockResolvedValue({
      success: true, data: [], message: "",
    })

    const { result } = renderHook(() => useStates(), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(spy).toHaveBeenCalledTimes(1)
  })
})
