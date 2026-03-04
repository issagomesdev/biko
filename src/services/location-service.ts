import { api } from "./api"
import type { ApiResponse, State, City } from "@/src/types/api"

export const locationService = {
  getStates: () =>
    api.get<ApiResponse<State[]>>("/states"),

  getCitiesByState: (stateId: number) =>
    api.get<ApiResponse<City[]>>(`/states/${stateId}/cities`),
}
