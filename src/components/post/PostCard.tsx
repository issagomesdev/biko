import { Icon } from "@iconify/react"

export interface Post {
  id:      number
  author: {
    name:       string
    initials:   string
    category:   string
    location:   string
    isProvider: boolean
  }
  content:   string
  image?:    string
  likes:     number
  comments:  number
}

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="bg-white rounded-xl md:rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-3 md:p-5 flex flex-col gap-3 md:gap-4">
      {/* Header */}
      <div className="flex items-center gap-3 w-full">
        <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-[#E0E0E0] flex items-center justify-center shrink-0">
          <span className="font-inter font-semibold text-sm text-black">{post.author.initials}</span>
        </div>

        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-inter font-semibold text-sm md:text-[15px] text-black truncate">{post.author.name}</span>
            {post.author.isProvider && (
              <span className="bg-primary text-black font-inter text-[11px] font-medium px-2 py-0.5 rounded-[10px] shrink-0">
                Prestador
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-inter text-xs md:text-[13px] font-medium text-primary">{post.author.category}</span>
            <span className="font-inter text-xs md:text-[13px] text-[#999999]">•</span>
            <span className="font-inter text-xs md:text-[13px] text-[#999999] truncate">{post.author.location}</span>
          </div>
        </div>

        <button className="shrink-0 text-[#999999]">
          <Icon icon="lucide:ellipsis" width={18} height={18} className="md:hidden" />
          <Icon icon="lucide:ellipsis" width={20} height={20} className="hidden md:block" />
        </button>
      </div>

      {/* Content */}
      <p className="font-inter text-[13px] md:text-sm text-[#333333] leading-relaxed">{post.content}</p>

      {/* Image */}
      {post.image && (
        <div className="rounded-xl overflow-hidden h-[200px] md:h-[280px]">
          <img src={post.image} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-5">
        <button className="flex items-center gap-1.5 text-[#666666]">
          <Icon icon="lucide:heart" width={20} height={20} />
          <span className="font-inter text-[13px]">{post.likes}</span>
        </button>
        <button className="flex items-center gap-1.5 text-[#666666]">
          <Icon icon="lucide:message-circle" width={20} height={20} />
          <span className="font-inter text-[13px]">{post.comments}</span>
        </button>
        <button className="flex items-center gap-1.5 text-[#666666]">
          <Icon icon="lucide:share-2" width={20} height={20} />
        </button>
      </div>
    </article>
  )
}
