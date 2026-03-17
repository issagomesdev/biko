"use client"

import { useState, useRef, useEffect }           from "react"
import { useParams, useRouter }                   from "next/navigation"
import { useQuery, useMutation, useQueryClient }  from "@tanstack/react-query"
import { Icon }                                   from "@iconify/react"
import { toast }                                  from "sonner"
import { useUserStore }                           from "@/src/stores/user-store"
import { FeedHeader }                             from "@/src/components/feed/FeedHeader"
import { BottomNav }                              from "@/src/components/layout/BottomNav"
import { PostMenuPopup }                          from "@/src/components/post/PostMenuPopup"
import { PostText }                              from "@/src/components/post/PostText"
import { ConfirmModal }                           from "@/src/components/ui/ConfirmModal"
import type { Publication, Comment }              from "@/src/types/publication"

// ─── helpers ────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
}

function formatDate(dateStr: string): string {
  const diff    = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1)  return "agora pouco"
  if (minutes < 60) return `há ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24)   return `há ${hours}h`
  const d = new Date(dateStr)
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`
}

// ─── data fetching ───────────────────────────────────────────────────────────

async function fetchPublication(id: string): Promise<Publication> {
  const res  = await fetch(`/api/publications/${id}`, { credentials: "include" })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message ?? "Erro ao carregar publicação")
  return data.data as Publication
}

async function postComment(id: number, comment: string, parentId?: number, mediaFiles?: File[]): Promise<Comment> {
  const form = new FormData()
  form.append("comment", comment)
  if (parentId) form.append("parent_id", String(parentId))
  mediaFiles?.forEach((f) => form.append("media[]", f))

  const res  = await fetch(`/api/publications/${id}/comments`, {
    method: "POST", credentials: "include", body: form,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message ?? "Erro ao comentar")
  return data.data as Comment
}

// ─── lightbox ────────────────────────────────────────────────────────────────

function Lightbox({ images, initialIndex, onClose }: {
  images:       { url: string }[]
  initialIndex: number
  onClose:      () => void
}) {
  const [idx, setIdx] = useState(initialIndex)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose()
      if (e.key === "ArrowLeft")  setIdx((i) => Math.max(0, i - 1))
      if (e.key === "ArrowRight") setIdx((i) => Math.min(images.length - 1, i + 1))
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [images.length, onClose])

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      {/* close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
      >
        <Icon icon="lucide:x" width={18} height={18} className="text-white" />
      </button>

      {/* image */}
      <img
        src={images[idx].url}
        alt=""
        className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg select-none"
        onClick={(e) => e.stopPropagation()}
      />

      {/* nav */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); setIdx((i) => Math.max(0, i - 1)) }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors disabled:opacity-30"
            disabled={idx === 0}
          >
            <Icon icon="lucide:chevron-left" width={20} height={20} className="text-white" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIdx((i) => Math.min(images.length - 1, i + 1)) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors disabled:opacity-30"
            disabled={idx === images.length - 1}
          >
            <Icon icon="lucide:chevron-right" width={20} height={20} className="text-white" />
          </button>
          <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setIdx(i) }}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === idx ? "bg-white" : "bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── comment item ────────────────────────────────────────────────────────────

