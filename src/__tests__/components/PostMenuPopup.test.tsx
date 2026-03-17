import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { vi, type Mock } from "vitest"

// ── hoisted mock refs (declared before vi.mock factories run) ─────────────────

const {
  mockPush,
  mockToastSuccess,
  mockToastError,
  mockMutate,
  mockSetQueryData,
} = vi.hoisted(() => ({
  mockPush:          vi.fn(),
  mockToastSuccess:  vi.fn(),
  mockToastError:    vi.fn(),
  mockMutate:        vi.fn(),
  mockSetQueryData:  vi.fn(),
}))

// ── module mocks ──────────────────────────────────────────────────────────────

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock("sonner", () => ({
  toast: { success: mockToastSuccess, error: mockToastError },
}))

vi.mock("@/src/stores/user-store", () => ({
  useUserStore: (sel: (s: { user: { id: number } | null }) => unknown) =>
    sel({ user: currentUserRef }),
}))

vi.mock("@tanstack/react-query", () => ({
  useMutation:    () => ({ mutate: mockMutate, isPending: false }),
  useQueryClient: () => ({ setQueryData: mockSetQueryData }),
}))

vi.mock("@iconify/react", () => ({
  Icon: ({ icon }: { icon: string }) => <span data-testid={`icon-${icon}`} />,
}))

vi.mock("@/src/components/ui/ConfirmModal", () => ({
  ConfirmModal: ({
    onConfirm,
    onCancel,
    confirmLabel,
  }: {
    onConfirm: () => void
    onCancel:  () => void
    confirmLabel: string
  }) => (
    <div data-testid="confirm-modal">
      <button data-testid="confirm-ok"     onClick={onConfirm}>{confirmLabel}</button>
      <button data-testid="confirm-cancel" onClick={onCancel}>Cancelar</button>
    </div>
  ),
}))

// ── component under test ──────────────────────────────────────────────────────

import { PostMenuPopup } from "@/src/components/post/PostMenuPopup"
import type { Publication } from "@/src/types/publication"

// ── mutable current user (changed per describe block) ────────────────────────
let currentUserRef: { id: number } | null = { id: 1 }

// ── helpers ───────────────────────────────────────────────────────────────────

function makePost(overrides: Partial<Publication["author"]> = {}): Publication {
  return {
    id:             99,
    text:           "Teste",
    type:           1,
    author: {
      id:              2,
      name:            "Ana Lima",
      username:        "analima",
      avatar:          null,
      cover:           null,
      categories:      [],
      city:            null,
      is_online:       false,
      is_private:      false,
      followers_count: 0,
      following_count: 0,
      average_rating:  null,
      reviews_count:   0,
      is_following:    false,
      is_blocked:      false,
      ...overrides,
    },
    city:           null,
    categories:     [],
    tags:           [],
    mentions:       [],
    media:          [],
    is_liked:       false,
    likes_count:    0,
    comments_count: 0,
    created_at:     "2026-01-01T00:00:00Z",
    updated_at:     "2026-01-01T00:00:00Z",
  }
}

function renderMenu(post: Publication, extras: Partial<Parameters<typeof PostMenuPopup>[0]> = {}) {
  const onClose = vi.fn()
  render(
    <PostMenuPopup
      post={post}
      queryKey={["publications"]}
      onClose={onClose}
      {...extras}
    />
  )
  return { onClose }
}

// ── setup ──────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks()
  currentUserRef = { id: 1 }
  Object.defineProperty(navigator, "clipboard", {
    value:    { writeText: vi.fn().mockResolvedValue(undefined) },
    writable: true,
    configurable: true,
  })
  Object.defineProperty(window, "location", {
    value:    { origin: "https://biko.example.com" },
    writable: true,
    configurable: true,
  })
})

// ── tests ─────────────────────────────────────────────────────────────────────

