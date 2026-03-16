import { describe, it, expect, vi, beforeEach } from "vitest"
import { publicationService } from "@/src/services/publication-service"

const mockResponse = {
  success: true,
  data: {
    data: [],
    meta: { current_page: 1, last_page: 1, per_page: 20, total: 0, from: null, to: null },
    links: {},
  },
  message: "",
}

beforeEach(() => vi.restoreAllMocks())

function spyFetch() {
  return vi.spyOn(global, "fetch").mockResolvedValue(
    new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  )
}

function captureQuery(spy: ReturnType<typeof spyFetch>): URLSearchParams {
  const url = spy.mock.calls[0][0] as string
  return new URLSearchParams(url.split("?")[1] ?? "")
}

describe("publicationService.list", () => {
  it("sempre inclui per_page=20", async () => {
    const spy = spyFetch()
    await publicationService.list({})
    expect(captureQuery(spy).get("per_page")).toBe("20")
  })

  it("chama /api/publications com GET", async () => {
    const spy = spyFetch()
    await publicationService.list({})
    expect(spy.mock.calls[0][0]).toMatch(/^\/api\/publications\?/)
  })

  it("inclui search quando preenchido", async () => {
    const spy = spyFetch()
    await publicationService.list({ search: "eletricista" })
    expect(captureQuery(spy).get("search")).toBe("eletricista")
  })

  it("não inclui search quando vazio", async () => {
    const spy = spyFetch()
    await publicationService.list({ search: "" })
    expect(captureQuery(spy).has("search")).toBe(false)
  })

  it("inclui type=0 para clientes", async () => {
    const spy = spyFetch()
    await publicationService.list({ type: 0 })
    expect(captureQuery(spy).get("type")).toBe("0")
  })

  it("inclui type=1 para prestadores", async () => {
    const spy = spyFetch()
    await publicationService.list({ type: 1 })
    expect(captureQuery(spy).get("type")).toBe("1")
  })

  it("não inclui type quando null", async () => {
    const spy = spyFetch()
    await publicationService.list({ type: null })
    expect(captureQuery(spy).has("type")).toBe(false)
  })

  it("inclui state_id", async () => {
    const spy = spyFetch()
    await publicationService.list({ state_id: 5 })
    expect(captureQuery(spy).get("state_id")).toBe("5")
  })

  it("inclui city_id", async () => {
    const spy = spyFetch()
    await publicationService.list({ city_id: 42 })
    expect(captureQuery(spy).get("city_id")).toBe("42")
  })

  it("inclui categories[] como múltiplos params", async () => {
    const spy = spyFetch()
    await publicationService.list({ categories: [1, 3] })
    const q = captureQuery(spy)
    expect(q.getAll("categories[]")).toEqual(["1", "3"])
  })

  it("não inclui categories[] quando vazio", async () => {
    const spy = spyFetch()
    await publicationService.list({ categories: [] })
    expect(captureQuery(spy).has("categories[]")).toBe(false)
  })

  it("inclui date", async () => {
    const spy = spyFetch()
    await publicationService.list({ date: "last_7d" })
    expect(captureQuery(spy).get("date")).toBe("last_7d")
  })

  it("inclui orderBy", async () => {
    const spy = spyFetch()
    await publicationService.list({ orderBy: "popular" })
    expect(captureQuery(spy).get("orderBy")).toBe("popular")
  })

  it("inclui page", async () => {
    const spy = spyFetch()
    await publicationService.list({ page: 3 })
    expect(captureQuery(spy).get("page")).toBe("3")
  })

  it("inclui todos os filtros combinados", async () => {
    const spy = spyFetch()
    await publicationService.list({
      search: "pintura",
      type: 1,
      state_id: 2,
      city_id: 10,
      categories: [4],
      date: "today",
      orderBy: "desc",
      page: 2,
    })
    const q = captureQuery(spy)
    expect(q.get("search")).toBe("pintura")
    expect(q.get("type")).toBe("1")
    expect(q.get("state_id")).toBe("2")
    expect(q.get("city_id")).toBe("10")
    expect(q.get("categories[]")).toBe("4")
    expect(q.get("date")).toBe("today")
    expect(q.get("orderBy")).toBe("desc")
    expect(q.get("page")).toBe("2")
    expect(q.get("per_page")).toBe("20")
  })
})
