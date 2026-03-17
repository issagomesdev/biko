import { renderHook, act } from "@testing-library/react"
import { usePublicationForm } from "@/src/hooks/usePublicationForm"

describe("usePublicationForm", () => {
  // ── canSubmit ──────────────────────────────────────────────────────────────

  it("canSubmit is false when text is empty", () => {
    const { result } = renderHook(() => usePublicationForm())
    expect(result.current.canSubmit).toBe(false)
  })

  it("canSubmit is false when text has fewer than 10 characters", () => {
    const { result } = renderHook(() => usePublicationForm({ text: "curto" }))
    expect(result.current.canSubmit).toBe(false)
  })

  it("canSubmit is true when text has exactly 10 characters", () => {
    const { result } = renderHook(() => usePublicationForm({ text: "1234567890" }))
    expect(result.current.canSubmit).toBe(true)
  })

  it("canSubmit is true when text is long enough without cityId", () => {
    const { result } = renderHook(() => usePublicationForm({ text: "Texto longo o suficiente para validar" }))
    expect(result.current.canSubmit).toBe(true)
  })

  it("canSubmit becomes true after updating text via handleTextChange", () => {
    const { result } = renderHook(() => usePublicationForm())
    act(() => { result.current.handleTextChange("texto suficientemente longo") })
    expect(result.current.canSubmit).toBe(true)
  })

  // ── buildFormData ──────────────────────────────────────────────────────────

  it("buildFormData includes text (trimmed) and type", () => {
    const { result } = renderHook(() => usePublicationForm({ text: "  Preciso de ajuda  ", pubType: 0 }))
    const fd = result.current.buildFormData()
    expect(fd.get("text")).toBe("Preciso de ajuda")
    expect(fd.get("type")).toBe("0")
  })

  it("buildFormData includes city_id when set", () => {
    const { result } = renderHook(() => usePublicationForm({ cityId: 42 }))
    const fd = result.current.buildFormData()
    expect(fd.get("city_id")).toBe("42")
  })

  it("buildFormData omits city_id when null", () => {
    const { result } = renderHook(() => usePublicationForm({ cityId: null }))
    const fd = result.current.buildFormData()
    expect(fd.get("city_id")).toBeNull()
  })

  it("buildFormData appends categories[] for each selected category", () => {
    const { result } = renderHook(() => usePublicationForm({ selectedCategories: [1, 2, 3] }))
    const fd = result.current.buildFormData()
    expect(fd.getAll("categories[]")).toEqual(["1", "2", "3"])
  })

  it("buildFormData appends tags[]", () => {
    const { result } = renderHook(() => usePublicationForm({ tags: ["urgente", "eletrica"] }))
    const fd = result.current.buildFormData()
    expect(fd.getAll("tags[]")).toEqual(["urgente", "eletrica"])
  })

  it("buildFormData appends mentions[]", () => {
    const { result } = renderHook(() =>
      usePublicationForm({
        mentionedUsers: [
          { id: 5, name: "Alice", username: "alice", avatar: null },
          { id: 8, name: "Bob",   username: "bob",   avatar: null },
        ],
      })
    )
    const fd = result.current.buildFormData()
    expect(fd.getAll("mentions[]")).toEqual(["5", "8"])
  })

  // ── handleStateChange ──────────────────────────────────────────────────────

  it("handleStateChange sets stateId and resets cityId to null", () => {
    const { result } = renderHook(() => usePublicationForm({ stateId: 1, cityId: 10 }))
    act(() => { result.current.handleStateChange(5) })
    expect(result.current.stateId).toBe(5)
    expect(result.current.cityId).toBeNull()
  })

  it("handleStateChange with null clears both stateId and cityId", () => {
    const { result } = renderHook(() => usePublicationForm({ stateId: 3, cityId: 20 }))
    act(() => { result.current.handleStateChange(null) })
    expect(result.current.stateId).toBeNull()
    expect(result.current.cityId).toBeNull()
  })

  // ── initial values ─────────────────────────────────────────────────────────

  it("initialises with provided values", () => {
    const { result } = renderHook(() =>
      usePublicationForm({ text: "Olá", pubType: 0, selectedCategories: [2], tags: ["tag1"], cityId: 7, stateId: 3 })
    )
    expect(result.current.text).toBe("Olá")
    expect(result.current.pubType).toBe(0)
    expect(result.current.selectedCategories).toEqual([2])
    expect(result.current.tags).toEqual(["tag1"])
    expect(result.current.cityId).toBe(7)
    expect(result.current.stateId).toBe(3)
  })
})
