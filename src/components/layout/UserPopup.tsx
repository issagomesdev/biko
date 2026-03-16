"use client"

import { useEffect, useRef, useState } from "react"
import { Icon } from "@iconify/react"
import { toast } from "sonner"
import { authService } from "@/src/services/auth-service"
import { useUserStore } from "@/src/stores/user-store"
import { PageLoader } from "@/src/components/ui/PageLoader"

const MENU_ITEMS = [
  { icon: "lucide:user-pen",  label: "Meu Perfil",     red: false },
  { icon: "lucide:settings",  label: "Configurações",   red: false },
  { icon: "lucide:log-out",   label: "Sair da conta",   red: true  },
]

interface Props {
  onClose: () => void
}

export function UserPopup({ onClose }: Props) {
  const clearUser   = useUserStore((s) => s.clearUser)
  const ref         = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [onClose])

  async function handleLogout() {
    setLoading(true)
    try {
      const res = await authService.logout()
      clearUser()
      sessionStorage.setItem("flash", res.message ?? "Desconectado")
      window.location.href = "/login"
    } catch {
      toast.error("Erro ao sair da conta")
      setLoading(false)
    }
  }

  function handleClick(index: number) {
    if (index === MENU_ITEMS.length - 1) {
      handleLogout()
    }
  }

  return (
    <>
      {loading && <PageLoader />}
      <div
        ref={ref}
        className="absolute top-11 right-0 w-[200px] bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] p-2 flex flex-col z-50"
      >
      {MENU_ITEMS.map((item, i) => (
        <button
          key={item.label}
          onClick={() => handleClick(i)}
          className="flex items-center gap-2.5 h-10 px-3 rounded-lg hover:bg-[#F5F5F5] transition-colors"
        >
          <Icon
            icon={item.icon}
            width={18}
            height={18}
            className={item.red ? "text-[#E53935]" : "text-[#666666]"}
          />
          <span
            className={`font-inter text-sm ${item.red ? "text-[#E53935]" : "text-[#333333]"}`}
          >
            {item.label}
          </span>
        </button>
      ))}
      </div>
    </>
  )
}
