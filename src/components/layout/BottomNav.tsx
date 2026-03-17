"use client"

import Link        from "next/link"
import { Icon }    from "@iconify/react"

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[60px] bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.06)] flex items-center justify-around px-4 md:hidden z-50">
      <Link href="/feed"><Icon icon="lucide:house"          width={24} height={24} className="text-black"     /></Link>
      <button><Icon icon="lucide:search"          width={24} height={24} className="text-[#999999]" /></button>
      <Link href="/publications/create" className="w-11 h-11 rounded-full bg-primary flex items-center justify-center">
        <Icon icon="lucide:plus" width={24} height={24} className="text-black" />
      </Link>
      <button><Icon icon="lucide:message-square" width={24} height={24} className="text-[#999999]" /></button>
      <button><Icon icon="lucide:user"           width={24} height={24} className="text-[#999999]" /></button>
    </nav>
  )
}
