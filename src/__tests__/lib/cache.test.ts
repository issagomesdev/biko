import { describe, it, expect, vi, beforeEach } from "vitest"
import { withCache } from "@/src/lib/cache"

beforeEach(() => localStorage.clear())

describe("withCache", () => {
  it("chama fetcher e retorna dados na primeira vez", async () => {
    const fetcher = vi.fn().mockResolvedValue({ id: 1 })
    const result = await withCache("test-key", fetcher)

    expect(fetcher).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ id: 1 })
  })

  it("usa cache na segunda chamada sem chamar fetcher", async () => {
    const fetcher = vi.fn().mockResolvedValue({ id: 1 })
    await withCache("test-key", fetcher)
    await withCache("test-key", fetcher)

    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it("chaves diferentes não compartilham cache", async () => {
    const fetcher = vi.fn().mockResolvedValueOnce({ a: 1 }).mockResolvedValueOnce({ b: 2 })
    const r1 = await withCache("key-a", fetcher)
    const r2 = await withCache("key-b", fetcher)

    expect(r1).toEqual({ a: 1 })
    expect(r2).toEqual({ b: 2 })
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it("chama fetcher novamente após expiração do cache", async () => {
    const fetcher = vi.fn().mockResolvedValue({ id: 1 })
    await withCache("expired-key", fetcher)

    // Simula cache expirado sobrescrevendo o item com expiresAt no passado
    const expired = JSON.stringify({ data: { id: 1 }, expiresAt: Date.now() - 1000 })
    localStorage.setItem("expired-key", expired)

    await withCache("expired-key", fetcher)
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it("trata localStorage corrompido e chama fetcher", async () => {
    localStorage.setItem("bad-key", "{ invalid json }")
    const fetcher = vi.fn().mockResolvedValue({ id: 9 })
    const result = await withCache("bad-key", fetcher)

    expect(fetcher).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ id: 9 })
  })
})
