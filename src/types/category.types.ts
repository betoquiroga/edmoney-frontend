/**
 * Category entity type
 */
export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
  TRANSFER = "transfer",
}

export interface Category {
  id: string
  user_id?: string
  name: string
  type: TransactionType
  icon?: string
  is_default: boolean
  is_active: boolean
  created_at: Date
  updated_at: Date
}

/**
 * Response types for category API endpoints
 */
export interface CategoryResponse {
  category: Category
  message?: string
}

export interface CategoriesResponse {
  categories: Category[]
  message?: string
}

/**
 * DTO types for creating categories
 */
export interface CreateCategoryDto {
  user_id?: string
  name: string
  type: TransactionType
  icon?: string
  is_default?: boolean
  is_active?: boolean
}

/**
 * DTO types for updating categories
 */
export interface UpdateCategoryDto {
  user_id?: string
  name?: string
  type?: TransactionType
  icon?: string
  is_default?: boolean
  is_active?: boolean
}
