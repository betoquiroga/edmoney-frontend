import { ApiService } from "./api.service"
import {
  Account,
  AccountResponse,
  AccountsResponse,
  CreateAccountDto,
  UpdateAccountDto,
} from "../types/account.types"

export class AccountsService {
  private apiService: ApiService
  private static instance: AccountsService

  private constructor() {
    this.apiService = ApiService.getInstance()
  }

  // Singleton pattern to ensure only one instance
  public static getInstance(): AccountsService {
    if (!AccountsService.instance) {
      AccountsService.instance = new AccountsService()
    }
    return AccountsService.instance
  }

  /**
   * Create a new account
   * @param createAccountDto Account data to create
   */
  public async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const response = await this.apiService.post<AccountResponse>(
      "/accounts",
      createAccountDto,
    )
    return response.data.account
  }

  /**
   * Get all accounts for a user
   * @param userId User ID
   */
  public async findAll(userId: string): Promise<Account[]> {
    const response = await this.apiService.get<AccountsResponse>(
      `/accounts?userId=${userId}`,
    )
    return response.data.accounts
  }

  /**
   * Get an account by ID
   * @param id Account ID
   * @param userId User ID
   */
  public async findOne(id: string, userId: string): Promise<Account> {
    const response = await this.apiService.get<AccountResponse>(
      `/accounts/${id}?userId=${userId}`,
    )
    return response.data.account
  }

  /**
   * Update an account
   * @param id Account ID
   * @param updateAccountDto Account data to update
   */
  public async update(
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const response = await this.apiService.patch<AccountResponse>(
      `/accounts/${id}`,
      updateAccountDto,
    )
    return response.data.account
  }

  /**
   * Delete an account
   * @param id Account ID
   * @param userId User ID
   */
  public async remove(id: string, userId: string): Promise<void> {
    await this.apiService.delete(`/accounts/${id}?userId=${userId}`)
  }
}

// Create a singleton instance of the AccountsService
export const accountsService = AccountsService.getInstance()
