import { ApiService } from "./api.service"
import {
  Transaction,
  TransactionResponse,
  TransactionsResponse,
  CreateTransactionDto,
  UpdateTransactionDto,
  QueryTransactionsDto,
  PaginatedTransactions,
  TotalsByPeriodDto,
} from "../types/transaction.types"
import axios from "axios"

export class TransactionsService {
  private apiService: ApiService
  private static instance: TransactionsService

  private constructor() {
    this.apiService = ApiService.getInstance()
  }

  // Singleton pattern to ensure only one instance
  public static getInstance(): TransactionsService {
    if (!TransactionsService.instance) {
      TransactionsService.instance = new TransactionsService()
    }
    return TransactionsService.instance
  }

  /**
   * Create a new transaction
   * @param createTransactionDto Transaction data to create
   */
  public async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const response = await this.apiService.post<TransactionResponse>(
      "/transactions",
      createTransactionDto,
    )
    return response.data.transaction
  }

  /**
   * Get all transactions for a user
   * @param userId User ID
   */
  public async findAll(userId: string): Promise<Transaction[]> {
    const response = await this.apiService.get<TransactionsResponse>(
      `/transactions?userId=${userId}`,
    )
    return response.data.transactions
  }

  /**
   * Query transactions with filters
   * @param queryParams Query parameters
   */
  public async queryTransactions(
    queryParams: QueryTransactionsDto,
  ): Promise<PaginatedTransactions> {
    const params = new URLSearchParams()

    // Add all non-undefined params to the query string
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value))
      }
    })

    const response = await this.apiService.get<PaginatedTransactions>(
      `/transactions/query?${params.toString()}`,
    )
    return response.data
  }

  /**
   * Get transactions by recurring ID
   * @param recurringId Recurring ID
   * @param userId User ID
   */
  public async findByRecurringId(
    recurringId: string,
    userId: string,
  ): Promise<Transaction[]> {
    const response = await this.apiService.get<TransactionsResponse>(
      `/transactions/recurring/${recurringId}?userId=${userId}`,
    )
    return response.data.transactions
  }

  /**
   * Get a transaction by ID
   * @param id Transaction ID
   * @param userId User ID
   */
  public async findOne(id: string, userId: string): Promise<Transaction> {
    const response = await this.apiService.get<TransactionResponse>(
      `/transactions/${id}?userId=${userId}`,
    )
    return response.data.transaction
  }

  /**
   * Update a transaction
   * @param id Transaction ID
   * @param updateTransactionDto Transaction data to update
   */
  public async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const response = await this.apiService.patch<TransactionResponse>(
      `/transactions/${id}`,
      updateTransactionDto,
    )
    return response.data.transaction
  }

  /**
   * Delete a transaction
   * @param id Transaction ID
   * @param userId User ID
   */
  public async remove(id: string, userId: string): Promise<void> {
    await this.apiService.delete(`/transactions/${id}?userId=${userId}`)
  }

  /**
   * Create a transaction from a natural language prompt
   * @param message The user's text prompt
   * @param context Additional context data
   * @param image Optional image data
   */
  public async createFromPrompt(
    message: string,
    context: string,
    image?: string,
  ): Promise<TransactionResponse> {
    const response = await axios.post<TransactionResponse>(
      "http://localhost:3001/api/transactions",
      { message, context, image },
    )
    return response.data
  }

  /**
   * Get totals by period
   * @param params Period parameters
   */
  public async getTotalsByPeriod(
    params: TotalsByPeriodDto,
  ): Promise<Record<string, number>> {
    const queryParams = new URLSearchParams()

    // Add all non-undefined params to the query string
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value))
      }
    })

    const response = await this.apiService.get<Record<string, number>>(
      `/transactions/totals?${queryParams.toString()}`,
    )
    return response.data
  }

  /**
   * Get financial summary for a user
   */
  public async getSummary(userId: string): Promise<{
    balance: number
    totalIncome: number
    totalExpense: number
    currency: string
  }> {
    const response = await this.apiService.get<{
      balance: number
      totalIncome: number
      totalExpense: number
      currency: string
    }>(`/transactions/summary?userId=${userId}`)
    return response.data
  }

  /**
   * Get recent transactions for a user (last 10)
   */
  public async getRecentTransactions(userId: string): Promise<Transaction[]> {
    const response = await this.apiService.get<TransactionsResponse>(
      `/transactions/recent?userId=${userId}`,
    )
    return response.data.transactions || response.data
  }
}

// Create a singleton instance of the TransactionsService
export const transactionsService = TransactionsService.getInstance()
