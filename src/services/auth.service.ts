import { ApiService } from './api.service';
import { AuthResponse, LoginDto } from '../types/auth.types';
import { CreateUserDto, User } from '../types/user.types';

export class AuthService {
  private apiService: ApiService;
  private static instance: AuthService;

  private constructor() {
    this.apiService = ApiService.getInstance();
  }

  // Singleton pattern to ensure only one instance
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Register a new user
   * @param createUserDto User registration data
   */
  public async register(createUserDto: CreateUserDto): Promise<AuthResponse> {
    const response = await this.apiService.post<AuthResponse>('/auth/register', createUserDto);
    
    // Store token and user data in localStorage if registration is successful
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  }

  /**
   * Login a user
   * @param loginDto Login credentials
   */
  public async login(loginDto: LoginDto): Promise<AuthResponse> {
    const response = await this.apiService.post<AuthResponse>('/auth/login', loginDto);
    
    // Store token and user data in localStorage if login is successful
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  }

  /**
   * Logout the current user
   */
  public logout(): void {
    // Remove token and user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    // Check if token exists in localStorage
    return typeof window !== 'undefined' && !!localStorage.getItem('token');
  }

  /**
   * Get the current authenticated user
   */
  public getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data', error);
      return null;
    }
  }
}

// Create a singleton instance of the AuthService
export const authService = AuthService.getInstance(); 