import type { LoginInput } from "@/src/lib/validations/auth-schema"
import { api } from "./api"

export interface RegisterPayload {
  name:       string
  email:      string
  password:   string
  city_id:    number
  categories: number[]
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message ?? "Erro inesperado")
  }

  return data as T
}

export const authService = {
  login: (data: LoginInput) => api.post<{ success: true }>("/login", data),

  register: (data: RegisterPayload) => api.post<{ success: true }>("/register", data),
}
