"use client"

import { useState, useRef, useCallback } from "react"
import type { UserOption }               from "@/src/services/user-service"

export interface PublicationFormInitialValues {
  text?:               string
  pubType?:            0 | 1
  selectedCategories?: number[]
  tags?:               string[]
  mentionedUsers?:     UserOption[]
  stateId?:            number | null
  cityId?:             number | null
}

export interface PublicationFormState {
  text:               string
  pubType:            0 | 1
  selectedCategories: number[]
  tags:               string[]
  mentionedUsers:     UserOption[]
  mediaFiles:         File[]
  stateId:            number | null
  cityId:             number | null
  atQuery:            string | null
}

export function usePublicationForm(initial: PublicationFormInitialValues = {}) {
  const [text,               setText]               = useState(initial.text ?? "")
  const [pubType,            setPubType]            = useState<0 | 1>(initial.pubType ?? 1)
  const [selectedCategories, setSelectedCategories] = useState<number[]>(initial.selectedCategories ?? [])
  const [tags,               setTags]               = useState<string[]>(initial.tags ?? [])
  const [mentionedUsers,     setMentionedUsers]     = useState<UserOption[]>(initial.mentionedUsers ?? [])
  const [mediaFiles,         setMediaFiles]         = useState<File[]>([])
  const [stateId,            setStateId]            = useState<number | null>(initial.stateId ?? null)
  const [cityId,             setCityId]             = useState<number | null>(initial.cityId ?? null)
  const [atQuery,            setAtQuery]            = useState<string | null>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // ── @mention detection ───────────────────────────────────────────────────

  const handleTextChange = useCallback((value: string) => {
    setText(value)
    const textarea  = textareaRef.current
    const cursorPos = textarea?.selectionStart ?? value.length
    const before    = value.slice(0, cursorPos)
    const match     = before.match(/@([\w.]*)$/)
    setAtQuery(match ? match[1] : null)
  }, [])

  const insertAtMention = useCallback(
    (user: UserOption) => {
      const textarea  = textareaRef.current
      const cursorPos = textarea?.selectionStart ?? text.length
      const before    = text.slice(0, cursorPos)
      const after     = text.slice(cursorPos)
      const newBefore = before.replace(/@[\w.]*$/, `@${user.username} `)
      const newText   = newBefore + after

      setText(newText)
      setAtQuery(null)

      setMentionedUsers((prev) =>
        prev.find((u) => u.id === user.id) ? prev : [...prev, user]
      )

      setTimeout(() => textarea?.setSelectionRange(newBefore.length, newBefore.length), 0)
    },
    [text],
  )

  const applyMentionedUsers = useCallback((users: UserOption[]) => {
    setMentionedUsers(users)
  }, [])

  const handleStateChange = useCallback((id: number | null) => {
    setStateId(id)
    setCityId(null)
  }, [])

  const canSubmit = text.trim().length >= 10

  function buildFormData(): FormData {
    const fd = new FormData()
    fd.append("text",    text.trim())
    fd.append("type",    String(pubType))
    if (cityId !== null) fd.append("city_id", String(cityId))
    selectedCategories.forEach((id) => fd.append("categories[]", String(id)))
    tags.forEach((tag)    => fd.append("tags[]",      tag))
    mentionedUsers.forEach((u) => fd.append("mentions[]", String(u.id)))
    mediaFiles.forEach((f) => fd.append("media[]",    f))
    return fd
  }

  async function submit(): Promise<unknown> {
    const fd   = buildFormData()
    const res  = await fetch("/api/publications", { method: "POST", credentials: "include", body: fd })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.message ?? "Erro ao publicar")
    return data.data
  }

  return {
    text, handleTextChange, textareaRef,
    pubType, setPubType,
    selectedCategories, setSelectedCategories,
    tags, setTags,
    mentionedUsers, applyMentionedUsers, insertAtMention,
    mediaFiles, setMediaFiles,
    stateId, handleStateChange,
    cityId,  setCityId,
    atQuery, setAtQuery,
    canSubmit, buildFormData, submit,
  }
}
