"use client"

import { useState }       from "react"
import { Icon }           from "@iconify/react"
import { useUserSearch }  from "@/src/hooks/useUserSearch"
import type { UserOption } from "@/src/services/user-service"

interface Props {
  selected:  UserOption[]
  onApply:   (users: UserOption[]) => void
  onClose:   () => void
}

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
}

export function MentionsPicker({ selected, onApply, onClose }: Props) {
  const [draft,  setDraft]  = useState<UserOption[]>(selected)
  const [search, setSearch] = useState("")

  const { data: users = [] } = useUserSearch(search, 20)

  const toggle = (user: UserOption) =>
    setDraft((prev) =>
      prev.find((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]
    )

  const isSelected = (id: number) => draft.some((u) => u.id === id)

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[400px] max-h-[560px] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EEEEEE]">
          <span className="font-inter font-bold text-base text-[#333333]">Marcar pessoas</span>
          <button onClick={onClose} className="text-[#666666] hover:text-[#333333] transition-colors">
            <Icon icon="lucide:x" width={20} height={20} />
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#EEEEEE]">
          <Icon icon="lucide:search" width={16} height={16} className="text-[#999999] shrink-0" />
          <input
            autoFocus
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar usuário..."
            className="flex-1 bg-transparent font-inter text-sm text-[#333333] placeholder:text-[#999999] focus:outline-none"
          />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-2 min-h-0">
          {users.length === 0 && (
            <p className="font-inter text-sm text-[#999999] text-center py-6">
              {search ? "Nenhum usuário encontrado" : "Digite para buscar usuários"}
            </p>
          )}
          {users.map((user) => {
            const checked = isSelected(user.id)
            return (
              <button
                key={user.id}
                onClick={() => toggle(user)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F9F9F9] transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-[#E0E0E0] overflow-hidden shrink-0 flex items-center justify-center">
                  {user.avatar
                    ? <img src={user.avatar.thumb_url} alt="" className="w-full h-full object-cover" />
                    : <span className="font-inter font-semibold text-xs text-black">{getInitials(user.name)}</span>
                  }
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-inter text-sm font-medium text-[#333333] truncate">{user.name}</p>
                  <p className="font-inter text-xs text-[#999999]">@{user.username}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    checked ? "bg-black" : "border border-[#CCCCCC]"
                  }`}
                >
                  {checked && <Icon icon="lucide:check" width={11} height={11} className="text-white" />}
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[#EEEEEE]">
          <span className="font-inter text-[13px] text-[#666666]">
            {draft.length} marcada{draft.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={() => { onApply(draft); onClose() }}
            className="h-9 px-5 rounded-lg bg-black font-inter font-semibold text-sm text-white hover:bg-[#333333] transition-colors"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  )
}
