import { z } from "zod"

export const locationSchema = z.object({
  state_id: z.number({ required_error: "Selecione seu estado" }),
  city_id:  z.number({ required_error: "Selecione sua cidade" }),
})

export const servicesSchema = z.object({
  categories: z.array(z.number()).min(1, "Selecione pelo menos um serviço"),
})

export type LocationInput = z.infer<typeof locationSchema>
export type ServicesInput = z.infer<typeof servicesSchema>
