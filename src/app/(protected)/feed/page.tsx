import { FeedHeader }  from "@/src/components/feed/FeedHeader"
import { FeedContent } from "@/src/components/feed/FeedContent"
import { BottomNav }   from "@/src/components/layout/BottomNav"

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <FeedHeader />

      <main className="pt-16 max-md:pt-14 max-md:pb-[60px]">
        <FeedContent />
      </main>

      <BottomNav />
    </div>
  )
}
