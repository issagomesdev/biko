"use client"

import { useRef }  from "react"
import { Icon }   from "@iconify/react"

const MAX_FILES = 10
const ACCEPTED  = "image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime,video/x-msvideo,video/webm"

interface ExistingMedia {
  id:        number
  thumb_url: string
}

interface Props {
  files:              File[]
  onChange:           (files: File[]) => void
  mobile?:            boolean
  maxFiles?:          number
  existingMedia?:     ExistingMedia[]
  onRemoveExisting?:  (id: number) => void
}

export function MediaGrid({ files, onChange, mobile, maxFiles = MAX_FILES, existingMedia, onRemoveExisting }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const size   = mobile ? "w-20 h-20" : "w-[120px] h-[120px]"
  const radius = mobile ? "rounded-[10px]" : "rounded-xl"

  const totalExisting = existingMedia?.length ?? 0
  const effectiveMax  = maxFiles - totalExisting

  const addFiles = (list: FileList | null) => {
    if (!list) return
    onChange([...files, ...Array.from(list)].slice(0, effectiveMax))
  }

  const removeFile = (i: number) => onChange(files.filter((_, j) => j !== i))

  return (
    <div className="flex gap-3 flex-wrap">
      {existingMedia?.map((m) => (
        <div key={`existing-${m.id}`} className={`${size} ${radius} relative overflow-hidden shrink-0`}>
          <img src={m.thumb_url} alt="" className="w-full h-full object-cover" />
          {onRemoveExisting && (
            <button
              type="button"
              onClick={() => onRemoveExisting(m.id)}
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-lg bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <Icon icon="lucide:x" width={12} height={12} className="text-white" />
            </button>
          )}
        </div>
      ))}

      {files.map((f, i) => (
        <div key={i} className={`${size} ${radius} relative overflow-hidden shrink-0`}>
          <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => removeFile(i)}
            className={`absolute top-1.5 right-1.5 w-6 h-6 rounded-lg bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors`}
          >
            <Icon icon="lucide:x" width={12} height={12} className="text-white" />
          </button>
        </div>
      ))}

      {files.length < effectiveMax && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`${size} ${radius} bg-[#F5F5F5] flex flex-col items-center justify-center gap-2 hover:bg-[#EEEEEE] transition-colors shrink-0`}
        >
          <Icon icon="lucide:plus" width={mobile ? 20 : 24} height={mobile ? 20 : 24} className="text-[#999999]" />
          <span className={`font-inter ${mobile ? "text-[10px]" : "text-xs"} text-[#999999]`}>Adicionar</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        multiple
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />
    </div>
  )
}
