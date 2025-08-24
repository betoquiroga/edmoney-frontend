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

    try {
      const response = await this.apiService.get<PaymentMethodsResponse | PaymentMethod[]>(url)
      
      // Verificar si la respuesta es un array o un objeto con la propiedad 'paymentMethods'
      if (Array.isArray(response)) {
        console.log(`Respuesta de findAll payment methods es un array con ${response.length} elementos`);
        return response;
      } else if (response && typeof response === 'object') {
        // Si tiene la propiedad 'paymentMethods', devolver eso
        if ('paymentMethods' in response) {
          return (response as PaymentMethodsResponse).paymentMethods;
        }
        
        // Si es el data.paymentMethods (formato antiguo)
        if ('data' in response && response.data && typeof response.data === 'object' && 'paymentMethods' in response.data) {
          return (response.data as any).paymentMethods;
        }
      }
      
      // Si no podemos determinar el formato, devolver array vacío y loguear error
      console.error('Formato de respuesta de métodos de pago inesperado:', response);
      return [];
    } catch (error) {
      console.error(`Error obteniendo métodos de pago:`, error);
      throw error;
    }
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

    try {
      const response = await this.apiService.get<PaymentMethodsResponse | PaymentMethod[]>(url)
      
      // Verificar si la respuesta es un array o un objeto con la propiedad 'paymentMethods'
      if (Array.isArray(response)) {
        console.log(`Respuesta de métodos de pago para usuario ${userId} es un array`);
        return response;
      } else if (response && typeof response === 'object') {
        // Si tiene la propiedad 'paymentMethods', devolver eso
        if ('paymentMethods' in response) {
          return (response as PaymentMethodsResponse).paymentMethods;
        }
        
        // Si parece ser un array directamente
        if (Array.isArray(response)) {
          return response;
        }
      }
      
      // Si no podemos determinar el formato, devolver array vacío y loguear error
      console.error('Formato de respuesta de métodos de pago inesperado:', response);
      return [];
    } catch (error) {
      console.error(`Error obteniendo métodos de pago para usuario ${userId}:`, error);
      throw error;
    }
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

  /**
   * Obtiene métodos de pago directamente usando fetch para bypasear cualquier capa intermedia
   * @returns Lista de métodos de pago
   */
  public async findAllDirect(): Promise<PaymentMethod[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación disponible');
    }
    
    try {
      // Obtener la URL de la API de las variables de entorno de Next.js
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
      
      const response = await fetch(`${apiUrl}/payment-methods`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error al obtener métodos de pago: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Métodos de pago obtenidos directamente:', data);
      
      // Verificar si la respuesta es un array o un objeto con la propiedad 'paymentMethods'
      if (Array.isArray(data)) {
        return data;
      } else if (data && typeof data === 'object') {
        // Si tiene la propiedad 'paymentMethods', devolver eso
        if ('paymentMethods' in data && Array.isArray(data.paymentMethods)) {
          console.log(`Procesando ${data.paymentMethods.length} métodos de pago de la respuesta`);
          return data.paymentMethods;
        }
      }
      
      console.error('Formato de respuesta inesperado:', data);
      return [];
    } catch (error) {
      console.error('Error obteniendo métodos de pago directamente:', error);
      throw error;
    }
  }
}

// Create a singleton instance of the PaymentMethodsService
export const paymentMethodsService = PaymentMethodsService.getInstance()