describe("PostMenuPopup — author view (currentUser.id === post.author.id)", () => {
  beforeEach(() => {
    currentUserRef = { id: 2 } // same as post.author.id
  })

  it("shows 'Editar publicação' and 'Excluir publicação'", () => {
    renderMenu(makePost())
    expect(screen.getByText("Editar publicação")).toBeInTheDocument()
    expect(screen.getByText("Excluir publicação")).toBeInTheDocument()
  })

  it("does NOT show 'Seguir' or 'Bloquear' for own post", () => {
    renderMenu(makePost())
    expect(screen.queryByText(/Seguir/)).toBeNull()
    expect(screen.queryByText(/Bloquear/)).toBeNull()
  })

  it("clicking 'Editar publicação' navigates to edit page", () => {
    const { onClose } = renderMenu(makePost())
    fireEvent.click(screen.getByText("Editar publicação"))
    expect(mockPush).toHaveBeenCalledWith("/publications/99/edit")
    expect(onClose).toHaveBeenCalled()
  })

  it("clicking 'Excluir publicação' shows ConfirmModal", () => {
    renderMenu(makePost())
    fireEvent.click(screen.getByText("Excluir publicação"))
    expect(screen.getByTestId("confirm-modal")).toBeInTheDocument()
  })

  it("confirming delete calls deletePost mutate", async () => {
    renderMenu(makePost())
    fireEvent.click(screen.getByText("Excluir publicação"))
    fireEvent.click(screen.getByTestId("confirm-ok"))
    await waitFor(() => expect(mockMutate).toHaveBeenCalled())
  })

  it("cancelling delete hides ConfirmModal", async () => {
    renderMenu(makePost())
    fireEvent.click(screen.getByText("Excluir publicação"))
    fireEvent.click(screen.getByTestId("confirm-cancel"))
    await waitFor(() => expect(screen.queryByTestId("confirm-modal")).toBeNull())
  })
})

describe("PostMenuPopup — non-author view", () => {
  it("shows 'Seguir @analima' when not following", () => {
    renderMenu(makePost({ is_following: false }))
    expect(screen.getByText("Seguir @analima")).toBeInTheDocument()
  })

  it("shows 'Deixar de seguir' when already following", () => {
    renderMenu(makePost({ is_following: true }))
    expect(screen.getByText("Deixar de seguir")).toBeInTheDocument()
  })

  it("clicking follow calls mutate", () => {
    renderMenu(makePost({ is_following: false }))
    fireEvent.click(screen.getByText("Seguir @analima"))
    expect(mockMutate).toHaveBeenCalled()
  })

  it("shows 'Bloquear' when user is not blocked", () => {
    renderMenu(makePost({ is_blocked: false }))
    expect(screen.getByText("Bloquear")).toBeInTheDocument()
  })

  it("shows 'Desbloquear' when user is already blocked", () => {
    renderMenu(makePost({ is_blocked: true }))
    expect(screen.getByText("Desbloquear")).toBeInTheDocument()
  })

  it("clicking 'Bloquear' calls mutate", () => {
    renderMenu(makePost({ is_blocked: false }))
    fireEvent.click(screen.getByText("Bloquear"))
    expect(mockMutate).toHaveBeenCalled()
  })

  it("hides 'Seguir' when user is blocked", () => {
    renderMenu(makePost({ is_blocked: true }))
    expect(screen.queryByText(/Seguir/)).toBeNull()
  })

  it("does NOT show 'Editar publicação' or 'Excluir publicação'", () => {
    renderMenu(makePost())
    expect(screen.queryByText("Editar publicação")).toBeNull()
    expect(screen.queryByText("Excluir publicação")).toBeNull()
  })
})

describe("PostMenuPopup — copy link", () => {
  it("clicking 'Copiar link' writes URL to clipboard and shows toast", async () => {
    const { onClose } = renderMenu(makePost())
    fireEvent.click(screen.getByText("Copiar link"))
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "https://biko.example.com/publications/99"
      )
      expect(mockToastSuccess).toHaveBeenCalledWith("Link copiado!")
    })
    expect(onClose).toHaveBeenCalled()
  })
})

describe("PostMenuPopup — 'Ver publicação'", () => {
  it("shows 'Ver publicação' by default", () => {
    renderMenu(makePost())
    expect(screen.getByText("Ver publicação")).toBeInTheDocument()
  })

  it("hides 'Ver publicação' when hideView=true", () => {
    renderMenu(makePost(), { hideView: true })
    expect(screen.queryByText("Ver publicação")).toBeNull()
  })
})
