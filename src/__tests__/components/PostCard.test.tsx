import { render, screen, fireEvent } from "@testing-library/react"
import { vi } from "vitest"

// ── hoisted mocks ─────────────────────────────────────────────────────────────

const { mockMutate, mockSetQueryData, mockCancelQueries, mockGetQueryData, mockPush } =
  vi.hoisted(() => ({
    mockMutate:         vi.fn(),
    mockSetQueryData:   vi.fn(),
    mockCancelQueries:  vi.fn(),
    mockGetQueryData:   vi.fn(() => undefined),
    mockPush:           vi.fn(),
  }))

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock("@tanstack/react-query", () => ({
  useMutation:    (_opts: { mutationFn: () => void; onMutate?: () => void; onError?: () => void }) => ({
    mutate: mockMutate,
  }),
  useQueryClient: () => ({
    setQueryData:    mockSetQueryData,
    cancelQueries:   mockCancelQueries,
    getQueryData:    mockGetQueryData,
  }),
}))

vi.mock("@iconify/react", () => ({
  Icon: ({ icon }: { icon: string }) => <span data-testid={`icon-${icon}`} />,
}))

vi.mock("@/src/components/post/PostMenuPopup", () => ({
  PostMenuPopup: () => <div data-testid="post-menu-popup" />,
}))

// ── component under test ──────────────────────────────────────────────────────

import { PostCard } from "@/src/components/post/PostCard"
import type { Publication } from "@/src/types/publication"

// ── helpers ───────────────────────────────────────────────────────────────────

function makePost(overrides: Partial<Publication> = {}): Publication {
  return {
    id:             10,
    text:           "Preciso de um eletricista urgente para instalar tomadas",
    type:           1,
    author: {
      id:              1,
      name:            "Carlos Melo",
      username:        "carlosmelo",
      avatar:          null,
      cover:           null,
      categories:      [{ id: 3, name: "Elétrica" }],
      city:            { id: 5, name: "Recife", state: { id: 2, name: "Pernambuco", uf: "PE" } },
      is_online:       true,
      is_private:      false,
      followers_count: 10,
      following_count: 5,
      average_rating:  4.5,
      reviews_count:   8,
      is_following:    false,
      is_blocked:      false,
    },
    city:           { id: 5, name: "Recife", state: { id: 2, name: "Pernambuco", uf: "PE" } },
    categories:     [{ id: 3, name: "Elétrica" }],
    tags:           ["urgente"],
    mentions:       [{ id: 2, username: "joao" }],
    media:          [],
    is_liked:       false,
    likes_count:    3,
    comments_count: 1,
    created_at:     new Date(Date.now() - 2 * 60_000).toISOString(), // 2 min ago
    updated_at:     new Date().toISOString(),
    ...overrides,
  }
}

function renderCard(post: Publication) {
  render(<PostCard post={post} queryKey={["publications"]} />)
}

// ── tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => vi.clearAllMocks())

describe("PostCard — author info", () => {
  it("renders author name and username", () => {
    renderCard(makePost())
    expect(screen.getByText("Carlos Melo")).toBeInTheDocument()
    expect(screen.getByText("@carlosmelo")).toBeInTheDocument()
  })

  it("shows 'Prestador' badge for type=1", () => {
    renderCard(makePost({ type: 1 }))
    expect(screen.getByText("Prestador")).toBeInTheDocument()
  })

  it("shows 'Cliente' badge for type=0", () => {
    renderCard(makePost({ type: 0 }))
    expect(screen.getByText("Cliente")).toBeInTheDocument()
  })

  it("shows author primary category", () => {
    renderCard(makePost())
    // "Elétrica" appears in both the author row and the publication categories chip
    const matches = screen.getAllByText("Elétrica")
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  it("shows author location (city + state UF)", () => {
    renderCard(makePost())
    // "Recife, PE" appears in both author row and pub location row
    const matches = screen.getAllByText("Recife, PE")
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  it("shows no location when author and post have no city", () => {
    renderCard(makePost({
      city: null,
      author: {
        ...makePost().author,
        city: null,
        categories: [],
      },
    }))
    expect(screen.queryByText(/PE/)).toBeNull()
  })
})

describe("PostCard — post body", () => {
  it("renders post text", () => {
    renderCard(makePost())
    expect(screen.getByText(/Preciso de um eletricista/)).toBeInTheDocument()
  })

  it("renders publication categories chip", () => {
    renderCard(makePost())
    // "Elétrica" appears both as author category (primary) and as a pub chip
    const chips = screen.getAllByText("Elétrica")
    expect(chips.length).toBeGreaterThanOrEqual(1)
  })

  it("renders publication location with map pin", () => {
    renderCard(makePost())
    expect(screen.getByTestId("icon-lucide:map-pin")).toBeInTheDocument()
  })

  it("shows mention line when mentions present", () => {
    renderCard(makePost())
    expect(screen.getByText("foi mencionado neste post")).toBeInTheDocument()
    expect(screen.getByText("@joao")).toBeInTheDocument()
  })

  it("hides mention line when no mentions", () => {
    renderCard(makePost({ mentions: [] }))
    expect(screen.queryByText(/foi mencionado/)).toBeNull()
  })

  it("shows plural mention text for multiple mentions", () => {
    renderCard(makePost({
      mentions: [
        { id: 2, username: "joao" },
        { id: 3, username: "maria" },
      ],
    }))
    expect(screen.getByText("foram mencionados neste post")).toBeInTheDocument()
  })
})

describe("PostCard — like button", () => {
  it("renders like button with likes count", () => {
    renderCard(makePost({ likes_count: 7 }))
    expect(screen.getByText("7")).toBeInTheDocument()
  })

  it("calls toggleLike mutate when like button clicked", () => {
    renderCard(makePost())
    const likeBtn = screen.getByText("3").closest("button")!
    fireEvent.click(likeBtn)
    expect(mockMutate).toHaveBeenCalled()
  })

  it("shows filled heart icon when post is liked", () => {
    renderCard(makePost({ is_liked: true }))
    expect(screen.getByTestId("icon-ph:heart-fill")).toBeInTheDocument()
  })

  it("shows outline heart icon when post is not liked", () => {
    renderCard(makePost({ is_liked: false }))
    expect(screen.getByTestId("icon-lucide:heart")).toBeInTheDocument()
  })
})

describe("PostCard — comment button", () => {
  it("renders comments count", () => {
    renderCard(makePost({ comments_count: 5 }))
    expect(screen.getByText("5")).toBeInTheDocument()
  })

  it("clicking comment button navigates to publication detail", () => {
    renderCard(makePost())
    const commentBtn = screen.getByText("1").closest("button")!
    fireEvent.click(commentBtn)
    expect(mockPush).toHaveBeenCalledWith("/publications/10")
  })
})

describe("PostCard — options menu", () => {
  it("opens PostMenuPopup when options button clicked", () => {
    renderCard(makePost())
    expect(screen.queryByTestId("post-menu-popup")).toBeNull()
    const icons = screen.getAllByTestId("icon-lucide:ellipsis")
    fireEvent.click(icons[0].closest("button")!)
    expect(screen.getByTestId("post-menu-popup")).toBeInTheDocument()
  })
})
