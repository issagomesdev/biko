export interface ApiResponse<T> {
  success: boolean
  data:    T
  message: string
}

export interface State {
  id:   number
  name: string
  uf:   string
}

export interface City {
  id:       number
  name:     string
  state_id: number
}

export interface Category {
  id:   number
  name: string
  slug: string
}

export interface AuthUser {
  id:         number
  name:       string
  username:   string
  email:      string
  categories: Category[]
  is_private: boolean | null
  is_online:  boolean
}

export interface LoginResponse {
  success: true
  message: string | null
  user:    AuthUser
}

export interface RegisterResponse {
  success: true
  message: string | null
}
