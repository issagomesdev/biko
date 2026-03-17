"use client"

import { useState, useRef }             from "react"
import { Icon }                         from "@iconify/react"
import { toast }                        from "sonner"

import { usePublicationForm }           from "@/src/hooks/usePublicationForm"

import { FeedHeader }                   from "@/src/components/feed/FeedHeader"
import { BottomNav }                    from "@/src/components/layout/BottomNav"
import { CategorySelectPopup }          from "@/src/components/publication/create/CategorySelectPopup"
import { MentionsPicker }              from "@/src/components/publication/create/MentionsPicker"
import { AtMentionDropdown }           from "@/src/components/publication/create/AtMentionDropdown"
import { MediaGrid }                   from "@/src/components/publication/create/MediaGrid"
import { TagsInput }                   from "@/src/components/publication/create/TagsInput"
import { LocationSelect }              from "@/src/components/publication/create/LocationSelect"
import type { Category, AuthUser }     from "@/src/types/api"

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
}

interface Props {
  title:                   string
  submitLabel:             string
  isPending:               boolean
  onSubmit:                () => void
  onBack:                  () => void
  form:                    ReturnType<typeof usePublicationForm>
  categories:              Category[]
  currentUser:             AuthUser | null
  existingMedia?:          { id: number; thumb_url: string }[]
  onRemoveExistingMedia?:  (id: number) => void
}

