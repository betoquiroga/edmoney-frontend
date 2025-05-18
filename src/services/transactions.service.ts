import axios from "axios"
import { authenticatedGet, authenticatedPost, authenticatedPatch, authenticatedDelete } from "../utils/api"
import {
  Transaction,
  TransactionResponse,
  TransactionsResponse,
  CreateTransactionDto,
  UpdateTransactionDto,
  QueryTransactionsDto,
  PaginatedTransactions,
  TotalsByPeriodDto,
  TransactionSuggestion,
} from "../types/transaction.types"

export class TransactionsService {
  /**
   * Create a new transaction
   * @param createTransactionDto Transaction data to create
   */
  public async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    console.log("Enviando datos a la API:", createTransactionDto);
    const response = await authenticatedPost<TransactionResponse>(
      "/transactions",
      createTransactionDto,
    );
    return response.transaction;
  }

  /**
   * Get all transactions for a user
   * @param userId User ID
   */
  public async findAll(userId: string): Promise<Transaction[]> {
    const response = await authenticatedGet<TransactionsResponse>(
      `/transactions?userId=${userId}`,
    );
    return response.transactions;
  }

  /**
   * Query transactions with filters
   * @param queryParams Query parameters
   */
  public async queryTransactions(
    queryParams: QueryTransactionsDto,
  ): Promise<PaginatedTransactions> {
    const params = new URLSearchParams();

    // Add all non-undefined params to the query string
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });

    return authenticatedGet<PaginatedTransactions>(
      `/transactions/query?${params.toString()}`,
    );
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
    const response = await authenticatedGet<TransactionsResponse>(
      `/transactions/recurring/${recurringId}?userId=${userId}`,
    );
    return response.transactions;
  }

  /**
   * Get a transaction by ID
   * @param id Transaction ID
   * @param userId User ID
   */
  public async findOne(id: string, userId: string): Promise<Transaction> {
    const response = await authenticatedGet<TransactionResponse>(
      `/transactions/${id}?userId=${userId}`,
    );
    return response.transaction;
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
    const response = await authenticatedPatch<TransactionResponse>(
      `/transactions/${id}`,
      updateTransactionDto,
    );
    return response.transaction;
  }

  /**
   * Delete a transaction
   * @param id Transaction ID
   * @param userId User ID
   */
  public async remove(id: string, userId: string): Promise<void> {
    await authenticatedDelete<void>(`/transactions/${id}?userId=${userId}`);
  }

  /**
   * Create a transaction from a natural language prompt
   * @param userId The user's ID
   * @param message The user's text prompt
   * @param image Optional image data
   * @param token Authentication token
   */
  public async createFromPrompt(
    userId: string,
    message: string,
    image?: string | null,
    token?: string | null,
  ): Promise<TransactionResponse> {
    const response = await axios.post<TransactionResponse>(
      "/api/transactions",
      { userId, message, image: image || undefined, token: token || undefined },
    );
    return response.data;
  }

  /**
   * Transcribe audio to text using OpenAI
   * @param userId The user's ID
   * @param audioBase64 The base64 encoded audio to transcribe
   */
  public async transcribeAudio(
    userId: string, 
    audioBase64: string
  ): Promise<{ text: string }> {
    // Send the audio to the transcription endpoint
    const response = await axios.post<{ text: string }>(
      "/api/transcribe",
      { userId, audioBase64 },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  }

  /**
   * Get totals by period
   * @param params Period parameters
   */
  public async getTotalsByPeriod(
    params: TotalsByPeriodDto,
  ): Promise<Record<string, number>> {
    const queryParams = new URLSearchParams();

    // Add all non-undefined params to the query string
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });

    return authenticatedGet<Record<string, number>>(
      `/transactions/totals?${queryParams.toString()}`
    );
  }

  /**
   * Get financial summary for a user
   */
  public async getSummary(userId: string): Promise<{
    balance: number;
    totalIncome: number;
    totalExpense: number;
    currency: string;
  }> {
    return authenticatedGet<{
      balance: number;
      totalIncome: number;
      totalExpense: number;
      currency: string;
    }>(`/transactions/summary?userId=${userId}`);
  }

  /**
   * Get recent transactions for a user (last 10)
   */
  public async getRecentTransactions(userId: string): Promise<Transaction[]> {
    const response = await authenticatedGet<TransactionsResponse | Transaction[]>(
      `/transactions/recent?userId=${userId}`
    );
    
    // Handle both response formats
    if ('transactions' in response) {
      return response.transactions;
    }
    return response;
  }
}

// Create a singleton instance of the TransactionsService
export const transactionsService = new TransactionsService();
