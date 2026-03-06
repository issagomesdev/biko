import { describe, it, expect } from "vitest"
import { locationSchema, servicesSchema } from "@/src/lib/validations/register-schema"

describe("locationSchema", () => {
  it("aceita dados válidos", () => {
    const result = locationSchema.safeParse({ state_id: 1, city_id: 2 })
    expect(result.success).toBe(true)
  })

  it("rejeita sem state_id", () => {
    const result = locationSchema.safeParse({ city_id: 2 })
    expect(result.success).toBe(false)
    // Zod v4 não aplica required_error em z.number() — verifica apenas a presença do erro
    const err = result.error?.issues.find((i) => i.path[0] === "state_id")
    expect(err).toBeDefined()
  })

  it("rejeita sem city_id", () => {
    const result = locationSchema.safeParse({ state_id: 1 })
    expect(result.success).toBe(false)
    const err = result.error?.issues.find((i) => i.path[0] === "city_id")
    expect(err).toBeDefined()
  })

  it("rejeita state_id não-numérico", () => {
    const result = locationSchema.safeParse({ state_id: "SP", city_id: 2 })
    expect(result.success).toBe(false)
  })

  it("rejeita ambos os campos ausentes", () => {
    const result = locationSchema.safeParse({})
    expect(result.success).toBe(false)
    expect(result.error?.issues).toHaveLength(2)
  })
})

describe("servicesSchema", () => {
  it("aceita array com ao menos um item", () => {
    const result = servicesSchema.safeParse({ categories: [1] })
    expect(result.success).toBe(true)
  })

  it("aceita múltiplos itens", () => {
    const result = servicesSchema.safeParse({ categories: [1, 2, 3] })
    expect(result.success).toBe(true)
  })

  it("rejeita array vazio", () => {
    const result = servicesSchema.safeParse({ categories: [] })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe("Selecione pelo menos um serviço")
  })

  it("rejeita sem campo categories", () => {
    const result = servicesSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})
