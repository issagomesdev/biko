"use client"

import { useState, useEffect, useRef } from "react"
import { Icon }                        from "@iconify/react"
import type { Category }               from "@/src/types/api"

interface Props {
  categories: Category[]
  selected:   number[]
  onApply:    (ids: number[]) => void
  onClose:    () => void
}

export function CategorySelectPopup({ categories, selected, onApply, onClose }: Props) {
  const [draft,  setDraft]  = useState<number[]>(selected)
  const [search, setSearch] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [onClose])

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const toggle = (id: number) =>
    setDraft((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  return (
    <div
      ref={ref}
      className="absolute bottom-full left-0 mb-2 z-50 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] w-[235px] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <span className="font-inter font-bold text-base text-[#333333]">Categorias</span>
        <button onClick={onClose} className="text-[#666666] hover:text-[#333333] transition-colors">
          <Icon icon="lucide:x" width={20} height={20} />
        </button>
      </div>
      <div className="h-px bg-[#EEEEEE]" />

      {/* Search */}
      <div className="flex items-center gap-2.5 px-4 py-3">
        <Icon icon="lucide:search" width={18} height={18} className="text-[#999999] shrink-0" />
        <input
          autoFocus
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar categoria..."
          className="bg-transparent flex-1 font-inter text-sm text-[#333333] placeholder:text-[#999999] focus:outline-none"
        />
      </div>
      <div className="h-px bg-[#EEEEEE]" />

      {/* List */}
      <div className="max-h-[320px] overflow-y-auto py-2">
        {filtered.map((cat) => {
          const checked = draft.includes(cat.id)
          return (
            <button
              key={cat.id}
              onClick={() => toggle(cat.id)}
              className="w-full flex items-center gap-3 px-4 h-10 hover:bg-[#F9F9F9] transition-colors"
            >
              <div
                className={`w-5 h-5 rounded-[4px] flex items-center justify-center shrink-0 transition-colors ${
                  checked ? "bg-black" : "border border-[#CCCCCC]"
                }`}
              >
                {checked && (
                  <Icon icon="lucide:check" width={12} height={12} className="text-white" />
                )}
              </div>
              <span className="font-inter text-sm text-[#333333] text-left">{cat.name}</span>
            </button>
          )
        })}
        {filtered.length === 0 && (
          <p className="font-inter text-sm text-[#999999] text-center py-4">
            Nenhuma categoria encontrada
          </p>
        )}
      </div>
      <div className="h-px bg-[#EEEEEE]" />

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-inter text-[13px] text-[#666666]">
          {draft.length} selecionada{draft.length !== 1 ? "s" : ""}
        </span>
        <button
          onClick={() => { onApply(draft); onClose() }}
          className="h-9 px-5 rounded-lg bg-black font-inter font-semibold text-sm text-white hover:bg-[#333333] transition-colors"
        >
          Aplicar
        </button>
      </div>
    </div>
  )
}
