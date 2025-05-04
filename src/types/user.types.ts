/**
 * User entity type
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Response types for user API endpoints
 */
export interface UserResponse {
  user: User;
  message?: string;
}

export interface UsersResponse {
  users: User[];
  message?: string;
}

/**
 * DTO types for creating users
 */
export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  avatar?: string;
}

/**
 * DTO types for updating users
 */
export interface UpdateUserDto {
  email?: string;
  password?: string;
  name?: string;
  avatar?: string;
} 