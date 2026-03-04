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
  id:    number
  name:  string
  email: string
  role:  "provider" | "client"
}

export interface AuthResponse {
  token: string
  user:  AuthUser
}
