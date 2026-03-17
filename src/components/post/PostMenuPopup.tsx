"use client"

import { useEffect, useRef, useState }           from "react"
import { useRouter }                             from "next/navigation"
import { Icon }                                  from "@iconify/react"
import { useMutation, useQueryClient }           from "@tanstack/react-query"
import { toast }                                 from "sonner"
import { useUserStore }                          from "@/src/stores/user-store"
import { ConfirmModal }                          from "@/src/components/ui/ConfirmModal"
import type { Publication }                      from "@/src/types/publication"
import type { InfiniteData }                     from "@tanstack/react-query"
import type { PaginatedData }                    from "@/src/types/api"

interface Props {
  post:       Publication
  queryKey:   unknown[]
  onClose:    () => void
  onDeleted?: () => void
  onBlocked?: () => void
  hideView?:  boolean
}

interface MenuItemProps {
  icon:     string
  label:    string
  danger?:  boolean
  loading?: boolean
  onClick?: () => void
}

function MenuItem({ icon, label, danger, loading, onClick }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex items-center gap-2.5 w-full h-10 px-3 rounded-lg transition-colors hover:bg-[#F5F5F5] disabled:opacity-50 ${danger ? "text-[#E53935]" : "text-[#333333]"}`}
    >
      <Icon icon={loading ? "lucide:loader" : icon} width={18} height={18} className={`shrink-0 ${loading ? "animate-spin" : ""} ${danger ? "text-[#E53935]" : "text-[#666666]"}`} />
      <span className="font-inter text-sm truncate min-w-0">{label}</span>
    </button>
  )
}

export function PostMenuPopup({ post, queryKey, onClose, onDeleted, onBlocked, hideView }: Props) {
  const currentUser = useUserStore((s) => s.user)
  const queryClient = useQueryClient()
  const router      = useRouter()
  const ref         = useRef<HTMLDivElement>(null)

  const isAuthor    = currentUser?.id === post.author.id
  const isFollowing = post.author.is_following
  const isBlocked   = post.author.is_blocked
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [onClose])

  const { mutate: followUser, isPending: isFollowPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/users/${post.author.id}/follow`, {
        method:      "POST",
        credentials: "include",
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message ?? "Erro ao seguir usuário")
      return data.data as { status: string }
    },

    onSuccess: ({ status }) => {
      const messages: Record<string, string> = {
        followed:    `Você está seguindo @${post.author.username}.`,
        requested:   `Solicitação enviada para @${post.author.username}.`,
        unfollowed:  `Você deixou de seguir @${post.author.username}.`,
        cancelled:   `Solicitação cancelada.`,
      }
      toast.success(messages[status] ?? "Ação realizada.")

      const nowFollowing = status === "followed" || status === "requested"
      queryClient.setQueryData(
        queryKey,
        (old: unknown) => {
          if (!old) return old
          // feed cache: InfiniteData<PaginatedData<Publication>>
          if (typeof old === "object" && "pages" in (old as object)) {
            const data = old as InfiniteData<PaginatedData<Publication>>
            return {
              ...data,
              pages: data.pages.map((page) => ({
                ...page,
                data: page.data.map((p) =>
                  p.author.id === post.author.id
                    ? { ...p, author: { ...p.author, is_following: nowFollowing } }
                    : p
                ),
              })),
            }
          }
          // detail cache: single Publication
          const pub = old as Publication
          if (pub.author?.id === post.author.id) {
            return { ...pub, author: { ...pub.author, is_following: nowFollowing } }
          }
          return old
        }
      )
      onClose()
    },

    onError: (err: Error) => toast.error(err.message),
  })

  const { mutate: blockUser, isPending: isBlockPending } = useMutation({
    mutationFn: async () => {
      const url = `/api/users/${post.author.id}/block${isBlocked ? "?unblock=1" : ""}`
      const res  = await fetch(url, { method: "POST", credentials: "include" })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message ?? "Erro ao bloquear usuário")
      return !isBlocked
    },

    onSuccess: (nowBlocked) => {
      queryClient.setQueryData(
        queryKey,
        (old: unknown) => {
          if (!old) return old
          if (typeof old === "object" && "pages" in (old as object)) {
            const feed = old as InfiniteData<PaginatedData<Publication>>
            return {
              ...feed,
              pages: feed.pages.map((page) => ({
                ...page,
                data: nowBlocked
                  ? page.data.filter((p) => p.author.id !== post.author.id)
                  : page.data.map((p) =>
                      p.author.id === post.author.id
                        ? { ...p, author: { ...p.author, is_blocked: false } }
                        : p
                    ),
              })),
            }
          }
          // detalhe: atualiza is_blocked
          const pub = old as Publication
          if (pub.author?.id === post.author.id) {
            return { ...pub, author: { ...pub.author, is_blocked: nowBlocked } }
          }
          return old
        }
      )
      toast.success(nowBlocked
        ? `@${post.author.username} foi bloqueado.`
        : `@${post.author.username} foi desbloqueado.`
      )
      onBlocked?.()
      onClose()
    },

    onError: (err: Error) => toast.error(err.message),
  })

  const { mutate: deletePost, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/publications/${post.id}`, {
        method:      "DELETE",
        credentials: "include",
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message ?? "Erro ao excluir publicação")
      }
    },

    onSuccess: () => {
      queryClient.setQueryData<InfiniteData<PaginatedData<Publication>>>(
        queryKey,
        (old) => {
          if (!old) return old
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.filter((p) => p.id !== post.id),
            })),
          }
        }
      )
      toast.success("Publicação excluída com sucesso.")
      onDeleted?.()
      onClose()
    },

    onError: (err: Error) => {
      toast.error(err.message)
    },
  })

  return (
    <div
      ref={ref}
      className="absolute right-0 top-8 z-50 w-[200px] bg-white rounded-xl p-2 flex flex-col shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
    >
      {isAuthor && (
        <MenuItem
          icon="lucide:pencil"
          label="Editar publicação"
          onClick={() => { router.push(`/publications/${post.id}/edit`); onClose() }}
        />
      )}
      {!hideView && (
        <MenuItem icon="lucide:eye" label="Ver publicação" onClick={() => { router.push(`/publications/${post.id}`); onClose() }} />
      )}
      <MenuItem
        icon="lucide:link"
        label="Copiar link"
        onClick={() => {
          navigator.clipboard.writeText(`${window.location.origin}/publications/${post.id}`)
          toast.success("Link copiado!")
          onClose()
        }}
      />
      {!isAuthor && !isBlocked && (
        <MenuItem
          icon={isFollowing ? "lucide:user-minus" : "lucide:user-plus"}
          label={isFollowing ? `Deixar de seguir` : `Seguir @${post.author.username}`}
          loading={isFollowPending}
          onClick={() => followUser()}
        />
      )}
      <MenuItem icon="lucide:bookmark" label="Salvar publicação" />

      <div className="h-px bg-[#EEEEEE] my-1" />

      {isAuthor && (
        <MenuItem
          icon="lucide:trash-2"
          label="Excluir publicação"
          danger
          onClick={() => setConfirmDelete(true)}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Excluir publicação"
          description="Tem certeza que deseja excluir esta publicação? Esta ação não pode ser desfeita."
          confirmLabel="Excluir"
          loading={isPending}
          onConfirm={() => deletePost()}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
      {!isAuthor && (
        <MenuItem
          icon="lucide:ban"
          label={isBlocked ? "Desbloquear" : "Bloquear"}
          danger
          loading={isBlockPending}
          onClick={() => blockUser()}
        />
      )}
    </div>
  )
}
