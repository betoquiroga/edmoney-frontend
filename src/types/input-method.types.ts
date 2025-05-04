/**
 * Input method entity type
 */
export interface InputMethod {
  id: string
  name: string
  description?: string
  is_active: boolean
}

/**
 * Response types for input method API endpoints
 */
export interface InputMethodResponse {
  inputMethod: InputMethod
  message?: string
}

export interface InputMethodsResponse {
  inputMethods: InputMethod[]
  message?: string
}

/**
 * DTO types for creating input methods
 */
export interface CreateInputMethodDto {
  name: string
  description?: string
  is_active?: boolean
}

/**
 * DTO types for updating input methods
 */
export interface UpdateInputMethodDto extends Partial<CreateInputMethodDto> {
  id: string
}
