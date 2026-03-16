"use client"

import { useState }       from "react"
import { Icon }           from "@iconify/react"
import { useUserStore }   from "@/src/stores/user-store"
import { useFeedStore }   from "@/src/stores/feed-store"
import { UserPopup }      from "@/src/components/layout/UserPopup"
import { FilterDrawer }   from "@/src/components/feed/FilterDrawer"

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
}

export function FeedHeader() {
  const user      = useUserStore((s) => s.user)
  const initials  = user ? getInitials(user.name) : "?"
  const search    = useFeedStore((s) => s.filters.search)
  const setFilter = useFeedStore((s) => s.setFilter)
  const [showPopup,  setShowPopup]  = useState(false)
  const [showFilter, setShowFilter] = useState(false)

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-between h-16 px-8">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <span className="font-sora font-bold text-xl text-black">B</span>
          </div>
          <span className="font-sora font-bold text-2xl text-black tracking-tight">biko</span>
        </div>

        <div className="flex items-center gap-2.5 bg-[#F5F5F5] rounded-full h-10 px-4 w-[400px]">
          <Icon icon="lucide:search" width={18} height={18} className="text-[#999999] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setFilter("search", e.target.value)}
            placeholder="Buscar serviços, profissionais..."
            className="bg-transparent w-full font-inter text-sm text-[#333333] placeholder:text-[#999999] focus:outline-none"
          />
          {search && (
            <button onClick={() => setFilter("search", "")} className="text-[#999999] shrink-0">
              <Icon icon="lucide:x" width={14} height={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button className="text-[#666666]">
            <Icon icon="lucide:bell" width={22} height={22} />
          </button>
          <button className="text-[#666666]">
            <Icon icon="lucide:message-square" width={22} height={22} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowPopup((v) => !v)}
              className="w-9 h-9 rounded-full bg-primary flex items-center justify-center"
            >
              <span className="font-inter font-semibold text-sm text-black">{initials}</span>
            </button>
            {showPopup && <UserPopup onClose={() => setShowPopup(false)} />}
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="font-sora font-bold text-[18px] text-black">B</span>
          </div>
          <span className="font-sora font-bold text-xl text-black tracking-tight">biko</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-[#666666]">
            <Icon icon="lucide:bell" width={22} height={22} />
          </button>
          <button onClick={() => setShowFilter(true)} className="text-[#666666]">
            <Icon icon="lucide:sliders-horizontal" width={22} height={22} />
          </button>
          <button className="text-[#666666]">
            <Icon icon="lucide:settings" width={22} height={22} />
          </button>
        </div>
      </div>
    </header>

    <FilterDrawer open={showFilter} onClose={() => setShowFilter(false)} />
    </>
  )
}
