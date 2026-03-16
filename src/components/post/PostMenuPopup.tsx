"use client"

import { useEffect, useRef } from "react"
import { Icon }              from "@iconify/react"
import { useUserStore }      from "@/src/stores/user-store"
import type { Publication }  from "@/src/types/publication"

interface Props {
  post:    Publication
  onClose: () => void
}

interface MenuItemProps {
  icon:    string
  label:   string
  danger?: boolean
  onClick?: () => void
}

function MenuItem({ icon, label, danger, onClick }: MenuItemProps) {
  return (
    <button
      onClick={() => { onClick?.(); }}
      className={`flex items-center gap-2.5 w-full h-10 px-3 rounded-lg transition-colors hover:bg-[#F5F5F5] ${danger ? "text-[#E53935]" : "text-[#333333]"}`}
    >
      <Icon icon={icon} width={18} height={18} className={`shrink-0 ${danger ? "text-[#E53935]" : "text-[#666666]"}`} />
      <span className="font-inter text-sm truncate min-w-0">{label}</span>
    </button>
  )
}

export function PostMenuPopup({ post, onClose }: Props) {
  const currentUser = useUserStore((s) => s.user)
  const ref         = useRef<HTMLDivElement>(null)

  const isAuthor    = currentUser?.id === post.author.id
  const isFollowing = post.author.is_following
  const isBlocked   = post.author.is_blocked

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [onClose])

  return (
    <div
      ref={ref}
      className="absolute right-0 top-8 z-50 w-[200px] bg-white rounded-xl p-2 flex flex-col shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
    >
      {isAuthor && (
        <MenuItem icon="lucide:pencil" label="Editar publicação" />
      )}
      <MenuItem icon="lucide:eye"      label="Ver publicação" />
      <MenuItem icon="lucide:link"     label="Copiar link" />
      {!isFollowing && !isAuthor && (
        <MenuItem icon="lucide:user-plus" label={`Seguir @${post.author.username}`} />
      )}
      <MenuItem icon="lucide:bookmark" label="Salvar publicação" />

      <div className="h-px bg-[#EEEEEE] my-1" />

      {isAuthor && (
        <MenuItem icon="lucide:trash-2" label="Excluir publicação" danger />
      )}
      {!isAuthor && !isBlocked && (
        <MenuItem icon="lucide:ban" label="Bloquear" danger />
      )}
    </div>
  )
}
