"use client"

import { useState }          from "react"
import { Icon }              from "@iconify/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { Publication }  from "@/src/types/publication"
import type { InfiniteData } from "@tanstack/react-query"
import type { PaginatedData } from "@/src/types/api"
import { PostMenuPopup }     from "@/src/components/post/PostMenuPopup"

interface PostCardProps {
  post:         Publication
  queryKey:     unknown[]
}

async function likePublication(id: number): Promise<void> {
  const res = await fetch(`/api/publications/${id}/like`, {
    method:      "POST",
    credentials: "include",
  })
  if (!res.ok) throw new Error("Erro ao curtir")
}

function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

function formatDate(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1)  return "agora pouco"
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24)   return `${hours} h`
  const d = new Date(dateStr)
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`
}

export function PostCard({ post, queryKey }: PostCardProps) {
  const queryClient = useQueryClient()
  const [liked,    setLiked]    = useState(post.is_liked)
  const [showMenu, setShowMenu] = useState(false)

  const { mutate: toggleLike } = useMutation({
    mutationFn: () => likePublication(post.id),

    // Optimistic update
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })

      const previous = queryClient.getQueryData(queryKey)

      queryClient.setQueryData<InfiniteData<PaginatedData<Publication>>>(
        queryKey,
        (old) => {
          if (!old) return old
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((p) =>
                p.id === post.id
                  ? { ...p, likes_count: liked ? p.likes_count - 1 : p.likes_count + 1 }
                  : p
              ),
            })),
          }
        }
      )

      setLiked((v) => !v)
      return { previous }
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous)
      setLiked((v) => !v)
    },
  })

  const primaryCategory = post.author.categories?.[0]?.name ?? post.categories?.[0]?.name ?? ""
  const city            = post.city ?? post.author.city ?? null
  const location        = city ? `${city.name}${city.state ? `, ${city.state.uf}` : ""}` : ""
  const initials        = getInitials(post.author.name)
  const firstImage      = post.media.find((m) => m.type === "image")

  return (
    <article className="bg-white rounded-xl md:rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-3 md:p-5 flex flex-col gap-3 md:gap-4">
      {/* Header */}
      <div className="flex items-center gap-3 w-full">
        <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-[#E0E0E0] flex items-center justify-center shrink-0">
          {post.author.avatar
            ? <img src={post.author.avatar.thumb_url} alt={post.author.name} className="w-full h-full rounded-full object-cover" />
            : <span className="font-inter font-semibold text-sm text-black">{initials}</span>
          }
        </div>

        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-inter font-semibold text-sm md:text-[15px] text-black truncate">
              {post.author.name}
            </span>
            <span className={`font-inter text-[11px] font-medium px-2 py-0.5 rounded-[10px] shrink-0 ${post.type === 1 ? "bg-primary text-black" : "bg-black text-white"}`}>
              {post.type === 1 ? "Prestador" : "Cliente"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {primaryCategory && (
              <span className="font-inter text-xs md:text-[13px] font-medium text-primary">{primaryCategory}</span>
            )}
            {primaryCategory && location && (
              <span className="font-inter text-xs md:text-[13px] text-[#999999]">•</span>
            )}
            {location && (
              <span className="font-inter text-xs md:text-[13px] text-[#999999] truncate">{location}</span>
            )}
          </div>
        </div>


        <div className="relative flex flex-col items-end gap-1 shrink-0">
          <button onClick={() => setShowMenu((v) => !v)} className="text-[#999999]">
            <Icon icon="lucide:ellipsis" width={18} height={18} className="md:hidden" />
            <Icon icon="lucide:ellipsis" width={20} height={20} className="hidden md:block" />
          </button>
          <span className="font-inter text-[10px] md:text-[11px] text-[#999999]">{formatDate(post.created_at)}</span>
          {showMenu && <PostMenuPopup post={post} onClose={() => setShowMenu(false)} />}
        </div>
      </div>

      {/* Mentions */}
      {post.mentions.length > 0 && (
        <p className="font-inter text-[12px] md:text-[13px] text-[#999999]">
          {post.mentions.map((m) => (
            <span key={m.id} className="text-primary font-medium">@{m.username}{" "}</span>
          ))}
          <span>{post.mentions.length === 1 ? "foi mencionado" : "foram mencionados"} neste post</span>
        </p>
      )}

      {/* Content */}
      <p className="font-inter text-[13px] md:text-sm text-[#333333] leading-relaxed">
        {post.text}
        {post.tags.map((tag) => (
          <span key={tag} className="font-inter text-[13px] md:text-sm text-primary ml-1">#{tag}</span>
        ))}
      </p>

      {/* Categories */}
      {post.categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {post.categories.map((cat) => (
            <span key={cat.id} className="font-inter text-[11px] md:text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#F5F5F5] text-[#666666]">
              {cat.name}
            </span>
          ))}
        </div>
      )}

      {/* Image */}
      {firstImage && (
        <div className="rounded-xl overflow-hidden h-[200px] md:h-[280px]">
          <img
            src={firstImage.url}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-5">
        <button
          onClick={() => toggleLike()}
          className={`flex items-center gap-1.5 transition-colors ${liked ? "text-red-500" : "text-[#666666]"}`}
        >
          <Icon icon={liked ? "ph:heart-fill" : "lucide:heart"} width={20} height={20} />
          <span className="font-inter text-[13px]">{formatCount(post.likes_count)}</span>
        </button>
        <button className="flex items-center gap-1.5 text-[#666666]">
          <Icon icon="lucide:message-circle" width={20} height={20} />
          <span className="font-inter text-[13px]">{formatCount(post.comments_count)}</span>
        </button>
        <button className="flex items-center gap-1.5 text-[#666666]">
          <Icon icon="lucide:share-2" width={20} height={20} />
        </button>
      </div>
    </article>
  )
}
