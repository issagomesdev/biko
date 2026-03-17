"use client"

import { Icon }      from "@iconify/react"
import { useStates } from "@/src/hooks/use-states"
import { useCities } from "@/src/hooks/use-cities"

interface Props {
  stateId:       number | null
  cityId:        number | null
  onStateChange: (id: number | null) => void
  onCityChange:  (id: number | null) => void
  mobile?:       boolean
}

export function LocationSelect({ stateId, cityId, onStateChange, onCityChange, mobile }: Props) {
  const { data: statesRes } = useStates()
  const { data: citiesRes } = useCities(stateId)

  const states = (statesRes as any)?.data ?? []
  const cities = (citiesRes as any)?.data ?? []

  const height   = mobile ? "h-11" : "h-12"
  const fontSize = mobile ? "text-[13px]" : "text-sm"

  const handleStateChange = (id: number | null) => {
    onStateChange(id)
    onCityChange(null)
  }

  return (
    <div className="flex gap-3">
      <div className="flex-1 relative">
        <select
          value={stateId ?? ""}
          onChange={(e) => handleStateChange(e.target.value ? Number(e.target.value) : null)}
          className={`w-full ${height} ${fontSize} font-inter pl-4 pr-8 rounded-[10px] bg-[#F9F9F9] text-[#333333] appearance-none focus:outline-none cursor-pointer`}
        >
          <option value="">Estado</option>
          {states.map((s: any) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <Icon
          icon="lucide:chevron-down"
          width={16}
          height={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] pointer-events-none"
        />
      </div>

      <div className="flex-1 relative">
        <select
          value={cityId ?? ""}
          onChange={(e) => onCityChange(e.target.value ? Number(e.target.value) : null)}
          disabled={!stateId || cities.length === 0}
          className={`w-full ${height} ${fontSize} font-inter pl-4 pr-8 rounded-[10px] bg-[#F9F9F9] text-[#333333] appearance-none focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <option value="">Cidade</option>
          {cities.map((c: any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <Icon
          icon="lucide:chevron-down"
          width={16}
          height={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] pointer-events-none"
        />
      </div>
    </div>
  )
}
