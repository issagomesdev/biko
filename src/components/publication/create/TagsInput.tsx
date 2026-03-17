"use client"

import { useState }                  from "react"
import { Icon }                      from "@iconify/react"
import type { KeyboardEvent }        from "react"

interface Props {
  tags:     string[]
  onChange: (tags: string[]) => void
  mobile?:  boolean
}

function normalizeTag(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9áéíóúãõâêôàüçñ-]/g, "")
}

export function TagsInput({ tags, onChange, mobile }: Props) {
  const [input, setInput] = useState("")

  const addTag = (raw: string) => {
    const tag = normalizeTag(raw)
    if (!tag || tags.includes(tag) || tags.length >= 20) return
    onChange([...tags, tag])
    setInput("")
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault()
      addTag(input)
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      onChange(tags.slice(0, -1))
    }
  }

  const height = mobile ? "h-11" : "h-12"

  return (
    <div className="flex flex-col gap-2">
      <div className={`flex items-center gap-2 ${height} px-4 rounded-[10px] bg-[#F9F9F9]`}>
        <Icon icon="lucide:hash" width={mobile ? 16 : 18} height={mobile ? 16 : 18} className="text-[#999999] shrink-0" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => { if (input.trim()) addTag(input) }}
          placeholder="Adicione tags separadas por vírgula"
          className="flex-1 bg-transparent font-inter text-sm text-[#333333] placeholder:text-[#999999] focus:outline-none min-w-0"
        />
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1.5 h-8 px-3 rounded-2xl bg-[#F0F0F0] font-inter text-[13px] text-[#666666]"
            >
              #{tag}
              <button
                type="button"
                onClick={() => onChange(tags.filter((t) => t !== tag))}
                className="text-[#999999] hover:text-[#666666] transition-colors"
              >
                <Icon icon="lucide:x" width={12} height={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
