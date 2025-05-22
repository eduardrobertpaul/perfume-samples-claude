import { Prisma } from '@prisma/client'

// Database model types with relations
export type ProductWithInventory = Prisma.ProductGetPayload<{
  include: {
    inventory: true
  }
}>

export type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    orderItems: {
      include: {
        product: true
      }
    }
  }
}>

export type ProductWithReviews = Prisma.ProductGetPayload<{
  include: {
    reviews: {
      where: {
        isPublished: true
      }
    }
  }
}>

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    total?: number
    page?: number
    limit?: number
    hasMore?: boolean
  }
}

// Product related types
export interface ProductFilters {
  brand?: string
  category?: 'designer' | 'niche' | 'fresh' | 'oriental'
  gender?: 'masculine' | 'feminine' | 'unisex'
  priceMin?: number
  priceMax?: number
  inStock?: boolean
  search?: string
}

export interface ProductSearchParams extends ProductFilters {
  page?: number
  limit?: number
  sortBy?: 'name' | 'price' | 'brand' | 'created_at'
  sortOrder?: 'asc' | 'desc'
}

// Cart related types
export interface CartItem {
  productId: string
  sizeMl: 2 | 5 | 10
  quantity: number
  unitPrice: number
  productName: string
  productBrand: string
  productSlug: string
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

// Order related types
export interface CheckoutData {
  customerEmail: string
  customerName?: string
  customerPhone?: string
  shippingAddress: {
    line1: string
    line2?: string
    city: string
    postalCode?: string
    country: string
  }
  deliveryType: 'standard' | 'same_day'
  paymentMethod: 'stripe' | 'cash_on_delivery'
  items: CartItem[]
  notes?: string
}

// Admin related types
export interface InventoryUpdate {
  productId: string
  bottleSizeMl: number
  totalVolume: number
  costPerMl?: number
  supplier?: string
  notes?: string
}

export interface OrderStatusUpdate {
  orderId: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  trackingNumber?: string
  notes?: string
}

// Analytics types
export interface SalesMetrics {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  topProducts: Array<{
    productId: string
    productName: string
    totalSold: number
    revenue: number
  }>
  revenueByMonth: Array<{
    month: string
    revenue: number
    orders: number
  }>
}

export interface InventoryAlert {
  productId: string
  productName: string
  currentVolume: number
  threshold: number
  daysUntilEmpty?: number
}

// Stripe related types
export interface StripeMetadata {
  orderId: string
  customerEmail: string
  items: string // JSON stringified CartItem[]
}

// Error types
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// Validation schemas (Zod will be used for runtime validation)
export interface CreateProductSchema {
  name: string
  brand: string
  description?: string
  topNotes: string[]
  middleNotes: string[]
  baseNotes: string[]
  price2ml?: number
  price5ml?: number
  price10ml?: number
  category?: string
  gender?: string
  imageUrl?: string
}

export interface CreateOrderSchema extends CheckoutData {}

// Environment variables type
export interface EnvConfig {
  DATABASE_URL: string
  REDIS_URL?: string
  NEXTAUTH_SECRET: string
  NEXTAUTH_URL: string
  STRIPE_SECRET_KEY: string
  STRIPE_WEBHOOK_SECRET: string
  EMAIL_SERVER_HOST: string
  EMAIL_SERVER_USER: string
  EMAIL_SERVER_PASSWORD: string
  EMAIL_FROM: string
}