import { FeedHeader }    from "@/src/components/feed/FeedHeader"
import { FilterSidebar } from "@/src/components/feed/FilterSidebar"
import { CreatePost }    from "@/src/components/feed/CreatePost"
import { PostCard }      from "@/src/components/post/PostCard"
import { BottomNav }     from "@/src/components/layout/BottomNav"
import type { Post }     from "@/src/components/post/PostCard"

const MOCK_POSTS: Post[] = [
  {
    id:     1,
    author: { name: "Maria Santos",      initials: "MS", category: "Diarista",    location: "São Paulo, SP",    isProvider: true },
    content:  "Serviço de limpeza residencial concluído! Casa brilhando ✨ Atendo toda região da zona sul. Entre em contato para orçamento sem compromisso.",
    image:    "https://images.unsplash.com/photo-1591208854190-d08149f6ecd7?w=800&q=80",
    likes:    24,
    comments: 8,
  },
  {
    id:     2,
    author: { name: "João Eletricista",  initials: "JE", category: "Eletricista", location: "São Paulo, SP",    isProvider: true },
    content:  "Instalação elétrica finalizada! Projeto completo com quadro de distribuição novo e pontos de iluminação LED. Trabalho garantido e com nota fiscal. 💡⚡",
    image:    "https://images.unsplash.com/photo-1588829281045-f8621cda0122?w=800&q=80",
    likes:    31,
    comments: 5,
  },
]

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <FeedHeader />

      <main className="pt-16 max-md:pt-14 max-md:pb-[60px]">
        {/* Desktop */}
        <div className="hidden md:flex gap-6 px-[60px] py-6">
          <FilterSidebar />
          <div className="flex-1 flex flex-col gap-5 min-w-0">
            <CreatePost />
            {MOCK_POSTS.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex flex-col gap-4 p-4">
          {MOCK_POSTS.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
