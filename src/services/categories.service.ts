import { ApiService } from "./api.service"
import {
  Category,
  CategoryResponse,
  CategoriesResponse,
  CreateCategoryDto,
  UpdateCategoryDto,
  TransactionType,
} from "../types/category.types"

export class CategoriesService {
  private apiService: ApiService
  private static instance: CategoriesService

  private constructor() {
    this.apiService = ApiService.getInstance()
  }

  // Singleton pattern to ensure only one instance
  public static getInstance(): CategoriesService {
    if (!CategoriesService.instance) {
      CategoriesService.instance = new CategoriesService()
    }
    return CategoriesService.instance
  }

  /**
   * Find all categories with optional filters
   * @param userId Optional user ID
   * @param type Optional transaction type
   * @param isDefault Optional flag for default categories
   */
  public async findAll(
    userId?: string,
    type?: TransactionType,
    isDefault?: boolean,
  ): Promise<Category[]> {
    let url = "/categories"
    const params = new URLSearchParams()

    if (userId) params.append("user_id", userId)
    if (type) params.append("type", type)
    if (isDefault !== undefined) params.append("is_default", String(isDefault))

    const queryString = params.toString()
    if (queryString) url += `?${queryString}`

    const response = await this.apiService.get<CategoriesResponse>(url)
    return response.data.categories
  }

  /**
   * Get a category by ID
   * @param id Category ID
   */
  public async findOne(id: string): Promise<Category> {
    const response = await this.apiService.get<CategoryResponse>(
      `/categories/${id}`,
    )
    return response.data.category
  }

  /**
   * Find categories for a specific user
   * @param userId User ID
   * @param type Optional transaction type
   */
  public async findByUser(
    userId: string,
    type?: TransactionType,
  ): Promise<Category[]> {
    let url = `/categories/user/${userId}`
    if (type) url += `?type=${type}`

    const response = await this.apiService.get<CategoriesResponse>(url)
    return response.data.categories
  }

  /**
   * Create a new category
   * @param createCategoryDto Category data to create
   */
  public async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const response = await this.apiService.post<CategoryResponse>(
      "/categories",
      createCategoryDto,
    )
    return response.data.category
  }

  /**
   * Update a category
   * @param id Category ID
   * @param updateCategoryDto Category data to update
   */
  public async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const response = await this.apiService.patch<CategoryResponse>(
      `/categories/${id}`,
      updateCategoryDto,
    )
    return response.data.category
  }

  /**
   * Delete a category
   * @param id Category ID
   */
  public async remove(id: string): Promise<void> {
    await this.apiService.delete(`/categories/${id}`)
  }
}

// Create a singleton instance of the CategoriesService
export const categoriesService = CategoriesService.getInstance()
