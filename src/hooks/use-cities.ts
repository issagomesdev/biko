import { useQuery } from "@tanstack/react-query"
import { locationService } from "@/src/services/location-service"

export function useCities(stateId: number | null) {
  return useQuery({
    queryKey: ["cities", stateId],
    queryFn:  () => locationService.getCitiesByState(stateId!),
    enabled:  stateId !== null,
    staleTime: Infinity,
  })
}
