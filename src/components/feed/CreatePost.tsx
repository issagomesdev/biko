"use client"

import { useUserStore } from "@/src/stores/user-store"

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
}

export function CreatePost() {
  const user     = useUserStore((s) => s.user)
  const initials = user ? getInitials(user.name) : "?"

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shrink-0">
          <span className="font-inter font-semibold text-base text-black">{initials}</span>
        </div>
        <button className="flex-1 h-[52px] bg-[#F5F5F5] rounded-[26px] px-5 flex items-center text-left">
          <span className="font-inter text-sm text-[#999999]">Compartilhe algo...</span>
        </button>
      </div>
    </div>
  )
}
