"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { registerSchema, type RegisterInput } from "@/src/lib/validations/auth-schema"
import { useRegisterStore } from "@/src/stores/register-store"
import { Input } from "@/src/components/ui/Input"
import { Button } from "@/src/components/ui/Button"
import { RoleSelector } from "./RoleSelector"

export function RegisterForm() {
  const router           = useRouter()
  const draft            = useRegisterStore((s) => s.draft)
  const emailError       = useRegisterStore((s) => s.emailError)
  const clearEmailError  = useRegisterStore((s) => s.clearEmailError)
  const setCredentials   = useRegisterStore((s) => s.setCredentials)

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver:      zodResolver(registerSchema),
    defaultValues: {
      name:  draft.name,
      email: draft.email,
      role:  draft.role,
    },
  })

  useEffect(() => {
    if (emailError) {
      setError("email", { message: emailError })
      clearEmailError()
    }
  }, [emailError, setError, clearEmailError])

  function onSubmit(data: RegisterInput) {
    setCredentials({ name: data.name, email: data.email, password: data.password, role: data.role })
    router.push(`/register/location?role=${data.role}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7 w-full max-w-[420px] max-md:px-6 max-md:p-6">
      <div className="flex flex-col gap-2 max-md:hidden">
        <h2 className="font-sora font-bold text-[28px] text-black">Crie sua conta</h2>
        <p className="font-inter text-base text-[#666666]">Preencha os dados abaixo para começar</p>
      </div>

      <div className="flex flex-col gap-4">
        <Input label="Nome completo" type="text" placeholder="João Silva"
          error={errors.name?.message} {...register("name")} />
        <Input label="Email" type="email" placeholder="seu@email.com"
          error={errors.email?.message} {...register("email")} />
        <Input label="Senha" type="password" placeholder="••••••••"
          error={errors.password?.message} {...register("password")} />
        <Input label="Confirmar senha" type="password" placeholder="••••••••"
          error={errors.confirmPassword?.message} {...register("confirmPassword")} />
      </div>

      <Controller
        name="role"
        control={control}
        render={({ field }) => (
          <RoleSelector value={field.value} onChange={field.onChange} error={errors.role?.message} />
        )}
      />

      <div className="flex flex-col gap-4">
        <Button type="submit" variant="yellow" loading={isSubmitting}>Criar conta</Button>
        <p className="text-center font-inter text-sm text-[#666666]">
          Já tem uma conta?{" "}
          <Link href="/login" className="font-semibold text-black hover:underline">Entrar</Link>
        </p>
      </div>
    </form>
  )
}
