import { TransactionType } from "./category.types"

/**
 * Transaction entity type
 */
export interface Transaction {
  id: string
  user_id: string
  category_id?: string
  payment_method_id?: string
  input_method_id: string
  type: TransactionType
  amount: number
  currency: string
  transaction_date: Date
  description?: string
  is_recurring: boolean
  recurring_id?: string
  created_at: Date
  updated_at: Date
}

/**
 * Paginated transactions response
 */
export interface PaginatedTransactions {
  data: Transaction[]
  count: number
}

/**
 * Response types for transaction API endpoints
 */
export interface TransactionResponse {
  transaction: Transaction
  message?: string
}

export interface TransactionsResponse {
  transactions: Transaction[]
  message?: string
}

/**
 * DTO types for creating transactions
 */
export interface CreateTransactionDto {
  user_id: string
  category_id?: string
  payment_method_id?: string
  input_method_id: string
  type: TransactionType
  amount: string
  currency: string
  transaction_date: Date
  description?: string
  is_recurring?: boolean
  recurring_id?: string
}

/**
 * DTO types for updating transactions
 */
export interface UpdateTransactionDto extends Partial<CreateTransactionDto> {
  id: string
}

/**
 * Query parameters for filtering transactions
 */
export interface QueryTransactionsDto {
  userId: string
  categoryId?: string
  paymentMethodId?: string
  type?: string
  startDate?: string
  endDate?: string
  minAmount?: number
  maxAmount?: number
  isRecurring?: boolean
  limit?: number
  offset?: number
}

/**
 * Parameters for getting totals by period
 */
export interface TotalsByPeriodDto {
  userId: string
  type?: string
  startDate: string
  endDate: string
}
