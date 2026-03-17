/**
 * Tests for the comment sorting logic used in publications/[id]/page.tsx.
 * The sort is a pure client-side operation, so we extract and test it directly.
 */

import type { Comment } from "@/src/types/publication"

// Replicate the sort logic from the page component
function sortComments(comments: Comment[], order: "recent" | "oldest" | "popular"): Comment[] {
  return [...comments].sort((a, b) => {
    if (order === "oldest")  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    if (order === "popular") return (b.likes_count + (b.replies?.length ?? 0)) - (a.likes_count + (a.replies?.length ?? 0))
    // recent (default)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
}

// ── fixtures ──────────────────────────────────────────────────────────────────

function makeComment(overrides: Partial<Comment>): Comment {
  return {
    id:          1,
    comment:     "Comentário",
    parent_id:   null,
    author:      { id: 10, name: "Fulano", username: "fulano", avatar: null },
    media:       [],
    replies:     [],
    likes_count: 0,
    is_liked:    false,
    created_at:  "2026-01-01T12:00:00Z",
    ...overrides,
  }
}

const old    = makeComment({ id: 1, created_at: "2026-01-01T08:00:00Z", likes_count: 5, replies: [] })
const middle = makeComment({ id: 2, created_at: "2026-01-01T10:00:00Z", likes_count: 0, replies: [makeComment({ id: 5 })] })
const newest = makeComment({ id: 3, created_at: "2026-01-01T12:00:00Z", likes_count: 2, replies: [] })

const comments = [old, middle, newest]

// ── tests ─────────────────────────────────────────────────────────────────────

describe("sortComments", () => {
  it("'recent' returns newest first", () => {
    const sorted = sortComments(comments, "recent")
    expect(sorted.map((c) => c.id)).toEqual([3, 2, 1])
  })

  it("'oldest' returns oldest first", () => {
    const sorted = sortComments(comments, "oldest")
    expect(sorted.map((c) => c.id)).toEqual([1, 2, 3])
  })

  it("'popular' orders by likes + reply count descending", () => {
    // old:    likes=5, replies=0 → score 5
    // middle: likes=0, replies=1 → score 1
    // newest: likes=2, replies=0 → score 2
    const sorted = sortComments(comments, "popular")
    expect(sorted.map((c) => c.id)).toEqual([1, 3, 2])
  })

  it("does not mutate the original array", () => {
    const original = [old, middle, newest]
    sortComments(original, "oldest")
    expect(original.map((c) => c.id)).toEqual([1, 2, 3])
  })

  it("handles empty array without error", () => {
    expect(sortComments([], "recent")).toEqual([])
  })

  it("handles single comment", () => {
    const result = sortComments([old], "popular")
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(1)
  })

  it("'popular' treats undefined replies as score 0", () => {
    const noReplies = makeComment({ id: 10, likes_count: 3, replies: undefined as unknown as Comment[] })
    const withLikes = makeComment({ id: 11, likes_count: 4, replies: [] })
    const sorted    = sortComments([noReplies, withLikes], "popular")
    expect(sorted[0].id).toBe(11)
  })
})
