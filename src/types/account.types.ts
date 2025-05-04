/**
 * Account entity type
 */
export enum AccountType {
  BANK = "bank",
  CASH = "cash",
  CREDIT_CARD = "credit_card",
  INVESTMENT = "investment",
}

export interface Account {
  id: string
  user_id: string
  name: string
  type: AccountType
  initial_balance: number
  current_balance: number
  currency: string
  is_active: boolean
  created_at: Date
  updated_at: Date
}

/**
 * Response types for account API endpoints
 */
export interface AccountResponse {
  account: Account
  message?: string
}

export interface AccountsResponse {
  accounts: Account[]
  message?: string
}

/**
 * DTO types for creating accounts
 */
export interface CreateAccountDto {
  user_id: string
  name: string
  type: AccountType
  initial_balance?: string
  currency: string
  is_active?: boolean
}

/**
 * DTO types for updating accounts
 */
export interface UpdateAccountDto extends Partial<CreateAccountDto> {
  id: string
}
