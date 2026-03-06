import { z } from "zod"

export const locationSchema = z.object({
  state_id: z.number({ message: "Selecione seu estado" }),
  city_id:  z.number({ message: "Selecione sua cidade" }),
})

export const servicesSchema = z.object({
  categories: z.array(z.number()).min(1, "Selecione pelo menos um serviço"),
})

export type LocationInput = z.infer<typeof locationSchema>
export type ServicesInput = z.infer<typeof servicesSchema>
