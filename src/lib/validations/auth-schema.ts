import { z } from "zod"

export const loginSchema = z.object({
  email:    z.string().email("E-mail inválido"),
  password: z.string(),
})

export const registerSchema = z.object({
  name:            z.string().min(2, "Mínimo 2 caracteres"),
  email:           z.string().email("E-mail inválido"),
  password:        z.string().min(8, "Mínimo 8 caracteres"),
  confirmPassword: z.string(),
  role:            z.enum(["provider", "client"], { message: "Selecione uma opção" }),
}).refine((data) => data.password === data.confirmPassword, {
  message:  "As senhas não coincidem",
  path:     ["confirmPassword"],
})

export type LoginInput    = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>