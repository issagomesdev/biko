"use client"

import { Icon } from "@iconify/react"

interface Props {
  title:       string
  description: string
  confirmLabel?: string
  loading?:    boolean
  onConfirm:   () => void
  onCancel:    () => void
}

export function ConfirmModal({ title, description, confirmLabel = "Confirmar", loading, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-[360px] flex flex-col gap-5 shadow-[0_8px_32px_rgba(0,0,0,0.16)]">
        <div className="flex flex-col gap-1.5">
          <h3 className="font-sora font-semibold text-[17px] text-black">{title}</h3>
          <p className="font-inter text-sm text-[#666666] leading-relaxed">{description}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 h-11 rounded-xl border border-[#E0E0E0] font-inter font-medium text-sm text-[#333333] hover:bg-[#F5F5F5] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 h-11 rounded-xl bg-[#E53935] font-inter font-medium text-sm text-white flex items-center justify-center gap-2 hover:bg-[#C62828] transition-colors disabled:opacity-60"
          >
            {loading && <Icon icon="lucide:loader" width={15} height={15} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
