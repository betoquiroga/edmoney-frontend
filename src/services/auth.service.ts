import { ApiService } from "./api.service"
import { AuthResponse, LoginDto } from "../types/auth.types"
import { CreateUserDto } from "../types/user.types"

export class AuthService {
  private apiService: ApiService
  private static instance: AuthService

  private constructor() {
    this.apiService = ApiService.getInstance()
  }

  // Singleton pattern to ensure only one instance
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  /**
   * Register a new user
   * @param createUserDto User data to register
   */
  public async register(createUserDto: CreateUserDto): Promise<AuthResponse> {
    const response = await this.apiService.post<AuthResponse>(
      "/auth/register",
      createUserDto,
    )

    // Store token in localStorage for future requests
    if (response.data.token && typeof window !== "undefined") {
      localStorage.setItem("token", response.data.token)
    }

    return response.data
  }

  /**
   * Login a user
   * @param loginDto Login credentials
   */
  public async login(loginDto: LoginDto): Promise<AuthResponse> {
    const response = await this.apiService.post<AuthResponse>(
      "/auth/login",
      loginDto,
    )

    // Store token in localStorage for future requests
    if (response.data.token && typeof window !== "undefined") {
      localStorage.setItem("token", response.data.token)
    }

    return response.data
  }

  /**
   * Logout the current user
   */
  public logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      // Redirect to login page
      window.location.href = "/login"
    }
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("token")
    }
    return false
  }

  /**
   * Get the current JWT token
   */
  public getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
    return null
  }
}

// Create a singleton instance of the AuthService
export const authService = AuthService.getInstance()
