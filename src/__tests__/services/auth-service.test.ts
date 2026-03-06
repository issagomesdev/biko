import { describe, it, expect, vi, beforeEach } from "vitest"
import { authService } from "@/src/services/auth-service"

function mockFetch(body: unknown, ok = true, status = 200) {
  return vi.spyOn(global, "fetch").mockResolvedValueOnce({
    ok,
    status,
    json: async () => body,
  } as Response)
}

beforeEach(() => vi.restoreAllMocks())

describe("authService.login", () => {
  it("retorna dados do usuário em sucesso", async () => {
    const payload = {
      success: true,
      message: "Bem-vindo!",
      user: { id: 1, name: "João", username: "joao", email: "j@test.com", categories: [], is_private: null, is_online: true },
    }
    mockFetch(payload)

    const res = await authService.login({ email: "j@test.com", password: "12345678" })

    expect(res.user.email).toBe("j@test.com")
    expect(res.message).toBe("Bem-vindo!")
  })

  it("chama /api/login via POST", async () => {
    const spy = mockFetch({ success: true, message: null, user: {} })
    await authService.login({ email: "j@test.com", password: "12345678" }).catch(() => {})
    expect(spy).toHaveBeenCalledWith("/api/login", expect.objectContaining({ method: "POST" }))
  })

  it("lança erro com message da resposta", async () => {
    mockFetch({ message: "Credenciais inválidas" }, false, 401)
    await expect(authService.login({ email: "j@test.com", password: "wrong" }))
      .rejects.toThrow("Credenciais inválidas")
  })

  it("lança erro com primeiro campo de errors[]", async () => {
    mockFetch({ errors: { email: ["E-mail já cadastrado"] } }, false, 422)
    await expect(authService.login({ email: "j@test.com", password: "123" }))
      .rejects.toThrow("E-mail já cadastrado")
  })

  it("lança fallback 'Erro inesperado' sem message", async () => {
    mockFetch({}, false, 500)
    await expect(authService.login({ email: "j@test.com", password: "123" }))
      .rejects.toThrow("Erro inesperado")
  })
})

describe("authService.register", () => {
  it("retorna sucesso com message", async () => {
    mockFetch({ success: true, message: "Conta criada!" })
    const res = await authService.register({
      name: "João", email: "j@test.com", password: "12345678", city_id: 1, categories: [1],
    })
    expect(res.success).toBe(true)
    expect(res.message).toBe("Conta criada!")
  })

  it("lança erro de validação do campo", async () => {
    mockFetch({ errors: { email: ["O e-mail já está cadastrado"] } }, false, 422)
    await expect(authService.register({
      name: "João", email: "j@test.com", password: "12345678", city_id: 1, categories: [1],
    })).rejects.toThrow("O e-mail já está cadastrado")
  })
})

describe("authService.logout", () => {
  it("retorna message de sucesso", async () => {
    mockFetch({ success: true, message: "Desconectado" })
    const res = await authService.logout()
    expect(res.success).toBe(true)
    expect(res.message).toBe("Desconectado")
  })

  it("chama /api/logout via POST", async () => {
    const spy = mockFetch({ success: true, message: "Desconectado" })
    await authService.logout()
    expect(spy).toHaveBeenCalledWith("/api/logout", expect.objectContaining({ method: "POST" }))
  })
})
