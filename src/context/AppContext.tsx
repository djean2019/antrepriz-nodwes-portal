import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { initialNotifications, initialProducts } from '../data/mockData'
import type {
  CartLine,
  FulfillmentType,
  PlacedOrder,
  Product,
  ProductNotification,
} from '../types'

type AppContextValue = {
  products: Product[]
  notifications: ProductNotification[]
  cart: CartLine[]
  orders: PlacedOrder[]
  unreadNotificationCount: number
  addToCart: (productId: string, quantity?: number) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  markNotificationRead: (notificationId: string) => void
  placeOrder: (input: {
    customerName: string
    customerEmail: string
    customerPhone: string
    fulfillmentType: FulfillmentType
    deliveryAddress?: string
    userId?: string
  }) =>
    | { ok: true; order: PlacedOrder }
    | {
        ok: false
        error:
          | { code: 'empty_cart' }
          | { code: 'delivery_address_required' }
          | { code: 'product_unavailable' }
          | { code: 'insufficient_stock'; productId: string; available: number }
      }
  upsertProduct: (product: Product) => void
  archiveProduct: (productId: string) => void
  setStock: (productId: string, onHand: number) => void
  publishProduct: (draft: Omit<Product, 'id' | 'active'> & { id?: string }) => void
  updateOrderStatus: (orderId: string, status: PlacedOrder['status']) => void
}

const AppContext = createContext<AppContextValue | null>(null)

function nextId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [notifications, setNotifications] =
    useState<ProductNotification[]>(initialNotifications)
  const [cart, setCart] = useState<CartLine[]>([])
  const [orders, setOrders] = useState<PlacedOrder[]>([])
  const unreadNotificationCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  )

  const addToCart = useCallback((productId: string, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((line) => line.productId === productId)
      if (existing) {
        return prev.map((line) =>
          line.productId === productId
            ? { ...line, quantity: line.quantity + quantity }
            : line,
        )
      }
      return [...prev, { productId, quantity }]
    })
  }, [])

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    setCart((prev) =>
      prev
        .map((line) =>
          line.productId === productId ? { ...line, quantity } : line,
        )
        .filter((line) => line.quantity > 0),
    )
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((line) => line.productId !== productId))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    )
  }, [])

  const placeOrder = useCallback(
    (input: {
      customerName: string
      customerEmail: string
      customerPhone: string
      fulfillmentType: FulfillmentType
      deliveryAddress?: string
      userId?: string
    }) => {
      if (cart.length === 0) {
        return { ok: false as const, error: { code: 'empty_cart' as const } }
      }

      if (input.fulfillmentType === 'delivery' && !input.deliveryAddress?.trim()) {
        return {
          ok: false as const,
          error: { code: 'delivery_address_required' as const },
        }
      }

      const lines: PlacedOrder['items'] = []
      let subtotal = 0

      for (const line of cart) {
        const product = products.find((p) => p.id === line.productId && p.active)
        if (!product) {
          return {
            ok: false as const,
            error: { code: 'product_unavailable' as const },
          }
        }
        if (product.onHand < line.quantity) {
          return {
            ok: false as const,
            error: {
              code: 'insufficient_stock' as const,
              productId: product.id,
              available: product.onHand,
            },
          }
        }
        const lineTotal = product.price * line.quantity
        subtotal += lineTotal
        lines.push({
          productId: product.id,
          name: product.name,
          quantity: line.quantity,
          unitPrice: product.price,
        })
      }

      const deliveryFee = input.fulfillmentType === 'delivery' ? 12.5 : 0
      const order: PlacedOrder = {
        id: nextId('ord'),
        reference: `AN-${Date.now().toString().slice(-8)}`,
        status: 'PENDING',
        fulfillmentType: input.fulfillmentType,
        customerName: input.customerName.trim(),
        customerEmail: input.customerEmail.trim(),
        customerPhone: input.customerPhone.trim(),
        deliveryAddress: input.deliveryAddress?.trim(),
        userId: input.userId,
        items: lines,
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee,
        createdAt: new Date().toISOString(),
      }

      setProducts((prev) =>
        prev.map((p) => {
          const ordered = lines.find((l) => l.productId === p.id)
          if (!ordered) return p
          return { ...p, onHand: Math.max(0, p.onHand - ordered.quantity) }
        }),
      )
      setOrders((prev) => [order, ...prev])
      setCart([])
      return { ok: true as const, order }
    },
    [cart, products],
  )

  const upsertProduct = useCallback((product: Product) => {
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id)
      if (idx === -1) return [...prev, product]
      const copy = [...prev]
      copy[idx] = product
      return copy
    })
  }, [])

  const archiveProduct = useCallback((productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, active: false } : p)),
    )
  }, [])

  const setStock = useCallback((productId: string, onHand: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, onHand: Math.max(0, onHand) } : p)),
    )
  }, [])

  const publishProduct = useCallback(
    (draft: Omit<Product, 'id' | 'active'> & { id?: string }) => {
      const isNew = !draft.id
      const id = draft.id ?? nextId('prod')
      const product: Product = {
        ...draft,
        id,
        active: true,
      }
      setProducts((prev) => {
        if (isNew) return [product, ...prev]
        return prev.map((p) => (p.id === id ? product : p))
      })
      if (isNew) {
        setNotifications((prev) => [
          {
            id: nextId('notif'),
            productId: id,
            title: `New: ${product.name}`,
            createdAt: new Date().toISOString(),
            read: false,
          },
          ...prev,
        ])
      }
    },
    [],
  )

  const updateOrderStatus = useCallback(
    (orderId: string, status: PlacedOrder['status']) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
      )
    },
    [],
  )

  const value: AppContextValue = {
    products,
    notifications,
    cart,
    orders,
    unreadNotificationCount,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    markNotificationRead,
    placeOrder,
    upsertProduct,
    archiveProduct,
    setStock,
    publishProduct,
    updateOrderStatus,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
