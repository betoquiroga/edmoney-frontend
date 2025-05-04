import { ApiService } from "./api.service"
import {
  PaymentMethod,
  PaymentMethodResponse,
  PaymentMethodsResponse,
  CreatePaymentMethodDto,
  UpdatePaymentMethodDto,
  PaymentMethodType,
} from "../types/payment-method.types"

export class PaymentMethodsService {
  private apiService: ApiService
  private static instance: PaymentMethodsService

  private constructor() {
    this.apiService = ApiService.getInstance()
  }

  // Singleton pattern to ensure only one instance
  public static getInstance(): PaymentMethodsService {
    if (!PaymentMethodsService.instance) {
      PaymentMethodsService.instance = new PaymentMethodsService()
    }
    return PaymentMethodsService.instance
  }

  /**
   * Find all payment methods with optional filters
   * @param userId Optional user ID
   * @param type Optional payment method type
   * @param isDefault Optional flag for default payment methods
   */
  public async findAll(
    userId?: string,
    type?: PaymentMethodType,
    isDefault?: boolean,
  ): Promise<PaymentMethod[]> {
    let url = "/payment-methods"
    const params = new URLSearchParams()

    if (userId) params.append("user_id", userId)
    if (type) params.append("type", type)
    if (isDefault !== undefined) params.append("is_default", String(isDefault))

    const queryString = params.toString()
    if (queryString) url += `?${queryString}`

    const response = await this.apiService.get<PaymentMethodsResponse>(url)
    return response.data.paymentMethods
  }

  /**
   * Get a payment method by ID
   * @param id Payment method ID
   */
  public async findOne(id: string): Promise<PaymentMethod> {
    const response = await this.apiService.get<PaymentMethodResponse>(
      `/payment-methods/${id}`,
    )
    return response.data.paymentMethod
  }

  /**
   * Find payment methods for a specific user
   * @param userId User ID
   * @param type Optional payment method type
   */
  public async findByUser(
    userId: string,
    type?: PaymentMethodType,
  ): Promise<PaymentMethod[]> {
    let url = `/payment-methods/user/${userId}`
    if (type) url += `?type=${type}`

    const response = await this.apiService.get<PaymentMethodsResponse>(url)
    return response.data.paymentMethods
  }

  /**
   * Create a new payment method
   * @param createPaymentMethodDto Payment method data to create
   */
  public async create(
    createPaymentMethodDto: CreatePaymentMethodDto,
  ): Promise<PaymentMethod> {
    const response = await this.apiService.post<PaymentMethodResponse>(
      "/payment-methods",
      createPaymentMethodDto,
    )
    return response.data.paymentMethod
  }

  /**
   * Update a payment method
   * @param id Payment method ID
   * @param updatePaymentMethodDto Payment method data to update
   */
  public async update(
    id: string,
    updatePaymentMethodDto: UpdatePaymentMethodDto,
  ): Promise<PaymentMethod> {
    const response = await this.apiService.patch<PaymentMethodResponse>(
      `/payment-methods/${id}`,
      updatePaymentMethodDto,
    )
    return response.data.paymentMethod
  }

  /**
   * Delete a payment method
   * @param id Payment method ID
   */
  public async remove(id: string): Promise<void> {
    await this.apiService.delete(`/payment-methods/${id}`)
  }
}

// Create a singleton instance of the PaymentMethodsService
export const paymentMethodsService = PaymentMethodsService.getInstance()
