import type { LoginInput } from "@/src/lib/validations/auth-schema"
import type { LoginResponse, RegisterResponse } from "@/src/types/api"

export interface RegisterPayload {
  name:       string
  email:      string
  password:   string
  city_id:    number
  categories: number[]
}

async function internalPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method:      "POST",
    headers:     { "Content-Type": "application/json", "Accept": "application/json" },
    body:        JSON.stringify(body),
    credentials: "include",
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const firstFieldError = data.errors
      ? Object.values(data.errors as Record<string, string[]>)[0]?.[0]
      : null
    throw new Error(firstFieldError ?? data.message ?? "Erro inesperado")
  }

  return data as T
}

export const authService = {
  login: (data: LoginInput) =>
    internalPost<LoginResponse>("/api/login", data),

  register: (data: RegisterPayload) =>
    internalPost<RegisterResponse>("/api/register", data),

  logout: () =>
    internalPost<{ success: boolean; message: string }>("/api/logout", {}),
}