export function PublicationFormShell({
  title, submitLabel, isPending, onSubmit, onBack,
  form, categories, currentUser,
  existingMedia, onRemoveExistingMedia,
}: Props) {

  const [showCategoryPopupDesktop, setShowCategoryPopupDesktop] = useState(false)
  const [showCategoryPopupMobile,  setShowCategoryPopupMobile]  = useState(false)
  const [showMentionsPicker,       setShowMentionsPicker]       = useState(false)

  const backdropDesktopRef = useRef<HTMLDivElement>(null)
  const backdropMobileRef  = useRef<HTMLDivElement>(null)

  const initials      = currentUser ? getInitials(currentUser.name) : "?"
  const mediaSlots    = 10
  const categoryNames = form.selectedCategories
    .map((id) => categories.find((c) => c.id === id)?.name)
    .filter(Boolean) as string[]

  // ── submit button ─────────────────────────────────────────────────────────

  const handleSubmitClick = () => {
    const missing: string[] = []
    if (form.text.trim().length < 10) missing.push("texto com pelo menos 10 caracteres")
    if (missing.length > 0) {
      toast.error(`Preencha: ${missing.join(", ")}.`)
      return
    }
    onSubmit()
  }

  const submitBtn = (mobile?: boolean) => (
    <button
      type="button"
      disabled={isPending}
      onClick={handleSubmitClick}
      className={`flex items-center gap-1.5 rounded-lg bg-black font-inter font-semibold text-white disabled:opacity-40 hover:bg-[#333333] transition-colors ${
        mobile ? "h-9 px-5 text-sm" : "h-10 px-6 text-sm"
      }`}
    >
      {isPending && <Icon icon="lucide:loader" width={13} height={13} className="animate-spin" />}
      {submitLabel}
    </button>
  )

  // ── user row ──────────────────────────────────────────────────────────────

  const userRow = (mobile?: boolean) => (
    <div className="flex items-center gap-3">
      <div className={`${mobile ? "w-10 h-10" : "w-11 h-11"} rounded-full bg-primary flex items-center justify-center shrink-0`}>
        <span className={`font-inter font-semibold ${mobile ? "text-sm" : "text-base"} text-black`}>{initials}</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className={`font-inter font-semibold ${mobile ? "text-[14px]" : "text-[15px]"} text-[#333333]`}>{currentUser?.name}</span>
        <span className={`font-inter ${mobile ? "text-xs" : "text-[13px]"} text-[#999999]`}>@{currentUser?.username}</span>
      </div>
    </div>
  )

  // ── textarea with @mention backdrop ───────────────────────────────────────

  const textArea = (mobile?: boolean) => {
    const backdropRef = mobile ? backdropMobileRef : backdropDesktopRef
    const parts = form.text.split(/(@[\w.]+)/g)
    return (
      <div className="relative">
        <div className="relative">
          <div
            ref={backdropRef}
            aria-hidden
            className={`absolute inset-0 rounded-xl font-inter leading-[1.5] whitespace-pre-wrap break-words pointer-events-none overflow-hidden bg-[#F9F9F9] ${
              mobile ? "p-3.5 text-[14px]" : "p-4 text-[15px]"
            }`}
          >
            {parts.map((part, i) =>
              /^@[\w.]+$/.test(part)
                ? <span key={i} className="text-primary font-semibold">{part}</span>
                : <span key={i} className="text-[#333333]">{part}</span>
            )}
            &#8203;
          </div>
          <textarea
            ref={form.textareaRef}
            value={form.text}
            onChange={(e) => form.handleTextChange(e.target.value)}
            onScroll={(e) => { if (backdropRef.current) backdropRef.current.scrollTop = e.currentTarget.scrollTop }}
            onBlur={() => setTimeout(() => form.setAtQuery(null), 150)}
            placeholder="Compartilhe seu trabalho, conquistas ou dicas profissionais..."
            rows={mobile ? 4 : 5}
            className={`relative w-full bg-transparent rounded-xl font-inter leading-[1.5] text-transparent caret-[#333333] placeholder:text-[#999999] focus:outline-none resize-none ${
              mobile ? "p-3.5 text-[14px]" : "p-4 text-[15px]"
            }`}
          />
        </div>
        {form.atQuery !== null && (
          <AtMentionDropdown query={form.atQuery} onSelect={form.insertAtMention} />
        )}
        <div className="flex items-center justify-between mt-1 px-1">
          <span className={`font-inter text-[11px] ${form.text.length < 10 && form.text.length > 0 ? "text-orange-400" : "text-[#CCCCCC]"}`}>
            {form.text.length} / 5000
          </span>
          {form.text.length > 0 && form.text.length < 10 && (
            <span className="font-inter text-[11px] text-orange-400">Mínimo 10 caracteres</span>
          )}
        </div>
      </div>
    )
  }

  // ── type toggle ───────────────────────────────────────────────────────────

  const typeToggle = (mobile?: boolean) => (
    <div className={`flex rounded-[10px] bg-[#F9F9F9] overflow-hidden ${mobile ? "h-11" : "h-12"}`}>
      {([1, 0] as const).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => form.setPubType(v)}
          className={`flex-1 font-inter text-sm transition-colors ${
            form.pubType === v ? "bg-black text-white font-semibold" : "text-[#666666] hover:bg-[#EEEEEE]"
          }`}
        >
          {v === 1 ? "Prestador" : "Cliente"}
        </button>
      ))}
    </div>
  )

  // ── category field ────────────────────────────────────────────────────────

  const categoryField = (mobile?: boolean) => {
    const show    = mobile ? showCategoryPopupMobile  : showCategoryPopupDesktop
    const setShow = mobile ? setShowCategoryPopupMobile : setShowCategoryPopupDesktop
    return (
      <div className="relative">
        <div
          className={`flex items-center justify-between gap-2 rounded-[10px] bg-[#F9F9F9] px-3 cursor-pointer ${mobile ? "min-h-[44px]" : "min-h-[48px]"}`}
          onClick={() => setShow((v) => !v)}
        >
          <div className="flex flex-wrap gap-1.5 flex-1 py-2.5">
            {categoryNames.length === 0 ? (
              <span className="font-inter text-sm text-[#999999]">Selecionar categorias</span>
            ) : (
              categoryNames.map((name) => (
                <span key={name} className="flex items-center gap-1 h-7 px-2.5 rounded-2xl bg-black font-inter text-xs text-white">
                  {name}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      const cat = categories.find((c) => c.name === name)
                      if (cat) form.setSelectedCategories(form.selectedCategories.filter((id) => id !== cat.id))
                    }}
                  >
                    <Icon icon="lucide:x" width={10} height={10} />
                  </button>
                </span>
              ))
            )}
          </div>
          <Icon icon="lucide:chevron-down" width={16} height={16} className="text-[#666666] shrink-0" />
        </div>
        {show && (
          <CategorySelectPopup
            categories={categories}
            selected={form.selectedCategories}
            onApply={form.setSelectedCategories}
            onClose={() => setShow(false)}
          />
        )}
      </div>
    )
  }

  // ── mentions field ────────────────────────────────────────────────────────

  const mentionsField = () => (
    <div
      className="flex items-center justify-between gap-2 rounded-[10px] bg-[#F9F9F9] px-3 cursor-pointer min-h-[48px]"
      onClick={() => setShowMentionsPicker(true)}
    >
      <div className="flex flex-wrap gap-1.5 flex-1 py-2.5">
        {form.mentionedUsers.length === 0 ? (
          <span className="font-inter text-sm text-[#999999]">Marcar pessoas</span>
        ) : (
          form.mentionedUsers.map((u) => (
            <span key={u.id} className="flex items-center gap-1 h-7 px-2.5 rounded-2xl bg-[#F0F0F0] font-inter text-xs text-[#333333]">
              @{u.username}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); form.applyMentionedUsers(form.mentionedUsers.filter((m) => m.id !== u.id)) }}
              >
                <Icon icon="lucide:x" width={10} height={10} />
              </button>
            </span>
          ))
        )}
      </div>
      <Icon icon="lucide:user-plus" width={16} height={16} className="text-[#666666] shrink-0" />
    </div>
  )

  // ── section labels ────────────────────────────────────────────────────────

  const label   = (text: string) => <span className="font-inter font-semibold text-[14px] text-[#333333]">{text}</span>
  const labelSm = (text: string) => <span className="font-inter font-semibold text-[13px] text-[#333333]">{text}</span>

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#F5F5F5]">

      {/* ── desktop ─────────────────────────────────────────────────────────── */}
      <div className="hidden md:block">
        <FeedHeader />
        <div className="pt-[80px] pb-12 flex justify-center px-6">
          <div className="w-full max-w-[800px] bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-8 flex flex-col gap-7">

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={onBack} className="text-[#666666] hover:text-black transition-colors">
                  <Icon icon="lucide:arrow-left" width={22} height={22} />
                </button>
                <span className="font-inter font-semibold text-[18px] text-[#333333]">{title}</span>
              </div>
              {submitBtn()}
            </div>

            {userRow()}
            {textArea()}

            <div className="flex flex-col gap-3">
              {label("Mídia")}
              <MediaGrid
                files={form.mediaFiles} onChange={form.setMediaFiles} maxFiles={mediaSlots}
                existingMedia={existingMedia} onRemoveExisting={onRemoveExistingMedia}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                {label("Publicar como")}
                {typeToggle()}
              </div>
              <div className="flex flex-col gap-3">
                {label("Categorias da publicação")}
                {categoryField()}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                {label("Localização")}
                <LocationSelect
                  stateId={form.stateId} cityId={form.cityId}
                  onStateChange={form.handleStateChange} onCityChange={form.setCityId}
                />
              </div>
              <div className="flex flex-col gap-3">
                {label("Tags")}
                <TagsInput tags={form.tags} onChange={form.setTags} />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {label("Marcações")}
              {mentionsField()}
            </div>

          </div>
        </div>
      </div>

      {/* ── mobile ──────────────────────────────────────────────────────────── */}
      <div className="md:hidden flex flex-col min-h-screen">

        <header className="fixed top-0 left-0 right-0 z-50 bg-white h-14 flex items-center justify-between px-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="text-[#333333]">
              <Icon icon="lucide:arrow-left" width={24} height={24} />
            </button>
            <span className="font-inter font-semibold text-base text-black">{title}</span>
          </div>
          {submitBtn(true)}
        </header>

        <div className="flex flex-col gap-5 pt-[72px] pb-20 px-4">
          {userRow(true)}
          {textArea(true)}

          <div className="flex flex-col gap-2">
            {labelSm("Mídia")}
            <MediaGrid
              files={form.mediaFiles} onChange={form.setMediaFiles} mobile maxFiles={mediaSlots}
              existingMedia={existingMedia} onRemoveExisting={onRemoveExistingMedia}
            />
          </div>

          <div className="flex flex-col gap-2">
            {labelSm("Publicar como")}
            {typeToggle(true)}
          </div>

          <div className="flex flex-col gap-2">
            {labelSm("Categorias da publicação")}
            {categoryField(true)}
          </div>

          <div className="flex flex-col gap-2">
            {labelSm("Localização")}
            <LocationSelect
              stateId={form.stateId} cityId={form.cityId}
              onStateChange={form.handleStateChange} onCityChange={form.setCityId}
              mobile
            />
          </div>

          <div className="flex flex-col gap-2">
            {labelSm("Tags")}
            <TagsInput tags={form.tags} onChange={form.setTags} mobile />
          </div>

          <div className="flex flex-col gap-2">
            {labelSm("Marcações")}
            {mentionsField()}
          </div>
        </div>

        <BottomNav />
      </div>

      {showMentionsPicker && (
        <MentionsPicker
          selected={form.mentionedUsers}
          onApply={form.applyMentionedUsers}
          onClose={() => setShowMentionsPicker(false)}
        />
      )}

    </div>
  )
}
