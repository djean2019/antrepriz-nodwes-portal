export type Category = {
  id: string
  name: string
  slug: string
}

export type Product = {
  id: string
  sku: string
  name: string
  description: string
  price: number
  categoryId: string
  imageUrl: string
  active: boolean
  onHand: number
  lowStockThreshold: number
}

export type FulfillmentType = 'pickup' | 'delivery'

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'OUT_FOR_DELIVERY'
  | 'COMPLETED'
  | 'CANCELLED'

export type CartLine = {
  productId: string
  quantity: number
}

export type PlacedOrder = {
  id: string
  reference: string
  status: OrderStatus
  fulfillmentType: FulfillmentType
  userId?: string
  customerName: string
  customerEmail: string
  customerPhone: string
  deliveryAddress?: string
  items: { productId: string; name: string; quantity: number; unitPrice: number }[]
  subtotal: number
  deliveryFee: number
  total: number
  createdAt: string
}

export type ProductNotification = {
  id: string
  productId: string
  title: string
  createdAt: string
  read: boolean
}
