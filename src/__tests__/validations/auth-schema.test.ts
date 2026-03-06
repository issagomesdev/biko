import { describe, it, expect } from "vitest"
import { loginSchema, registerSchema } from "@/src/lib/validations/auth-schema"

describe("loginSchema", () => {
  it("aceita dados válidos", () => {
    const result = loginSchema.safeParse({ email: "user@test.com", password: "123456" })
    expect(result.success).toBe(true)
  })

  it("rejeita e-mail inválido", () => {
    const result = loginSchema.safeParse({ email: "nao-é-email", password: "123456" })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe("E-mail inválido")
  })

  it("rejeita e-mail vazio", () => {
    const result = loginSchema.safeParse({ email: "", password: "123456" })
    expect(result.success).toBe(false)
  })

  it("rejeita sem campo password", () => {
    const result = loginSchema.safeParse({ email: "user@test.com" })
    expect(result.success).toBe(false)
  })
})

describe("registerSchema", () => {
  const valid = {
    name:            "João Silva",
    email:           "user@test.com",
    password:        "12345678",
    confirmPassword: "12345678",
    role:            "client" as const,
  }

  it("aceita dados válidos", () => {
    const result = registerSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it("rejeita nome com menos de 2 caracteres", () => {
    const result = registerSchema.safeParse({ ...valid, name: "J" })
    expect(result.success).toBe(false)
    const err = result.error?.issues.find((i) => i.path[0] === "name")
    expect(err?.message).toBe("Mínimo 2 caracteres")
  })

  it("rejeita e-mail inválido", () => {
    const result = registerSchema.safeParse({ ...valid, email: "invalido" })
    expect(result.success).toBe(false)
    const err = result.error?.issues.find((i) => i.path[0] === "email")
    expect(err?.message).toBe("E-mail inválido")
  })

  it("rejeita senha com menos de 8 caracteres", () => {
    const result = registerSchema.safeParse({ ...valid, password: "1234567", confirmPassword: "1234567" })
    expect(result.success).toBe(false)
    const err = result.error?.issues.find((i) => i.path[0] === "password")
    expect(err?.message).toBe("Mínimo 8 caracteres")
  })

  it("rejeita senhas diferentes", () => {
    const result = registerSchema.safeParse({ ...valid, confirmPassword: "outra-senha" })
    expect(result.success).toBe(false)
    const err = result.error?.issues.find((i) => i.path[0] === "confirmPassword")
    expect(err?.message).toBe("As senhas não coincidem")
  })

  it("rejeita role inválida", () => {
    const result = registerSchema.safeParse({ ...valid, role: "admin" })
    expect(result.success).toBe(false)
    const err = result.error?.issues.find((i) => i.path[0] === "role")
    expect(err?.message).toBe("Selecione uma opção")
  })

  it("aceita role provider", () => {
    const result = registerSchema.safeParse({ ...valid, role: "provider" })
    expect(result.success).toBe(true)
  })
})
