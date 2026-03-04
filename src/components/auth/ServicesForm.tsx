"use client"

import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { servicesSchema, type ServicesInput } from "@/src/lib/validations/register-schema"
import { useRegisterStore } from "@/src/stores/register-store"
import { useCategories } from "@/src/hooks/use-categories"
import { authService } from "@/src/services/auth-service"
import { Button } from "@/src/components/ui/Button"

export function ServicesForm() {
  const router = useRouter()
  const draft  = useRegisterStore((s) => s.draft)
  const reset  = useRegisterStore((s) => s.reset)

  const { data: categoriesData, isLoading } = useCategories()
  const categories = categoriesData?.data ?? []

  const mid   = Math.ceil(categories.length / 2)
  const col1  = categories.slice(0, mid)
  const col2  = categories.slice(mid)

  const { control, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<ServicesInput>({
      resolver:      zodResolver(servicesSchema),
      defaultValues: { categories: [] },
    })

  async function onSubmit(data: ServicesInput) {
    if (!draft.city_id) return

    try {
      await authService.register({
        name:       draft.name,
        email:      draft.email,
        password:   draft.password,
        city_id:    draft.city_id,
        categories: data.categories,
      })
      reset()
      router.push("/login")
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao criar conta")
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <span className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="font-sora font-bold text-2xl text-black max-md:text-xl">
          Quais serviços você oferece?
        </h2>
        <p className="font-inter text-[15px] text-[#666666] max-md:text-[13px]">
          Selecione todos os serviços que você presta
        </p>
      </div>

      <Controller
        name="categories"
        control={control}
        render={({ field }) => (
          <div className="flex gap-4 max-md:overflow-y-auto max-md:max-h-[340px]">
            {[col1, col2].map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-3 flex-1">
                {col.map((cat) => {
                  const checked = field.value.includes(cat.id)
                  const toggle  = () => {
                    const next = checked
                      ? field.value.filter((id) => id !== cat.id)
                      : [...field.value, cat.id]
                    field.onChange(next)
                  }
                  return (
                    <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer select-none" onClick={toggle}>
                      <div className={`w-[22px] h-[22px] shrink-0 rounded-md border-2 flex items-center justify-center transition-all ${checked ? "bg-black border-black" : "bg-white border-[#CCCCCC]"}`}>
                        {checked && (
                          <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                            <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className="font-inter text-sm text-[#333333] max-md:text-[13px]">{cat.name}</span>
                    </label>
                  )
                })}
              </div>
            ))}
          </div>
        )}
      />

      {errors.categories && (
        <p className="font-inter text-xs text-red-500 text-center">{errors.categories.message}</p>
      )}

      <Button type="submit" variant="primary" loading={isSubmitting}>Continuar</Button>
    </form>
  )
}
