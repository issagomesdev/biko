"use client"

import { Icon }            from "@iconify/react"
import { useQuery }        from "@tanstack/react-query"
import { useFeedStore }    from "@/src/stores/feed-store"
import { categoryService } from "@/src/services/category-service"
import { useStates }       from "@/src/hooks/use-states"
import { useCities }       from "@/src/hooks/use-cities"

const DATE_OPTIONS = [
  { label: "Qualquer data",   value: ""         },
  { label: "Hoje",            value: "today"    },
  { label: "Últimas 24h",     value: "last_24h" },
  { label: "Últimos 7 dias",  value: "last_7d"  },
  { label: "Últimos 30 dias", value: "last_30d" },
]

const ORDER_OPTIONS = [
  { label: "Mais recentes", value: "desc"    },
  { label: "Mais antigos",  value: "asc"     },
  { label: "Populares",     value: "popular" },
]

function FilterSelect({
  value,
  onChange,
  children,
  disabled,
}: {
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
  disabled?: boolean
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full h-10 rounded-lg bg-[#F5F5F5] px-3 pr-8 font-inter text-sm text-[#333333] appearance-none cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {children}
      </select>
      <Icon
        icon="lucide:chevron-down"
        width={16} height={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none"
      />
    </div>
  )
}

export function FilterSidebar() {
  const { filters, setFilter, resetFilters } = useFeedStore()

  const { data: categoriesRes } = useQuery({
    queryKey: ["categories"],
    queryFn:  () => categoryService.getAll(),
    staleTime: 3 * 24 * 60 * 60_000,
  })
  const categories = categoriesRes?.data ?? []

  const { data: statesRes } = useStates()
  const states              = statesRes?.data ?? []

  const { data: citiesRes } = useCities(filters.state_id)
  const cities              = citiesRes?.data ?? []

  const hasActiveFilters =
    filters.type !== null         ||
    filters.categories.length > 0 ||
    filters.state_id !== null     ||
    filters.city_id !== null      ||
    filters.date !== ""           ||
    filters.orderBy !== "desc"

  function toggleCategory(id: number) {
    const next = filters.categories.includes(id)
      ? filters.categories.filter((c) => c !== id)
      : [...filters.categories, id]
    setFilter("categories", next)
  }

  function handleStateChange(value: string) {
    setFilter("state_id", value ? Number(value) : null)
    setFilter("city_id", null)
  }

  function handleCityChange(value: string) {
    setFilter("city_id", value ? Number(value) : null)
  }

  return (
    <aside className="w-[280px] shrink-0">
      <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h3 className="font-sora font-semibold text-base text-black">Filtros</h3>
          {hasActiveFilters && (
            <button onClick={resetFilters} className="font-inter text-xs text-primary hover:underline">
              Limpar
            </button>
          )}
        </div>

        {/* Tipo */}
        <div className="flex flex-col gap-2">
          <span className="font-inter text-[13px] font-medium text-[#666666]">Tipo</span>
          <div className="flex gap-2">
            {([
              { label: "Todos",       value: null },
              { label: "Clientes",    value: 0    },
              { label: "Prestadores", value: 1    },
            ] as const).map((opt) => (
              <button
                key={String(opt.value)}
                onClick={() => setFilter("type", opt.value)}
                className={`flex-1 h-8 rounded-lg font-inter text-xs font-medium transition-colors ${
                  filters.type === opt.value
                    ? "bg-primary text-black"
                    : "bg-[#F5F5F5] text-[#333333] hover:bg-[#EBEBEB]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Serviço / Categorias */}
        <div className="flex flex-col gap-2">
          <span className="font-inter text-[13px] font-medium text-[#666666]">Serviço</span>
          <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`h-7 px-3 rounded-full font-inter text-xs font-medium transition-colors ${
                  filters.categories.includes(cat.id)
                    ? "bg-primary text-black"
                    : "bg-[#F5F5F5] text-[#333333] hover:bg-[#EBEBEB]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Estado */}
        <div className="flex flex-col gap-2">
          <span className="font-inter text-[13px] font-medium text-[#666666]">Estado</span>
          <FilterSelect
            value={filters.state_id ? String(filters.state_id) : ""}
            onChange={handleStateChange}
          >
            <option value="">Todos os estados</option>
            {states.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </FilterSelect>
        </div>

        {/* Cidade */}
        <div className="flex flex-col gap-2">
          <span className="font-inter text-[13px] font-medium text-[#666666]">Cidade</span>
          <FilterSelect
            value={filters.city_id ? String(filters.city_id) : ""}
            onChange={handleCityChange}
            disabled={!filters.state_id}
          >
            <option value="">Todas as cidades</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </FilterSelect>
        </div>

        {/* Data */}
        <div className="flex flex-col gap-2">
          <span className="font-inter text-[13px] font-medium text-[#666666]">Data</span>
          <FilterSelect value={filters.date} onChange={(v) => setFilter("date", v)}>
            {DATE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </FilterSelect>
        </div>

        {/* Ordenar */}
        <div className="flex flex-col gap-2">
          <span className="font-inter text-[13px] font-medium text-[#666666]">Ordenar</span>
          <FilterSelect
            value={filters.orderBy}
            onChange={(v) => setFilter("orderBy", v as "desc" | "asc" | "popular")}
          >
            {ORDER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </FilterSelect>
        </div>
      </div>
    </aside>
  )
}
