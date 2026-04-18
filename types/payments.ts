export type PaymentProvider = 'stripe' | 'yukassa'
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded'
export type SubscriptionPlan = 'monthly' | 'yearly'
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'trialing'
export type OrderStatus = 'pending' | 'paid' | 'cancelled'
export type PurchaseType = 'one_time' | 'subscription'

export interface CreatePaymentSessionParams {
  courseId?: string
  userId: string
  plan?: SubscriptionPlan
  purchaseType: PurchaseType
  amount: number
  currency: string
  locale: string
  successUrl: string
  cancelUrl: string
}

export interface PaymentSessionResult {
  url: string
  sessionId: string
  provider: PaymentProvider
}

export interface CreateYuKassaPaymentParams {
  courseId?: string
  userId: string
  plan?: SubscriptionPlan
  purchaseType: PurchaseType
  amount: number
  currency: string
  description: string
  returnUrl: string
}

export interface YuKassaPaymentResult {
  paymentId: string
  confirmationUrl: string
  status: PaymentStatus
}

export interface CheckAccessResult {
  hasAccess: boolean
  reason?: 'purchased' | 'subscription' | 'no_access'
}

export interface StripeWebhookEvent {
  type: string
  data: {
    object: Record<string, unknown>
  }
}

export interface YuKassaWebhookEvent {
  type: string
  object: {
    id: string
    status: string
    amount: { value: string; currency: string }
    metadata?: Record<string, string>
  }
}

export interface OrderRecord {
  id: string
  user: string
  courseId?: string
  amount: number
  currency: string
  status: OrderStatus
  paymentMethod: PaymentProvider
  paymentId?: string
  createdAt: string
}

export interface SubscriptionRecord {
  id: string
  user: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  startDate: string
  endDate: string
  paymentMethod: PaymentProvider
  providerSubscriptionId?: string
}

export interface PaymentRecord {
  id: string
  order?: string
  subscription?: string
  provider: PaymentProvider
  amount: number
  currency: string
  status: PaymentStatus
  providerPaymentId?: string
  metadata?: Record<string, unknown>
}
