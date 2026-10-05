import type { Category, Product, ProductNotification } from '../types'

export const categories: Category[] = [
  { id: 'cat-cement', name: 'Ciment et béton', slug: 'cement-concrete' },
  { id: 'cat-lumber', name: 'Bois et charpente', slug: 'lumber-framing' },
  { id: 'cat-roofing', name: 'Toiture', slug: 'roofing' },
  { id: 'cat-plumbing', name: 'Plomberie', slug: 'plumbing' },
  { id: 'cat-tools', name: 'Outils et quincaillerie', slug: 'tools-hardware' },
]

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    sku: 'CEM-50KG',
    name: 'Ciment Portland 50 kg',
    description:
      'Ciment Type I usage général pour fondations, blocs et coulées structurelles.',
    price: 18.5,
    categoryId: 'cat-cement',
    imageUrl:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    active: true,
    onHand: 240,
    lowStockThreshold: 40,
  },
  {
    id: 'prod-2',
    sku: 'BLK-6IN',
    name: 'Bloc de béton 6 po',
    description: 'Bloc creux standard pour murs et cloisons.',
    price: 2.25,
    categoryId: 'cat-cement',
    imageUrl:
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80',
    active: true,
    onHand: 1200,
    lowStockThreshold: 200,
  },
  {
    id: 'prod-3',
    sku: 'LUM-2X4-8',
    name: 'Bois traité 2×4×8 pi',
    description: 'Bois contact sol pour charpente et coffrage.',
    price: 9.75,
    categoryId: 'cat-lumber',
    imageUrl:
      'https://images.unsplash.com/photo-1513467535987-fd81bc718ddf?w=800&q=80',
    active: true,
    onHand: 86,
    lowStockThreshold: 25,
  },
  {
    id: 'prod-4',
    sku: 'ROF-CORR',
    name: 'Tôle ondulée galvanisée',
    description: 'Tôle ondulée 8 pi avec fixations compatibles.',
    price: 42.0,
    categoryId: 'cat-roofing',
    imageUrl:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    active: true,
    onHand: 64,
    lowStockThreshold: 15,
  },
  {
    id: 'prod-5',
    sku: 'PLB-PVC-1',
    name: 'Tuyau PVC 1 po × 10 pi',
    description: 'PVC Schedule 40 pour eau froide et drainage.',
    price: 11.4,
    categoryId: 'cat-plumbing',
    imageUrl:
      'https://images.unsplash.com/photo-1585704032915-c3400ca376be?w=800&q=80',
    active: true,
    onHand: 18,
    lowStockThreshold: 20,
  },
  {
    id: 'prod-6',
    sku: 'TOL-HAM-16',
    name: 'Marteau arrache-clou 16 oz',
    description: 'Manche fibre de verre pour le chantier.',
    price: 14.99,
    categoryId: 'cat-tools',
    imageUrl:
      'https://images.unsplash.com/photo-1504145680798-27d4169b3529?w=800&q=80',
    active: true,
    onHand: 52,
    lowStockThreshold: 10,
  },
]

export const initialNotifications: ProductNotification[] = [
  {
    id: 'notif-1',
    productId: 'prod-6',
    title: '',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    read: false,
  },
]

export const DELIVERY_FEE = 12.5
