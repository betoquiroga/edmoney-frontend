import { Transaction } from "./transaction.types"

/**
 * Prompt form data
 */
export interface TransactionPromptFormData {
  message: string
  context: string
  image?: string
}

/**
 * Transaction prompt API response
 */
export interface TransactionPromptResponse {
  transaction?: Transaction
  message: string
}
