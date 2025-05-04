/**
 * Subscription entity type
 */
export enum SubscriptionStatus {
  ACTIVE = "active",
  CANCELED = "canceled",
  PAST_DUE = "past_due",
  PENDING = "pending",
  EXPIRED = "expired",
}

export interface Subscription {
  id: string
  user_id: string
  plan_id: string
  status: SubscriptionStatus
  start_date: Date
  end_date?: Date
  current_period_start?: Date
  current_period_end?: Date
  paypal_subscription_id?: string
  created_at: Date
  updated_at: Date
}

/**
 * Response types for subscription API endpoints
 */
export interface SubscriptionResponse {
  subscription: Subscription
  message?: string
}

export interface SubscriptionsResponse {
  subscriptions: Subscription[]
  message?: string
}

/**
 * DTO types for creating subscriptions
 */
export interface CreateSubscriptionDto {
  user_id: string
  plan_id: string
  status: SubscriptionStatus
  start_date: Date
  end_date?: Date
  current_period_start?: Date
  current_period_end?: Date
  paypal_subscription_id?: string
}

/**
 * DTO types for updating subscriptions
 */
export interface UpdateSubscriptionDto extends Partial<CreateSubscriptionDto> {
  id: string
}
