"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { loginSchema, type LoginInput } from "@/src/lib/validations/auth-schema"
import { authService } from "@/src/services/auth-service"
import { useUserStore } from "@/src/stores/user-store"
import { Input } from "@/src/components/ui/Input"
import { Button } from "@/src/components/ui/Button"

export function LoginForm() {
  const setUser      = useUserStore((s) => s.setUser)
  const searchParams = useSearchParams()

  useEffect(() => {
    const message = searchParams.get("message")
    if (message) toast.success(decodeURIComponent(message))
  }, [])

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginInput) {
    try {
      const res = await authService.login(data)
      setUser(res.user)
      if (res.message) toast.success(res.message)
      window.location.href = "/feed"
    } catch (err: any) {
      toast.error(err.message ?? "Credenciais inválidas")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 w-full max-w-[400px] max-md:px-6">
      <div className="flex flex-col gap-2 max-md:hidden">
        <h2 className="font-sora font-bold text-[28px] text-black">Bem-vindo de volta</h2>
        <p className="font-inter text-base text-[#666666]">Entre na sua conta para continuar</p>
      </div>

      <div className="flex flex-col gap-5">
        <Input label="Email" type="email" placeholder="seu@email.com"
          error={errors.email?.message} {...register("email")} />
        <Input label="Senha" type="password" placeholder="••••••••"
          error={errors.password?.message} {...register("password")} />
      </div>

      <div className="flex flex-col gap-4">
        <Button type="submit" variant="primary" loading={isSubmitting}>Entrar</Button>
        <p className="text-center font-inter text-sm text-[#666666]">
          Não tem uma conta?{" "}
          <Link href="/register" className="font-semibold text-black hover:underline">Cadastre-se</Link>
        </p>
      </div>
    </form>
  )
}
