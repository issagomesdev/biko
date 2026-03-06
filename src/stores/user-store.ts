import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface UserProfile {
  id:          number
  name:        string
  username:    string
  email:       string
  categories:  { id: number; name: string; slug: string }[]
  is_private:  boolean | null
  is_online:   boolean
}

interface UserStore {
  user:      UserProfile | null
  setUser:   (user: UserProfile) => void
  clearUser: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user:      null,
      setUser:   (user) => set({ user }),
      clearUser: ()     => set({ user: null }),
    }),
    { name: "biko-user" },
  ),
)
