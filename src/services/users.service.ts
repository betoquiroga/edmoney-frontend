import { ApiService } from "./api.service"
import {
  UpdateUserDto,
  User,
  UserResponse,
  UsersResponse,
} from "../types/user.types"

export class UsersService {
  private apiService: ApiService
  private static instance: UsersService

  private constructor() {
    this.apiService = ApiService.getInstance()
  }

  // Singleton pattern to ensure only one instance
  public static getInstance(): UsersService {
    if (!UsersService.instance) {
      UsersService.instance = new UsersService()
    }
    return UsersService.instance
  }

  /**
   * Get all users
   */
  public async findAll(): Promise<User[]> {
    const response = await this.apiService.get<UsersResponse>("/users")
    return response.data.users
  }

  /**
   * Get a user by ID
   * @param id User ID
   */
  public async findById(id: string): Promise<User> {
    const response = await this.apiService.get<UserResponse>(`/users/${id}`)
    return response.data.user
  }

  /**
   * Update a user
   * @param id User ID
   * @param updateUserDto User data to update
   */
  public async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const response = await this.apiService.patch<UserResponse>(
      `/users/${id}`,
      updateUserDto,
    )
    return response.data.user
  }

  /**
   * Delete a user
   * @param id User ID
   */
  public async remove(id: string): Promise<{ message: string }> {
    const response = await this.apiService.delete<{ message: string }>(
      `/users/${id}`,
    )
    return response.data
  }
}

// Create a singleton instance of the UsersService
export const usersService = UsersService.getInstance()
