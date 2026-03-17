import { render, screen, fireEvent } from "@testing-library/react"
import { vi } from "vitest"

// ── hoisted mocks ─────────────────────────────────────────────────────────────

const { mockSetFilter, mockResetFilters, mockFilters } = vi.hoisted(() => {
  const filters = {
    search:     "",
    type:       null as null | 0 | 1,
    categories: [] as number[],
    state_id:   null as number | null,
    city_id:    null as number | null,
    date:       "",
    orderBy:    "desc" as "desc" | "asc" | "popular",
  }
  return {
    mockFilters:      filters,
    mockSetFilter:    vi.fn(),
    mockResetFilters: vi.fn(),
  }
})

vi.mock("@/src/stores/feed-store", () => ({
  useFeedStore: () => ({
    filters:      mockFilters,
    setFilter:    mockSetFilter,
    resetFilters: mockResetFilters,
  }),
}))

vi.mock("@tanstack/react-query", () => ({
  useQuery: () => ({ data: { data: [{ id: 1, name: "Elétrica" }, { id: 2, name: "Pintura" }] } }),
}))

vi.mock("@/src/hooks/use-states", () => ({
  useStates: () => ({ data: { data: [{ id: 10, name: "São Paulo" }, { id: 20, name: "Rio de Janeiro" }] } }),
}))

vi.mock("@/src/hooks/use-cities", () => ({
  useCities: () => ({ data: { data: [{ id: 100, name: "Campinas" }, { id: 101, name: "Santos" }] } }),
}))

vi.mock("@iconify/react", () => ({
  Icon: ({ icon }: { icon: string }) => <span data-testid={`icon-${icon}`} />,
}))

// ── component under test ──────────────────────────────────────────────────────

import { FilterDrawer } from "@/src/components/feed/FilterDrawer"

function renderDrawer(open = true) {
  const onClose = vi.fn()
  render(<FilterDrawer open={open} onClose={onClose} />)
  return { onClose }
}

// ── tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks()
  // reset shared filter object between tests
  mockFilters.type       = null
  mockFilters.categories = []
  mockFilters.state_id   = null
  mockFilters.city_id    = null
  mockFilters.date       = ""
  mockFilters.orderBy    = "desc"
})

describe("FilterDrawer", () => {
  it("renders nothing when open=false", () => {
    renderDrawer(false)
    expect(screen.queryByText("Filtros")).toBeNull()
  })

  it("renders filter panel when open=true", () => {
    renderDrawer()
    expect(screen.getByText("Filtros")).toBeInTheDocument()
  })

  it("shows type buttons: Todos, Clientes, Prestadores", () => {
    renderDrawer()
    expect(screen.getByText("Todos")).toBeInTheDocument()
    expect(screen.getByText("Clientes")).toBeInTheDocument()
    expect(screen.getByText("Prestadores")).toBeInTheDocument()
  })

  it("shows category chips from query", () => {
    renderDrawer()
    expect(screen.getByText("Elétrica")).toBeInTheDocument()
    expect(screen.getByText("Pintura")).toBeInTheDocument()
  })

  it("shows state options", () => {
    renderDrawer()
    expect(screen.getByText("São Paulo")).toBeInTheDocument()
    expect(screen.getByText("Rio de Janeiro")).toBeInTheDocument()
  })

  it("shows city options", () => {
    renderDrawer()
    expect(screen.getByText("Campinas")).toBeInTheDocument()
    expect(screen.getByText("Santos")).toBeInTheDocument()
  })

  it("clicking 'Aplicar' calls setFilter for each filter field and closes drawer", () => {
    const { onClose } = renderDrawer()
    fireEvent.click(screen.getByText("Aplicar"))
    expect(mockSetFilter).toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })

  it("clicking 'Limpar' calls resetFilters and closes drawer", () => {
    const { onClose } = renderDrawer()
    fireEvent.click(screen.getByText("Limpar"))
    expect(mockResetFilters).toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })

  it("clicking close (X) button calls onClose", () => {
    const { onClose } = renderDrawer()
    // There is one X icon button in the header
    const closeBtns = screen.getAllByRole("button").filter((b) =>
      b.querySelector("[data-testid='icon-lucide:x']")
    )
    fireEvent.click(closeBtns[0])
    expect(onClose).toHaveBeenCalled()
  })

  it("clicking backdrop calls onClose", () => {
    const { onClose } = renderDrawer()
    // The backdrop is the first fixed div rendered
    const backdrop = document.querySelector(".fixed.inset-0.z-40") as HTMLElement
    fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalled()
  })

  it("clicking a type button updates the draft type", () => {
    renderDrawer()
    fireEvent.click(screen.getByText("Clientes"))
    // Apply to commit; setFilter should be called with type=0
    fireEvent.click(screen.getByText("Aplicar"))
    expect(mockSetFilter).toHaveBeenCalledWith("type", 0)
  })

  it("clicking a category chip toggles it in the draft", () => {
    renderDrawer()
    fireEvent.click(screen.getByText("Elétrica"))
    fireEvent.click(screen.getByText("Aplicar"))
    expect(mockSetFilter).toHaveBeenCalledWith("categories", [1])
  })

  it("selecting a date preset updates draft.date", () => {
    renderDrawer()
    const dateSelect = screen.getByDisplayValue("Qualquer data")
    fireEvent.change(dateSelect, { target: { value: "today" } })
    fireEvent.click(screen.getByText("Aplicar"))
    expect(mockSetFilter).toHaveBeenCalledWith("date", "today")
  })

  it("selecting orderBy 'popular' updates draft.orderBy", () => {
    renderDrawer()
    const orderSelect = screen.getByDisplayValue("Mais recentes")
    fireEvent.change(orderSelect, { target: { value: "popular" } })
    fireEvent.click(screen.getByText("Aplicar"))
    expect(mockSetFilter).toHaveBeenCalledWith("orderBy", "popular")
  })
})
