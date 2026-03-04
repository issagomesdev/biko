import { useQuery } from "@tanstack/react-query"
import { locationService } from "@/src/services/location-service"

export function useStates() {
  return useQuery({
    queryKey: ["states"],
    queryFn:  () => locationService.getStates(),
    staleTime: Infinity,
  })
}
