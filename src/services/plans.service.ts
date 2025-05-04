import { ApiService } from "./api.service"
import {
  Plan,
  PlanResponse,
  PlansResponse,
  CreatePlanDto,
  UpdatePlanDto,
} from "../types/plan.types"

export class PlansService {
  private apiService: ApiService
  private static instance: PlansService

  private constructor() {
    this.apiService = ApiService.getInstance()
  }

  // Singleton pattern to ensure only one instance
  public static getInstance(): PlansService {
    if (!PlansService.instance) {
      PlansService.instance = new PlansService()
    }
    return PlansService.instance
  }

  /**
   * Find all plans
   */
  public async findAll(): Promise<Plan[]> {
    const response = await this.apiService.get<PlansResponse>("/plans")
    return response.data.plans
  }

  /**
   * Get a plan by ID
   * @param id Plan ID
   */
  public async findById(id: string): Promise<Plan> {
    const response = await this.apiService.get<PlanResponse>(`/plans/${id}`)
    return response.data.plan
  }

  /**
   * Create a new plan
   * @param createPlanDto Plan data to create
   */
  public async create(createPlanDto: CreatePlanDto): Promise<Plan> {
    const response = await this.apiService.post<PlanResponse>(
      "/plans",
      createPlanDto,
    )
    return response.data.plan
  }

  /**
   * Update a plan
   * @param id Plan ID
   * @param updatePlanDto Plan data to update
   */
  public async update(id: string, updatePlanDto: UpdatePlanDto): Promise<Plan> {
    const response = await this.apiService.patch<PlanResponse>(
      `/plans/${id}`,
      updatePlanDto,
    )
    return response.data.plan
  }

  /**
   * Delete a plan
   * @param id Plan ID
   */
  public async remove(id: string): Promise<{ message: string }> {
    const response = await this.apiService.delete<{ message: string }>(
      `/plans/${id}`,
    )
    return response.data
  }
}

// Create a singleton instance of the PlansService
export const plansService = PlansService.getInstance()
