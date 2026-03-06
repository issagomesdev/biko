import { api } from "./api"
import { withCache } from "@/src/lib/cache"
import type { ApiResponse, State, City } from "@/src/types/api"

export const locationService = {
  getStates: () =>
    withCache("states", () => api.get<ApiResponse<State[]>>("/states")),

  getCitiesByState: (stateId: number) =>
    withCache(`cities:${stateId}`, () => api.get<ApiResponse<City[]>>(`/states/${stateId}/cities`)),
}
