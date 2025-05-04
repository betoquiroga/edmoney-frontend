import { ApiService } from "./api.service"
import {
  Subscription,
  SubscriptionResponse,
  SubscriptionsResponse,
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
} from "../types/subscription.types"

export class SubscriptionsService {
  private apiService: ApiService
  private static instance: SubscriptionsService

  private constructor() {
    this.apiService = ApiService.getInstance()
  }

  // Singleton pattern to ensure only one instance
  public static getInstance(): SubscriptionsService {
    if (!SubscriptionsService.instance) {
      SubscriptionsService.instance = new SubscriptionsService()
    }
    return SubscriptionsService.instance
  }

  /**
   * Find all subscriptions with optional user filter
   * @param userId Optional user ID filter
   */
  public async findAll(userId?: string): Promise<Subscription[]> {
    let url = "/subscriptions"
    if (userId) {
      url += `?user_id=${userId}`
    }

    const response = await this.apiService.get<SubscriptionsResponse>(url)
    return response.data.subscriptions
  }

  /**
   * Get a subscription by ID
   * @param id Subscription ID
   */
  public async findById(id: string): Promise<Subscription> {
    const response = await this.apiService.get<SubscriptionResponse>(
      `/subscriptions/${id}`,
    )
    return response.data.subscription
  }

  /**
   * Find subscriptions for a specific user
   * @param userId User ID
   */
  public async findByUserId(userId: string): Promise<Subscription[]> {
    const response = await this.apiService.get<SubscriptionsResponse>(
      `/subscriptions/user/${userId}`,
    )
    return response.data.subscriptions
  }

  /**
   * Create a new subscription
   * @param createSubscriptionDto Subscription data to create
   */
  public async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    const response = await this.apiService.post<SubscriptionResponse>(
      "/subscriptions",
      createSubscriptionDto,
    )
    return response.data.subscription
  }

  /**
   * Update a subscription
   * @param id Subscription ID
   * @param updateSubscriptionDto Subscription data to update
   */
  public async update(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    const response = await this.apiService.patch<SubscriptionResponse>(
      `/subscriptions/${id}`,
      updateSubscriptionDto,
    )
    return response.data.subscription
  }

  /**
   * Cancel a subscription
   * @param id Subscription ID
   */
  public async cancel(id: string): Promise<Subscription> {
    const response = await this.apiService.patch<SubscriptionResponse>(
      `/subscriptions/${id}/cancel`,
    )
    return response.data.subscription
  }

  /**
   * Delete a subscription
   * @param id Subscription ID
   */
  public async remove(id: string): Promise<{ message: string }> {
    const response = await this.apiService.delete<{ message: string }>(
      `/subscriptions/${id}`,
    )
    return response.data
  }
}

// Create a singleton instance of the SubscriptionsService
export const subscriptionsService = SubscriptionsService.getInstance()
