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

    try {
      const response = await this.apiService.get<CategoriesResponse | Category[]>(url)
      
      // Verificar si la respuesta es un array o un objeto con la propiedad 'categories'
      if (Array.isArray(response)) {
        console.log(`Respuesta de findAll categories es un array con ${response.length} elementos`);
        return response;
      } else if (response && typeof response === 'object') {
        // Si tiene la propiedad 'categories', devolver eso
        if ('categories' in response) {
          return (response as CategoriesResponse).categories;
        }
        
        // Si es el data.categories (formato antiguo)
        if ('data' in response && response.data && typeof response.data === 'object' && 'categories' in response.data) {
          return (response.data as any).categories;
        }
      }
      
      // Si no podemos determinar el formato, devolver array vacío y loguear error
      console.error('Formato de respuesta de categorías inesperado:', response);
      return [];
    } catch (error) {
      console.error(`Error obteniendo categorías:`, error);
      throw error;
    }
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

    try {
      const response = await this.apiService.get<CategoriesResponse | Category[]>(url)
      
      // Verificar si la respuesta es un array o un objeto con la propiedad 'categories'
      if (Array.isArray(response)) {
        console.log(`Respuesta de categorías para usuario ${userId} es un array`);
        return response;
      } else if (response && typeof response === 'object') {
        // Si tiene la propiedad 'categories', devolver eso
        if ('categories' in response) {
          return (response as CategoriesResponse).categories;
        }
        
        // Si parece ser un array directamente
        if (Array.isArray(response)) {
          return response;
        }
      }
      
      // Si no podemos determinar el formato, devolver array vacío y loguear error
      console.error('Formato de respuesta de categorías inesperado:', response);
      return [];
    } catch (error) {
      console.error(`Error obteniendo categorías para usuario ${userId}:`, error);
      throw error;
    }
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

  /**
   * Obtiene categorías directamente usando fetch para bypasear cualquier capa intermedia
   * @returns Lista de categorías
   */
  public async findAllDirect(): Promise<Category[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación disponible');
    }
    
    try {
      // Obtener la URL de la API de las variables de entorno de Next.js
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      
      const response = await fetch(`${apiUrl}/categories`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error al obtener categorías: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Categorías obtenidas directamente:', data);
      
      // Verificar si la respuesta es un array o un objeto con la propiedad 'categories'
      if (Array.isArray(data)) {
        return data;
      } else if (data && typeof data === 'object') {
        // Si tiene la propiedad 'categories', devolver eso
        if ('categories' in data && Array.isArray(data.categories)) {
          console.log(`Procesando ${data.categories.length} categorías de la respuesta`);
          return data.categories;
        }
      }
      
      console.error('Formato de respuesta inesperado:', data);
      return [];
    } catch (error) {
      console.error('Error obteniendo categorías directamente:', error);
      throw error;
    }
  }
}

// Create a singleton instance of the CategoriesService
export const categoriesService = CategoriesService.getInstance()