function CommentItem({ comment, mobile, publicationId, currentUserId, onDeleted }: {
  comment:        Comment
  mobile?:        boolean
  publicationId:  number
  currentUserId?: number
  onDeleted?:     (id: number) => void
}) {
  const avatarSize     = mobile ? "w-8 h-8" : "w-10 h-10"
  const initials       = getInitials(comment.author.name)
  const [liked,        setLiked]        = useState(comment.is_liked)
  const [likesCount,   setLikesCount]   = useState(comment.likes_count)
  const [replies,      setReplies]      = useState<Comment[]>(comment.replies ?? [])
  const [showReply,    setShowReply]    = useState(false)
  const [replyText,    setReplyText]    = useState("")
  const [replyFiles,   setReplyFiles]   = useState<File[]>([])
  const [lightboxIdx,  setLightboxIdx]  = useState<number | null>(null)
  const [showMenu,     setShowMenu]     = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [editing,         setEditing]         = useState(false)
  const [editText,        setEditText]        = useState(comment.comment)
  const [commentText,     setCommentText]     = useState(comment.comment)
  const [commentMedia,    setCommentMedia]    = useState(comment.media ?? [])
  const [removedMediaIds, setRemovedMediaIds] = useState<number[]>([])
  const [editFiles,       setEditFiles]       = useState<File[]>([])

  const isOwner   = currentUserId !== undefined && comment.author.id === currentUserId
  const allImages = commentMedia.filter((m) => m.type === "image")
  const images    = editing
    ? allImages.filter((m) => !removedMediaIds.includes(m.id))
    : allImages
  const replyFileInput = useRef<HTMLInputElement>(null)
  const editFileInput  = useRef<HTMLInputElement>(null)
  const menuRef        = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showMenu) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [showMenu])

  const { mutate: toggleLike } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/publications/${publicationId}/comments/${comment.id}/like`, {
        method: "POST", credentials: "include",
      })
      if (!res.ok) throw new Error("Erro ao curtir")
      return res.json()
    },
    onMutate: () => {
      const wasLiked = liked
      setLiked(!wasLiked)
      setLikesCount((n) => wasLiked ? n - 1 : n + 1)
    },
    onError: () => {
      setLiked((v) => !v)
      setLikesCount((n) => liked ? n + 1 : n - 1)
    },
  })

  const { mutate: submitReply, isPending: isReplying } = useMutation({
    mutationFn: () => postComment(publicationId, replyText.trim(), comment.id, replyFiles),
    onSuccess: (reply) => {
      setReplies((prev) => [...prev, reply])
      setReplyText("")
      setReplyFiles([])
      setShowReply(false)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const { mutate: deleteComment, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/publications/${publicationId}/comments/${comment.id}`, {
        method: "DELETE", credentials: "include",
      })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.message ?? "Erro ao excluir") }
    },
    onSuccess: () => { toast.success("Comentário excluído."); onDeleted?.(comment.id) },
    onError:   (err: Error) => toast.error(err.message),
  })

  const { mutate: saveEdit, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      const fd = new FormData()
      fd.append("comment", editText.trim())
      removedMediaIds.forEach((id) => fd.append("remove_media[]", String(id)))
      editFiles.forEach((f) => fd.append("media[]", f))
      const res = await fetch(`/api/publications/${publicationId}/comments/${comment.id}`, {
        method: "PUT", credentials: "include", body: fd,
      })
      const d = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(d.message ?? "Erro ao editar")
      return d
    },
    onSuccess: (d) => {
      setCommentText(editText.trim())
      if (d?.data?.media) setCommentMedia(d.data.media)
      setEditing(false)
      setRemovedMediaIds([])
      setEditFiles([])
      toast.success("Comentário atualizado.")
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const addReplyFiles = (newFiles: FileList | null) => {
    if (!newFiles) return
    setReplyFiles((prev) => [...prev, ...Array.from(newFiles)].slice(0, 5))
  }

  return (
    <div className={`flex gap-${mobile ? "2.5" : "3"} w-full`}>
      <div className={`${avatarSize} rounded-full bg-[#E0E0E0] flex items-center justify-center shrink-0 overflow-hidden`}>
        {comment.author.avatar
          ? <img src={comment.author.avatar.thumb_url} alt={comment.author.name} className="w-full h-full object-cover" />
          : <span className="font-inter font-semibold text-xs text-black">{initials}</span>
        }
      </div>

      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-inter font-semibold text-[13px] text-black">{comment.author.name}</span>
          <span className="font-inter text-[11px] text-[#999999]">{formatDate(comment.created_at)}</span>
          {isOwner && (
            <div ref={menuRef} className="relative ml-auto">
              <button
                onClick={() => setShowMenu((v) => !v)}
                className="text-[#CCCCCC] hover:text-[#999999] transition-colors"
              >
                <Icon icon="lucide:ellipsis" width={14} height={14} />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] py-1 min-w-[120px]">
                  <button
                    onClick={() => { setEditing(true); setEditText(commentText); setRemovedMediaIds([]); setEditFiles([]); setShowMenu(false) }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-[#F9F9F9] transition-colors font-inter text-[13px] text-[#333333]"
                  >
                    <Icon icon="lucide:pencil" width={13} height={13} className="text-[#666666]" />
                    Editar
                  </button>
                  <button
                    onClick={() => { setShowMenu(false); setConfirmDelete(true) }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-[#FFF5F5] transition-colors font-inter text-[13px] text-red-500"
                  >
                    <Icon icon="lucide:trash-2" width={13} height={13} />
                    Excluir
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Existing media (view mode only) */}
        {!editing && images.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mt-0.5">
            {images.map((m, i) => (
              <img
                key={m.id}
                src={m.thumb_url}
                alt=""
                onClick={() => setLightboxIdx(i)}
                className="w-16 h-16 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
              />
            ))}
          </div>
        )}

        {lightboxIdx !== null && (
          <Lightbox images={images} initialIndex={lightboxIdx} onClose={() => setLightboxIdx(null)} />
        )}

        {editing ? (
          <div className="flex flex-col gap-2 mt-0.5">
            {/* existing media with remove */}
            {(images.length > 0 || editFiles.length > 0) && (
              <div className="flex gap-1.5 flex-wrap">
                {images.map((m) => (
                  <div key={m.id} className="relative w-16 h-16 shrink-0">
                    <img src={m.thumb_url} alt="" className="w-full h-full rounded-lg object-cover" />
                    <button
                      type="button"
                      onClick={() => setRemovedMediaIds((prev) => [...prev, m.id])}
                      className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-black/60 flex items-center justify-center"
                    >
                      <Icon icon="lucide:x" width={9} height={9} className="text-white" />
                    </button>
                  </div>
                ))}
                {editFiles.map((f, i) => (
                  <div key={i} className="relative w-16 h-16 shrink-0">
                    <img src={URL.createObjectURL(f)} alt="" className="w-full h-full rounded-lg object-cover" />
                    <button
                      type="button"
                      onClick={() => setEditFiles((prev) => prev.filter((_, j) => j !== i))}
                      className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-black/60 flex items-center justify-center"
                    >
                      <Icon icon="lucide:x" width={9} height={9} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <textarea
              autoFocus
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={3}
              className="w-full bg-[#F5F5F5] rounded-lg px-3 py-2 font-inter text-[13px] text-[#333333] focus:outline-none resize-none border border-[#EEEEEE] focus:border-[#CCCCCC]"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => { if (editText.trim()) saveEdit() }}
                disabled={!editText.trim() || isSaving}
                className="h-7 px-3 rounded-lg bg-black font-inter text-[12px] font-semibold text-white disabled:opacity-40"
              >
                {isSaving ? "Salvando..." : "Salvar"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="h-7 px-3 rounded-lg bg-[#F0F0F0] font-inter text-[12px] text-[#666666]"
              >
                Cancelar
              </button>
              <input
                ref={editFileInput}
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (!e.target.files) return
                  setEditFiles((prev) => [...prev, ...Array.from(e.target.files!)].slice(0, 5 - images.length))
                }}
              />
              <button
                type="button"
                onClick={() => editFileInput.current?.click()}
                className={`ml-auto transition-colors ${editFiles.length > 0 ? "text-black" : "text-[#999999] hover:text-[#666666]"}`}
              >
                <Icon icon="lucide:image" width={15} height={15} />
              </button>
            </div>
          </div>
        ) : (
          <p className={`font-inter text-[${mobile ? "13" : "14"}px] text-[#333333] leading-[1.4]`}>{commentText}</p>
        )}
        <div className="flex items-center gap-3 mt-0.5">
          <button
            onClick={() => toggleLike()}
            className={`flex items-center gap-1 font-inter text-[11px] transition-colors ${liked ? "text-red-500" : "text-[#999999] hover:text-[#666666]"}`}
          >
            <Icon icon={liked ? "ph:heart-fill" : "lucide:heart"} width={12} height={12} />
            {likesCount > 0 && <span>{likesCount}</span>}
            <span>Curtir</span>
          </button>
          <button
            onClick={() => setShowReply((v) => !v)}
            className={`font-inter text-[11px] transition-colors ${showReply ? "text-black font-semibold" : "text-[#999999] hover:text-[#666666]"}`}
          >
            Responder
          </button>
        </div>

        {showReply && (
          <div className="flex flex-col gap-1.5 mt-1.5">
            {replyFiles.length > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                {replyFiles.map((f, i) => (
                  <div key={i} className="relative w-14 h-14">
                    <img src={URL.createObjectURL(f)} alt="" className="w-full h-full rounded-lg object-cover" />
                    <button
                      onClick={() => setReplyFiles((prev) => prev.filter((_, j) => j !== i))}
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black flex items-center justify-center"
                    >
                      <Icon icon="lucide:x" width={9} height={9} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                autoFocus
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && replyText.trim()) submitReply() }}
                placeholder="Escreva uma resposta..."
                className="flex-1 h-8 px-3 rounded-full bg-[#F5F5F5] border border-[#EEEEEE] font-inter text-[12px] text-[#333333] placeholder:text-[#999999] focus:outline-none"
              />
              <input ref={replyFileInput} type="file" accept="image/*,video/*" multiple className="hidden"
                onChange={(e) => addReplyFiles(e.target.files)} />
              <button onClick={() => replyFileInput.current?.click()} className="text-[#999999] hover:text-[#666666] shrink-0">
                <Icon icon="lucide:image" width={15} height={15} />
              </button>
              <button
                onClick={() => { if (replyText.trim()) submitReply() }}
                disabled={!replyText.trim() || isReplying}
                className="w-8 h-8 rounded-full bg-black flex items-center justify-center shrink-0 disabled:opacity-40"
              >
                {isReplying
                  ? <Icon icon="lucide:loader" width={13} height={13} className="text-white animate-spin" />
                  : <Icon icon="lucide:send"   width={13} height={13} className="text-white" />
                }
              </button>
            </div>
          </div>
        )}

        {replies.length > 0 && (
          <div className="flex flex-col gap-3 mt-2 pl-2 border-l-2 border-[#F0F0F0]">
            {replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                mobile={mobile}
                publicationId={publicationId}
                currentUserId={currentUserId}
                onDeleted={(rid) => setReplies((prev) => prev.filter((r) => r.id !== rid))}
              />
            ))}
          </div>
        )}
      </div>

      {confirmDelete && (
        <ConfirmModal
          title="Excluir comentário"
          description="Tem certeza que deseja excluir este comentário? Esta ação não pode ser desfeita."
          confirmLabel="Excluir"
          loading={isDeleting}
          onConfirm={() => deleteComment()}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  )
}

// ─── comment input ───────────────────────────────────────────────────────────

function CommentInput({
  publicationId,
  mobile,
  onAdded,
}: {
  publicationId: number
  mobile?:       boolean
  onAdded:       (c: Comment) => void
}) {
  const currentUser = useUserStore((s) => s.user)
  const [text,  setText]  = useState("")
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef      = useRef<HTMLInputElement>(null)

  const { mutate: submit, isPending } = useMutation({
    mutationFn: () => postComment(publicationId, text.trim(), undefined, files.length > 0 ? files : undefined),
    onSuccess:  (comment) => {
      onAdded(comment)
      setText("")
      setFiles([])
      toast.success("Comentário publicado.")
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return
    setFiles((prev) => [...prev, ...Array.from(newFiles)].slice(0, 5))
  }

  const initials     = currentUser ? getInitials(currentUser.name) : "?"
  const sendSize     = mobile ? "w-10 h-10" : "w-11 h-11"
  const containerBg  = mobile ? "bg-white" : "bg-[#FAFAFA]"
  const containerPad = mobile ? "p-3 px-4" : "p-4 px-6"

  return (
    <div className={`flex flex-col gap-2 ${containerBg} ${containerPad}`}>
      {files.length > 0 && (
        <div className="flex gap-1.5 flex-wrap pl-11">
          {files.map((f, i) => (
            <div key={i} className="relative w-14 h-14">
              <img src={URL.createObjectURL(f)} alt="" className="w-full h-full rounded-lg object-cover" />
              <button
                onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black flex items-center justify-center"
              >
                <Icon icon="lucide:x" width={9} height={9} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
          <span className="font-inter font-semibold text-sm text-black">{initials}</span>
        </div>

        <div className={`flex-1 flex items-center justify-between bg-white ${mobile ? "rounded-[20px] bg-[#F5F5F5]" : "rounded-[22px]"} h-10 px-4 border border-[#EEEEEE]`}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && text.trim()) submit() }}
            placeholder="Escreva um comentário..."
            className="bg-transparent flex-1 font-inter text-sm text-[#333333] placeholder:text-[#999999] focus:outline-none min-w-0"
          />
          <div className="flex items-center gap-2.5 ml-2">
            <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple className="hidden"
              onChange={(e) => addFiles(e.target.files)} />
            <button onClick={() => fileInputRef.current?.click()} className={`transition-colors ${files.length > 0 ? "text-black" : "text-[#999999] hover:text-[#666666]"}`}>
              <Icon icon="lucide:image" width={18} height={18} />
            </button>
          </div>
        </div>

        <button
          onClick={() => { if (text.trim()) submit() }}
          disabled={!text.trim() || isPending}
          className={`${sendSize} rounded-full bg-black flex items-center justify-center shrink-0 disabled:opacity-40 transition-opacity`}
        >
          {isPending
            ? <Icon icon="lucide:loader" width={16} height={16} className="text-white animate-spin" />
            : <Icon icon="lucide:send"   width={16} height={16} className="text-white" />
          }
        </button>
      </div>
    </div>
  )
}

// ─── image carousel ──────────────────────────────────────────────────────────

function ImageCarousel({ post, className }: { post: Publication; className?: string }) {
  const images  = post.media.filter((m) => m.type === "image")
  const [idx, setIdx] = useState(0)

  if (images.length === 0) return null

  return (
    <div className={`relative ${className ?? ""}`}>
      <img
        src={images[idx].url}
        alt=""
        className="w-full h-full object-cover"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center"
            style={{ display: idx === 0 ? "none" : "flex" }}
          >
            <Icon icon="lucide:chevron-left" width={16} height={16} className="text-white" />
          </button>
          <button
            onClick={() => setIdx((i) => Math.min(images.length - 1, i + 1))}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center"
            style={{ display: idx === images.length - 1 ? "none" : "flex" }}
          >
            <Icon icon="lucide:chevron-right" width={16} height={16} className="text-white" />
          </button>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === idx ? "bg-black" : "bg-[#CCCCCC]"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── skeleton ────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="animate-pulse">
      <div className="hidden md:flex gap-8 px-8 py-8 pt-[96px]">
        <div className="w-[600px] h-[500px] rounded-2xl bg-[#E0E0E0]" />
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#E0E0E0]" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 bg-[#E0E0E0] rounded w-32" />
                <div className="h-3 bg-[#E0E0E0] rounded w-24" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-3 bg-[#E0E0E0] rounded w-full" />
              <div className="h-3 bg-[#E0E0E0] rounded w-4/5" />
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden flex flex-col pt-14">
        <div className="w-full h-[300px] bg-[#E0E0E0]" />
        <div className="bg-white p-4 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#E0E0E0]" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-4 bg-[#E0E0E0] rounded w-32" />
              <div className="h-3 bg-[#E0E0E0] rounded w-24" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-3 bg-[#E0E0E0] rounded w-full" />
            <div className="h-3 bg-[#E0E0E0] rounded w-3/5" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function PublicationPage() {
  const { id }      = useParams<{ id: string }>()
  const router      = useRouter()
  const queryClient = useQueryClient()
  const currentUser = useUserStore((s) => s.user)
  const queryKey    = ["publication", id]

  const [showMenuDesktop, setShowMenuDesktop] = useState(false)
  const [showMenuMobile,  setShowMenuMobile]  = useState(false)
  const [liked,      setLiked]     = useState(false)
  const [comments,   setComments]  = useState<Comment[]>([])
  const [sortOrder,  setSortOrder] = useState<"recent" | "oldest" | "popular">("recent")
  const [showSortMenu, setShowSortMenu] = useState(false)

  const sortedComments = [...comments].sort((a, b) => {
    if (sortOrder === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    if (sortOrder === "popular") return (b.likes_count + (b.replies?.length ?? 0)) - (a.likes_count + (a.replies?.length ?? 0))
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  const sortLabels = { recent: "Mais recentes", oldest: "Mais antigos", popular: "Populares" }

  const { data: post, isLoading, isError } = useQuery({
    queryKey,
    queryFn:  () => fetchPublication(id),
  })

  useEffect(() => {
    if (post) {
      setLiked(post.is_liked)
      setComments(post.comments ?? [])
    }
  }, [post])

  const { mutate: toggleLike } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/publications/${id}/like`, { method: "POST", credentials: "include" })
      if (!res.ok) throw new Error("Erro ao curtir")
    },
    onMutate: () => {
      const wasLiked = liked
      setLiked(!wasLiked)
      queryClient.setQueryData<Publication>(queryKey, (old) =>
        old ? { ...old, is_liked: !wasLiked, likes_count: wasLiked ? old.likes_count - 1 : old.likes_count + 1 } : old
      )
      return { wasLiked }
    },
    onError: (_err, _vars, ctx) => {
      const wasLiked = ctx?.wasLiked ?? liked
      setLiked(wasLiked)
      queryClient.setQueryData<Publication>(queryKey, (old) =>
        old ? { ...old, is_liked: wasLiked, likes_count: wasLiked ? old.likes_count + 1 : old.likes_count - 1 } : old
      )
    },
  })

  if (isLoading) return <Skeleton />
  if (isError || !post) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
          <p className="font-inter text-sm text-[#666666]">Publicação não encontrada.</p>
          <button onClick={() => router.back()} className="mt-4 font-inter text-sm text-black underline">Voltar</button>
        </div>
      </div>
    )
  }

  const isAuthor            = currentUser?.id === post.author.id
  const isFollowing         = post.author.is_following
  const pubCity             = post.city ?? null
  const pubLocation         = pubCity ? `${pubCity.name}${pubCity.state ? `, ${pubCity.state.uf}` : ""}` : ""
  const authorPrimaryCategory = post.author.categories?.[0]?.name ?? ""
  const authorCity          = post.author.city ?? null
  const authorLocation      = authorCity ? `${authorCity.name}${authorCity.state ? `, ${authorCity.state.uf}` : ""}` : ""
  const initials            = getInitials(post.author.name)
  const hasImages       = post.media.some((m) => m.type === "image")

  const handleCommentAdded = (c: Comment) => setComments((prev) => [c, ...prev])

  // ── desktop ──────────────────────────────────────────────────────────────

  const PostDetails = (
    <div className="bg-white rounded-t-2xl p-6 flex flex-col gap-5">
      {/* Author row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#E0E0E0] shrink-0 overflow-hidden flex items-center justify-center">
            {post.author.avatar
              ? <img src={post.author.avatar.thumb_url} alt={post.author.name} className="w-full h-full object-cover" />
              : <span className="font-inter font-semibold text-sm text-black">{initials}</span>
            }
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="font-inter font-semibold text-[15px] text-black">{post.author.name}</span>
              <span className="font-inter text-xs text-[#999999]">@{post.author.username}</span>
              <span className={`font-inter text-[11px] font-medium px-2 py-0.5 rounded-[10px] shrink-0 ${post.type === 1 ? "bg-primary text-black" : "bg-black text-white"}`}>
                {post.type === 1 ? "Prestador" : "Cliente"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {authorPrimaryCategory && (
                <span className="font-inter text-[13px] font-medium text-primary">{authorPrimaryCategory}</span>
              )}
              {authorPrimaryCategory && authorLocation && (
                <span className="font-inter text-[13px] text-[#999999]">·</span>
              )}
              {authorLocation && (
                <span className="font-inter text-[13px] text-[#999999]">{authorLocation}</span>
              )}
            </div>
          </div>
        </div>

        <div className="relative flex flex-col items-end gap-1">
          <button onClick={() => setShowMenuDesktop((v) => !v)} className="text-[#666666]">
            <Icon icon="lucide:ellipsis" width={20} height={20} />
          </button>
          <span className="font-inter text-[11px] text-[#999999]">{formatDate(post.created_at)}</span>
          {showMenuDesktop && (
            <PostMenuPopup
              post={post}
              queryKey={queryKey}
              onClose={() => setShowMenuDesktop(false)}
              onDeleted={() => router.back()}
              hideView
            />
          )}
        </div>
      </div>

      {/* Mentions */}
      {post.mentions.length > 0 && (
        <p className="font-inter text-[13px] text-[#999999]">
          {post.mentions.map((m) => (
            <span key={m.id} className="text-primary font-medium">@{m.username}{" "}</span>
          ))}
          <span>{post.mentions.length === 1 ? "foi mencionado" : "foram mencionados"} neste post</span>
        </p>
      )}

      {/* Text + tags */}
      <PostText
        text={post.text}
        mentions={post.mentions}
        tags={post.tags}
        className="font-inter text-[15px] text-[#333333] leading-[1.6]"
      />

      {/* Categories + publication location */}
      {(post.categories.length > 0 || pubLocation) && (
        <div className="flex items-center gap-2 flex-wrap">
          {post.categories.map((cat) => (
            <span key={cat.id} className="font-inter text-xs font-medium px-3 py-1.5 rounded-2xl bg-[#F0F0F0] text-[#666666] cursor-pointer">
              {cat.name}
            </span>
          ))}
          {pubLocation && (
            <div className="flex items-center gap-1.5">
              <Icon icon="lucide:map-pin" width={14} height={14} className="text-[#999999]" />
              <span className="font-inter text-[13px] text-[#999999]">{pubLocation}</span>
            </div>
          )}
        </div>
      )}

      {/* Interactions */}
      <div className="flex items-center gap-6 pt-4 border-t border-[#F5F5F5]">
        <button
          onClick={() => toggleLike()}
          className={`flex items-center gap-2 transition-colors ${liked ? "text-red-500" : "text-[#666666]"}`}
        >
          <Icon icon={liked ? "ph:heart-fill" : "lucide:heart"} width={22} height={22} />
          <span className="font-inter text-[14px] font-medium">{post.likes_count}</span>
        </button>
        <button className="flex items-center gap-2 text-[#666666]">
          <Icon icon="lucide:message-circle" width={22} height={22} />
          <span className="font-inter text-[14px] font-medium">{comments.length}</span>
        </button>
        <button className="flex items-center gap-2 text-[#666666]">
          <Icon icon="lucide:share-2" width={22} height={22} />
          <span className="font-inter text-[14px] text-[#666666]">Compartilhar</span>
        </button>
      </div>
    </div>
  )

  const CommentsSection = (
    <div className="bg-white rounded-b-2xl">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#FAFAFA] px-6 py-4">
        <span className="font-inter font-semibold text-[15px] text-black">
          Comentários ({comments.length})
        </span>
        <div className="relative">
          <button
            onClick={() => setShowSortMenu((v) => !v)}
            className="flex items-center gap-1.5 text-[#666666] hover:text-black transition-colors"
          >
            <span className="font-inter text-[13px]">{sortLabels[sortOrder]}</span>
            <Icon icon="lucide:chevron-down" width={14} height={14} />
          </button>
          {showSortMenu && (
            <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] py-1 min-w-[140px]">
              {(["recent", "oldest", "popular"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setSortOrder(opt); setShowSortMenu(false) }}
                  className={`w-full text-left px-4 py-2 font-inter text-[13px] hover:bg-[#F9F9F9] transition-colors ${sortOrder === opt ? "font-semibold text-black" : "text-[#333333]"}`}
                >
                  {sortLabels[opt]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <CommentInput publicationId={post.id} onAdded={handleCommentAdded} />

      {/* List */}
      <div className="flex flex-col gap-5 px-6 py-5">
        {sortedComments.length === 0 && (
          <p className="font-inter text-sm text-[#999999] text-center py-4">Nenhum comentário ainda. Seja o primeiro!</p>
        )}
        {sortedComments.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            publicationId={post.id}
            currentUserId={currentUser?.id}
            onDeleted={(cid) => setComments((prev) => prev.filter((x) => x.id !== cid))}
          />
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F5F5F5]">

      {/* ── desktop ── */}
      <div className="hidden md:block">
        <FeedHeader />
        <div className="flex gap-8 px-8 py-8 pt-[96px] items-start">
          {hasImages && (
            <ImageCarousel
              post={post}
              className="w-[600px] rounded-2xl overflow-hidden bg-[#E0E0E0] shrink-0 sticky top-[96px]"
            />
          )}

          {/* Right: details + comments */}
          <div className="flex flex-col flex-1 min-w-0">
            {PostDetails}
            {CommentsSection}
          </div>
        </div>
      </div>

      {/* ── mobile ── */}
      <div className="md:hidden flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white h-14 flex items-center justify-between px-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <button onClick={() => router.back()} className="text-[#333333]">
            <Icon icon="lucide:arrow-left" width={24} height={24} />
          </button>
          <span className="font-inter font-semibold text-base text-black">Publicação</span>
          <div className="relative">
            <button onClick={() => setShowMenuMobile((v) => !v)} className="text-[#333333]">
              <Icon icon="lucide:ellipsis" width={24} height={24} />
            </button>
            {showMenuMobile && (
              <PostMenuPopup
                post={post}
                queryKey={queryKey}
                onClose={() => setShowMenuMobile(false)}
                onDeleted={() => router.back()}
  
                hideView
              />
            )}
          </div>
        </header>

        <div className="flex flex-col pt-14 pb-16">
          {/* Image */}
          {hasImages && (
            <ImageCarousel post={post} className="w-full h-[300px] bg-[#E0E0E0]" />
          )}

          {/* Post details */}
          <div className="bg-white px-4 py-4 flex flex-col gap-4">
            {/* Author row */}
            <div className="flex items-center gap-3 w-full">
              <div className="w-11 h-11 rounded-full bg-[#E0E0E0] shrink-0 overflow-hidden flex items-center justify-center">
                {post.author.avatar
                  ? <img src={post.author.avatar.thumb_url} alt={post.author.name} className="w-full h-full object-cover" />
                  : <span className="font-inter font-semibold text-sm text-black">{initials}</span>
                }
              </div>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-inter font-semibold text-[15px] text-black truncate">{post.author.name}</span>
                  <span className="font-inter text-[11px] text-[#999999] truncate">@{post.author.username}</span>
                  <span className={`font-inter text-[11px] font-medium px-2 py-0.5 rounded-[10px] shrink-0 ${post.type === 1 ? "bg-primary text-black" : "bg-black text-white"}`}>
                    {post.type === 1 ? "Prestador" : "Cliente"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {authorPrimaryCategory && (
                    <span className="font-inter text-xs font-medium text-primary">{authorPrimaryCategory}</span>
                  )}
                  {authorPrimaryCategory && authorLocation && (
                    <span className="font-inter text-xs text-[#999999]">·</span>
                  )}
                  {authorLocation && (
                    <span className="font-inter text-xs text-[#999999]">{authorLocation}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                {!isAuthor && !isFollowing && (
                  <button className="h-8 px-4 rounded-2xl bg-black font-inter text-xs font-semibold text-white">
                    Seguir
                  </button>
                )}
                <span className="font-inter text-[10px] text-[#999999]">{formatDate(post.created_at)}</span>
              </div>
            </div>

            {/* Mentions */}
            {post.mentions.length > 0 && (
              <p className="font-inter text-[12px] text-[#999999]">
                {post.mentions.map((m) => (
                  <span key={m.id} className="text-primary font-medium">@{m.username}{" "}</span>
                ))}
                <span>{post.mentions.length === 1 ? "foi mencionado" : "foram mencionados"} neste post</span>
              </p>
            )}

            {/* Text + tags */}
            <PostText
              text={post.text}
              mentions={post.mentions}
              tags={post.tags}
              className="font-inter text-[14px] text-[#333333] leading-[1.5]"
            />

            {/* Categories + publication location row */}
            {(post.categories.length > 0 || pubLocation) && (
              <div className="flex items-center gap-2 flex-wrap">
                {post.categories.map((cat) => (
                  <span key={cat.id} className="font-inter text-[11px] font-medium px-2.5 py-1 rounded-xl bg-[#F0F0F0] text-[#666666] cursor-pointer">
                    {cat.name}
                  </span>
                ))}
                {pubLocation && (
                  <div className="flex items-center gap-1">
                    <Icon icon="lucide:map-pin" width={12} height={12} className="text-[#999999]" />
                    <span className="font-inter text-xs text-[#999999]">{pubLocation}</span>
                  </div>
                )}
              </div>
            )}

            {/* Interactions */}
            <div className="flex items-center justify-between pt-3 border-t border-[#F5F5F5]">
              <div className="flex items-center gap-5">
                <button
                  onClick={() => toggleLike()}
                  className={`flex items-center gap-1.5 transition-colors ${liked ? "text-red-500" : "text-[#666666]"}`}
                >
                  <Icon icon={liked ? "ph:heart-fill" : "lucide:heart"} width={20} height={20} />
                  <span className="font-inter text-[13px] font-medium">{post.likes_count}</span>
                </button>
                <button className="flex items-center gap-1.5 text-[#666666]">
                  <Icon icon="lucide:message-circle" width={20} height={20} />
                  <span className="font-inter text-[13px] font-medium">{comments.length}</span>
                </button>
                <button className="text-[#666666]">
                  <Icon icon="lucide:share-2" width={20} height={20} />
                </button>
              </div>
              <button className="text-[#666666]">
                <Icon icon="lucide:bookmark" width={20} height={20} />
              </button>
            </div>
          </div>

          {/* Comments section */}
          <div className="bg-white mt-2 flex flex-col flex-1">
            <div className="flex items-center justify-between bg-[#FAFAFA] px-4 py-3">
              <span className="font-inter font-semibold text-[14px] text-black">
                Comentários ({comments.length})
              </span>
              <div className="relative">
                <button
                  onClick={() => setShowSortMenu((v) => !v)}
                  className="flex items-center gap-1.5 text-[#666666]"
                >
                  <span className="font-inter text-[13px]">{sortLabels[sortOrder]}</span>
                  <Icon icon="lucide:chevron-down" width={14} height={14} />
                </button>
                {showSortMenu && (
                  <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] py-1 min-w-[140px]">
                    {(["recent", "oldest", "popular"] as const).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { setSortOrder(opt); setShowSortMenu(false) }}
                        className={`w-full text-left px-4 py-2 font-inter text-[13px] hover:bg-[#F9F9F9] transition-colors ${sortOrder === opt ? "font-semibold text-black" : "text-[#333333]"}`}
                      >
                        {sortLabels[opt]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <CommentInput publicationId={post.id} mobile onAdded={handleCommentAdded} />

            <div className="flex flex-col gap-4 px-4 py-3">
              {sortedComments.length === 0 && (
                <p className="font-inter text-sm text-[#999999] text-center py-4">Nenhum comentário ainda. Seja o primeiro!</p>
              )}
              {sortedComments.map((c) => (
                <CommentItem
                  key={c.id}
                  comment={c}
                  mobile
                  publicationId={post.id}
                  currentUserId={currentUser?.id}
                  onDeleted={(cid) => setComments((prev) => prev.filter((x) => x.id !== cid))}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sticky comment input above bottom nav */}
        <BottomNav />
      </div>
    </div>
  )
}
