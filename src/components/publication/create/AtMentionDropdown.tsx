"use client"

import { Icon }           from "@iconify/react"
import { useUserSearch }  from "@/src/hooks/useUserSearch"
import type { UserOption } from "@/src/services/user-service"

interface Props {
  query:    string
  onSelect: (user: UserOption) => void
}

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
}

export function AtMentionDropdown({ query, onSelect }: Props) {
  const { data: users = [], isLoading } = useUserSearch(query, 6)

  if (!query || (users.length === 0 && !isLoading)) return null

  return (
    <div className="absolute bottom-full left-0 right-0 mb-1 z-50 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] overflow-hidden max-h-[220px] overflow-y-auto">
      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <Icon icon="lucide:loader" width={16} height={16} className="text-[#999999] animate-spin" />
        </div>
      )}
      {users.map((user) => (
        <button
          key={user.id}
          onMouseDown={(e) => { e.preventDefault(); onSelect(user) }}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#F9F9F9] transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-[#E0E0E0] overflow-hidden shrink-0 flex items-center justify-center">
            {user.avatar
              ? <img src={user.avatar.thumb_url} alt="" className="w-full h-full object-cover" />
              : <span className="font-inter font-semibold text-[10px] text-black">{getInitials(user.name)}</span>
            }
          </div>
          <div className="text-left min-w-0">
            <p className="font-inter text-sm font-medium text-[#333333] truncate">{user.name}</p>
            <p className="font-inter text-xs text-[#999999]">@{user.username}</p>
          </div>
        </button>
      ))}
    </div>
  )
}
