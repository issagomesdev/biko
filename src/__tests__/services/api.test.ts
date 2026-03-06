import { describe, it, expect, vi, beforeEach } from "vitest"
import { api } from "@/src/services/api"

function mockFetch(body: unknown, ok = true, contentType = "application/json") {
  return vi.spyOn(global, "fetch").mockResolvedValueOnce({
    ok,
    status: ok ? 200 : 400,
    headers: { get: (h: string) => (h === "content-type" ? contentType : null) },
    json: async () => body,
  } as unknown as Response)
}

beforeEach(() => vi.restoreAllMocks())

describe("api.get", () => {
  it("retorna dados JSON em sucesso", async () => {
    mockFetch({ data: [1, 2, 3] })
    const res = await api.get<{ data: number[] }>("/states")
    expect(res.data).toEqual([1, 2, 3])
  })

  it("lança erro com message da API", async () => {
    mockFetch({ message: "Não encontrado" }, false)
    await expect(api.get("/nao-existe")).rejects.toThrow("Não encontrado")
  })

  it("lança erro com primeiro campo de errors[]", async () => {
    mockFetch({ errors: { email: ["E-mail inválido"] } }, false)
    await expect(api.get("/test")).rejects.toThrow("E-mail inválido")
  })

  it("retorna objeto vazio para resposta não-JSON", async () => {
    mockFetch(null, true, "text/html")
    const res = await api.get("/test")
    expect(res).toEqual({})
  })
})

describe("api.post", () => {
  it("envia body como JSON e retorna dados", async () => {
    const spy = mockFetch({ success: true })
    await api.post("/login", { email: "a@b.com", password: "123" })
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("/login"),
      expect.objectContaining({
        method: "POST",
        body:   JSON.stringify({ email: "a@b.com", password: "123" }),
      }),
    )
  })

  it("lança erro com status code quando sem message", async () => {
    mockFetch({}, false)
    await expect(api.post("/test", {})).rejects.toThrow("Erro 400")
  })
})
