import { User } from "./user.types"

/**
 * Login credentials DTO
 */
export interface LoginDto {
  email: string
  password: string
}

/**
 * Authentication response from the API
 */
export interface AuthResponse {
  user: User
  token: string
  message?: string
}

/**
 * JWT token payload structure
 */
export interface TokenPayload {
  sub: string // Subject (user ID)
  email: string // User email
  iat?: number // Issued at timestamp
  exp?: number // Expiration timestamp
}

/**
 * Current authentication state
 */
export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
