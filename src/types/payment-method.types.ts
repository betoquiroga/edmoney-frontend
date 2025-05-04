/**
 * Payment method entity type
 */
export enum PaymentMethodType {
  CASH = "cash",
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  BANK = "bank",
  DIGITAL_WALLET = "digital_wallet",
  OTHER = "other",
}

export interface PaymentMethod {
  id: string
  user_id?: string
  name: string
  type?: PaymentMethodType
  icon?: string
  is_default: boolean
  is_active: boolean
  created_at: Date
  updated_at: Date
}

/**
 * Response types for payment method API endpoints
 */
export interface PaymentMethodResponse {
  paymentMethod: PaymentMethod
  message?: string
}

export interface PaymentMethodsResponse {
  paymentMethods: PaymentMethod[]
  message?: string
}

/**
 * DTO types for creating payment methods
 */
export interface CreatePaymentMethodDto {
  user_id?: string
  name: string
  type?: PaymentMethodType
  icon?: string
  is_default?: boolean
  is_active?: boolean
}

/**
 * DTO types for updating payment methods
 */
export interface UpdatePaymentMethodDto
  extends Partial<CreatePaymentMethodDto> {
  id: string
}
