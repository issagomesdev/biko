"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { loginSchema, type LoginInput } from "@/src/lib/validations/auth-schema"
import { authService } from "@/src/services/auth-service"
import { Input } from "@/src/components/ui/Input"
import { Button } from "@/src/components/ui/Button"

export function LoginForm() {
  const router = useRouter()

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginInput) {
    try {
      await authService.login(data)
      router.push("/feed")
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
