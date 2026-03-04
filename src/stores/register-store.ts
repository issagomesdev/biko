import { create } from "zustand"

interface RegisterDraft {
  name:     string
  email:    string
  password: string
  role:     "provider" | "client"
  city_id:  number | null
}

interface RegisterStore {
  draft: RegisterDraft
  setCredentials: (data: Pick<RegisterDraft, "name" | "email" | "password" | "role">) => void
  setCity:        (city_id: number) => void
  reset:          () => void
}

const INITIAL: RegisterDraft = {
  name:     "",
  email:    "",
  password: "",
  role:     "client",
  city_id:  null,
}

export const useRegisterStore = create<RegisterStore>((set) => ({
  draft: INITIAL,

  setCredentials: (data) =>
    set((s) => ({ draft: { ...s.draft, ...data } })),

  setCity: (city_id) =>
    set((s) => ({ draft: { ...s.draft, city_id } })),

  reset: () => set({ draft: INITIAL }),
}))
