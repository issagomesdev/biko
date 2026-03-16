"use client"

import { useEffect, useRef } from "react"
import { useFeed }            from "@/src/hooks/useFeed"
import { useFeedStore }       from "@/src/stores/feed-store"
import { PostCard }           from "@/src/components/post/PostCard"
import { CreatePost }         from "@/src/components/feed/CreatePost"
import { FilterSidebar }      from "@/src/components/feed/FilterSidebar"

function PostSkeleton() {
  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-3 md:p-5 flex flex-col gap-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-[#E0E0E0] shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-3.5 bg-[#E0E0E0] rounded w-32" />
          <div className="h-3 bg-[#E0E0E0] rounded w-24" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-3 bg-[#E0E0E0] rounded w-full" />
        <div className="h-3 bg-[#E0E0E0] rounded w-4/5" />
        <div className="h-3 bg-[#E0E0E0] rounded w-3/5" />
      </div>
    </div>
  )
}

function FeedList() {
  const { posts, isFetchingNextPage, hasNextPage, fetchNextPage, status, queryKey } = useFeed()
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Intersection Observer para infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { rootMargin: "200px" }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  if (status === "pending") {
    return (
      <div className="flex flex-col gap-5">
        {Array.from({ length: 4 }).map((_, i) => <PostSkeleton key={i} />)}
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="bg-white rounded-2xl p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <p className="font-inter text-sm text-[#666666]">Erro ao carregar publicações. Tente novamente.</p>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <p className="font-inter text-sm text-[#666666]">Nenhuma publicação encontrada.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} queryKey={queryKey} />
      ))}

      {/* Sentinel para infinite scroll */}
      <div ref={sentinelRef} />

      {isFetchingNextPage && <PostSkeleton />}

      {!hasNextPage && posts.length > 0 && (
        <p className="text-center font-inter text-xs text-[#999999] pb-4">Você chegou ao fim</p>
      )}
    </div>
  )
}

export function FeedContent() {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex gap-6 px-[60px] py-6">
        <FilterSidebar />
        <div className="flex-1 flex flex-col gap-5 min-w-0">
          <CreatePost />
          <FeedList />
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex flex-col gap-4 p-4">
        <FeedList />
      </div>
    </>
  )
}
