"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { locationSchema, type LocationInput } from "@/src/lib/validations/register-schema"
import { useRegisterStore } from "@/src/stores/register-store"
import { authService } from "@/src/services/auth-service"
import { useStates } from "@/src/hooks/use-states"
import { useCities } from "@/src/hooks/use-cities"
import { Select } from "@/src/components/ui/Select"
import { Button } from "@/src/components/ui/Button"

export function LocationForm() {
  const router        = useRouter()
  const role          = useSearchParams().get("role")
  const draft         = useRegisterStore((s) => s.draft)
  const setCity       = useRegisterStore((s) => s.setCity)
  const reset         = useRegisterStore((s) => s.reset)
  const setEmailError = useRegisterStore((s) => s.setEmailError)

  const { control, handleSubmit, watch, formState: { errors, isSubmitting } } =
    useForm<LocationInput>({ resolver: zodResolver(locationSchema) })

  const stateId = watch("state_id") ?? null
  const { data: statesData, isLoading: loadingStates } = useStates()
  const { data: citiesData, isLoading: loadingCities } = useCities(stateId)

  const states = statesData?.data ?? []
  const cities = citiesData?.data ?? []

  async function onSubmit(data: LocationInput) {
    setCity(data.city_id)

    if (role === "provider") {
      router.push("/register/services")
      return
    }

    try {
      const res = await authService.register({
        name:       draft.name,
        email:      draft.email,
        password:   draft.password,
        city_id:    data.city_id,
        categories: [],
      })
      reset()
      if (res.message) toast.success(res.message)
      router.push("/login")
    } catch (err: any) {
      const msg = err.message ?? "Erro ao criar conta"
      toast.error(msg)
      if (msg.toLowerCase().includes("e-mail") || msg.toLowerCase().includes("email")) {
        setEmailError(msg)
        router.push("/register")
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="font-sora font-bold text-2xl text-black">Sua localização</h2>
        <p className="font-inter text-[15px] text-[#666666]">Onde você está?</p>
      </div>

      <div className="flex flex-col gap-4">
        <Controller
          name="state_id"
          control={control}
          render={({ field }) => (
            <Select
              label="Estado"
              placeholder={loadingStates ? "Carregando opções..." : "Selecione seu estado"}
              disabled={loadingStates}
              error={errors.state_id?.message}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
            >
              {states.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </Select>
          )}
        />

        {stateId && (
          <Controller
            name="city_id"
            control={control}
            render={({ field }) => (
              <Select
                label="Cidade"
                placeholder={loadingCities ? "Carregando opções..." : "Selecione sua cidade"}
                disabled={loadingCities}
                error={errors.city_id?.message}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
              >
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            )}
          />
        )}
      </div>

      <Button type="submit" variant="primary" loading={isSubmitting}>Continuar</Button>
    </form>
  )
}
