import { ApiService } from "./api.service"
import {
  InputMethod,
  InputMethodResponse,
  InputMethodsResponse,
  CreateInputMethodDto,
  UpdateInputMethodDto,
} from "../types/input-method.types"

export class InputMethodsService {
  private apiService: ApiService
  private static instance: InputMethodsService

  private constructor() {
    this.apiService = ApiService.getInstance()
  }

  // Singleton pattern to ensure only one instance
  public static getInstance(): InputMethodsService {
    if (!InputMethodsService.instance) {
      InputMethodsService.instance = new InputMethodsService()
    }
    return InputMethodsService.instance
  }

  /**
   * Find all input methods
   * @param isActive Optional filter for active status
   */
  public async findAll(isActive?: boolean): Promise<InputMethod[]> {
    let url = "/input-methods"
    if (isActive !== undefined) {
      url += `?isActive=${isActive}`
    }

    const response = await this.apiService.get<InputMethodsResponse>(url)
    return response.data.inputMethods
  }

  /**
   * Get an input method by ID
   * @param id Input method ID
   */
  public async findOne(id: string): Promise<InputMethod> {
    const response = await this.apiService.get<InputMethodResponse>(
      `/input-methods/${id}`,
    )
    return response.data.inputMethod
  }

  /**
   * Create a new input method
   * @param createInputMethodDto Input method data to create
   */
  public async create(
    createInputMethodDto: CreateInputMethodDto,
  ): Promise<InputMethod> {
    const response = await this.apiService.post<InputMethodResponse>(
      "/input-methods",
      createInputMethodDto,
    )
    return response.data.inputMethod
  }

  /**
   * Update an input method
   * @param id Input method ID
   * @param updateInputMethodDto Input method data to update
   */
  public async update(
    id: string,
    updateInputMethodDto: UpdateInputMethodDto,
  ): Promise<InputMethod> {
    const response = await this.apiService.patch<InputMethodResponse>(
      `/input-methods/${id}`,
      updateInputMethodDto,
    )
    return response.data.inputMethod
  }

  /**
   * Delete an input method
   * @param id Input method ID
   */
  public async remove(id: string): Promise<void> {
    await this.apiService.delete(`/input-methods/${id}`)
  }
}

// Create a singleton instance of the InputMethodsService
export const inputMethodsService = InputMethodsService.getInstance()
