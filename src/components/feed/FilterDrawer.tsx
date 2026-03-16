"use client"

import { useState, useEffect } from "react"
import { Icon }                from "@iconify/react"
import { useQuery }            from "@tanstack/react-query"
import { useFeedStore }        from "@/src/stores/feed-store"
import { categoryService }     from "@/src/services/category-service"
import { useStates }           from "@/src/hooks/use-states"
import { useCities }           from "@/src/hooks/use-cities"
import type { FeedFilters }    from "@/src/types/publication"

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

interface Props {
  open:    boolean
  onClose: () => void
}

export function FilterDrawer({ open, onClose }: Props) {
  const { filters, setFilter, resetFilters } = useFeedStore()

  // Draft state — só aplica ao clicar em "Aplicar"
  const [draft, setDraft] = useState<FeedFilters>(filters)

  useEffect(() => {
    if (open) setDraft(filters)
  }, [open, filters])

  const { data: categoriesRes } = useQuery({
    queryKey:  ["categories"],
    queryFn:   () => categoryService.getAll(),
    staleTime: 3 * 24 * 60 * 60_000,
  })
  const categories = categoriesRes?.data ?? []

  const { data: statesRes } = useStates()
  const states              = statesRes?.data ?? []

  const { data: citiesRes } = useCities(draft.state_id)
  const cities              = citiesRes?.data ?? []

  function setDraftField<K extends keyof FeedFilters>(key: K, value: FeedFilters[K]) {
    setDraft((d) => ({ ...d, [key]: value }))
  }

  function toggleCategory(id: number) {
    const next = draft.categories.includes(id)
      ? draft.categories.filter((c) => c !== id)
      : [...draft.categories, id]
    setDraftField("categories", next)
  }

  function handleStateChange(value: string) {
    setDraftField("state_id", value ? Number(value) : null)
    setDraftField("city_id", null)
  }

  function handleApply() {
    Object.entries(draft).forEach(([k, v]) =>
      setFilter(k as keyof FeedFilters, v as FeedFilters[keyof FeedFilters])
    )
    onClose()
  }

  function handleClear() {
    resetFilters()
    onClose()
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[280px] bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] flex flex-col max-h-[75vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 h-[52px] shrink-0">
          <span className="font-sora font-semibold text-base text-black">Filtros</span>
          <button onClick={onClose} className="text-[#999999]">
            <Icon icon="lucide:x" width={20} height={20} />
          </button>
        </div>

        <div className="h-px bg-[#E8E8E8] shrink-0" />

        {/* Content */}
        <div className="overflow-y-auto flex flex-col gap-5 px-4 py-5">

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
                  onClick={() => setDraftField("type", opt.value)}
                  className={`flex-1 h-8 rounded-lg font-inter text-xs font-medium transition-colors ${
                    draft.type === opt.value
                      ? "bg-primary text-black"
                      : "bg-[#F5F5F5] text-[#333333]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Serviço */}
          <div className="flex flex-col gap-2">
            <span className="font-inter text-[13px] font-medium text-[#666666]">Serviço</span>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`h-7 px-3 rounded-full font-inter text-xs font-medium transition-colors ${
                    draft.categories.includes(cat.id)
                      ? "bg-primary text-black"
                      : "bg-[#F5F5F5] text-[#333333]"
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
            <div className="relative">
              <select
                value={draft.state_id ?? ""}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full h-10 rounded-lg bg-[#F5F5F5] px-3 pr-8 font-inter text-sm text-[#333333] appearance-none focus:outline-none"
              >
                <option value="">Todos os estados</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <Icon icon="lucide:chevron-down" width={16} height={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none" />
            </div>
          </div>

          {/* Cidade */}
          <div className="flex flex-col gap-2">
            <span className="font-inter text-[13px] font-medium text-[#666666]">Cidade</span>
            <div className="relative">
              <select
                value={draft.city_id ?? ""}
                onChange={(e) => setDraftField("city_id", e.target.value ? Number(e.target.value) : null)}
                disabled={!draft.state_id}
                className="w-full h-10 rounded-lg bg-[#F5F5F5] px-3 pr-8 font-inter text-sm text-[#333333] appearance-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Todas as cidades</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <Icon icon="lucide:chevron-down" width={16} height={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none" />
            </div>
          </div>

          {/* Data */}
          <div className="flex flex-col gap-2">
            <span className="font-inter text-[13px] font-medium text-[#666666]">Data</span>
            <div className="relative">
              <select
                value={draft.date}
                onChange={(e) => setDraftField("date", e.target.value)}
                className="w-full h-10 rounded-lg bg-[#F5F5F5] px-3 pr-8 font-inter text-sm text-[#333333] appearance-none focus:outline-none"
              >
                {DATE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <Icon icon="lucide:chevron-down" width={16} height={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none" />
            </div>
          </div>

          {/* Ordenar */}
          <div className="flex flex-col gap-2">
            <span className="font-inter text-[13px] font-medium text-[#666666]">Ordenar</span>
            <div className="relative">
              <select
                value={draft.orderBy}
                onChange={(e) => setDraftField("orderBy", e.target.value as "desc" | "asc" | "popular")}
                className="w-full h-10 rounded-lg bg-[#F5F5F5] px-3 pr-8 font-inter text-sm text-[#333333] appearance-none focus:outline-none"
              >
                {ORDER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <Icon icon="lucide:chevron-down" width={16} height={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="h-px bg-[#E8E8E8] shrink-0" />

        {/* Botões */}
        <div className="flex gap-3 px-4 py-3 shrink-0">
          <button
            onClick={handleClear}
            className="flex-1 h-11 rounded-[10px] border border-[#E0E0E0] font-inter text-sm font-medium text-[#333333]"
          >
            Limpar
          </button>
          <button
            onClick={handleApply}
            className="flex-1 h-11 rounded-[10px] bg-black font-inter text-sm font-medium text-white"
          >
            Aplicar
          </button>
        </div>
      </div>
    </>
  )
}
