import { create } from "zustand"
import type { FeedFilters } from "@/src/types/publication"

export const DEFAULT_FILTERS: FeedFilters = {
  search:     "",
  type:       null,
  categories: [],
  state_id:   null,
  city_id:    null,
  date:       "",
  orderBy:    "desc",
}

interface FeedStore {
  filters:    FeedFilters
  setFilter:  <K extends keyof FeedFilters>(key: K, value: FeedFilters[K]) => void
  resetFilters: () => void
}

export const useFeedStore = create<FeedStore>((set) => ({
  filters: DEFAULT_FILTERS,

  setFilter: (key, value) =>
    set((s) => ({ filters: { ...s.filters, [key]: value } })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
}))
