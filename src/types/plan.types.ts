/**
 * Plan entity type
 */
export interface Plan {
  id: string
  name: string
  description: string
  price: number
  features: Record<string, string | number | boolean>
  maxUsage?: number
  isActive: boolean
  created_at: Date
  updated_at: Date
}

/**
 * Response types for plan API endpoints
 */
export interface PlanResponse {
  plan: Plan
  message?: string
}

export interface PlansResponse {
  plans: Plan[]
  message?: string
}

/**
 * DTO types for creating plans
 */
export interface CreatePlanDto {
  name: string
  description: string
  price: number
  features: Record<string, string | number | boolean>
  maxUsage?: number
  isActive: boolean
}

/**
 * DTO types for updating plans
 */
export interface UpdatePlanDto extends Partial<CreatePlanDto> {
  id: string
}
