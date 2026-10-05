import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Product } from '../types'
import { en } from './messages/en'
import { fr, type MessageTree } from './messages/fr'

export type Locale = 'fr' | 'en'

const STORAGE_KEY = 'antrepriznodwes-locale'

const messages: Record<Locale, MessageTree> = { fr, en: en as MessageTree }

type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, vars?: Record<string, string | number>) => string
  formatMoney: (amount: number) => string
  productName: (product: Product) => string
  productDescription: (product: Product) => string
  categoryName: (categoryId: string) => string
  stockStatus: (product: Product) => { text: string; tone: 'ok' | 'low' | 'out' }
}

const I18nContext = createContext<I18nContextValue | null>(null)

function getByPath(tree: MessageTree, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, tree)
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
    vars[key] !== undefined ? String(vars[key]) : `{{${key}}}`,
  )
}

function readInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'fr'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'en' || stored === 'fr') return stored
  return 'fr'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const tree = messages[locale]

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const value = getByPath(tree, key)
      if (typeof value === 'string') return interpolate(value, vars)
      return key
    },
    [tree],
  )

  const formatMoney = useCallback(
    (amount: number) =>
      new Intl.NumberFormat(locale === 'fr' ? 'fr-HT' : 'en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount),
    [locale],
  )

  const productName = useCallback(
    (product: Product) => {
      const localized = getByPath(tree, `products.${product.id}.name`)
      if (typeof localized === 'string') return localized
      return product.name
    },
    [tree],
  )

  const productDescription = useCallback(
    (product: Product) => {
      const localized = getByPath(tree, `products.${product.id}.description`)
      if (typeof localized === 'string') return localized
      return product.description
    },
    [tree],
  )

  const categoryName = useCallback(
    (categoryId: string) => {
      const localized = getByPath(tree, `categories.${categoryId}`)
      if (typeof localized === 'string') return localized
      return categoryId
    },
    [tree],
  )

  const stockStatus = useCallback(
    (product: Product): { text: string; tone: 'ok' | 'low' | 'out' } => {
      if (product.onHand <= 0) {
        return { text: t('stock.outOfStock'), tone: 'out' }
      }
      if (product.onHand <= product.lowStockThreshold) {
        return {
          text: t('stock.lowStock', { count: product.onHand }),
          tone: 'low',
        }
      }
      return { text: t('stock.inStock'), tone: 'ok' }
    },
    [t],
  )

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = t('meta.title')
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', t('meta.description'))
  }, [locale, t])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      formatMoney,
      productName,
      productDescription,
      categoryName,
      stockStatus,
    }),
    [
      locale,
      setLocale,
      t,
      formatMoney,
      productName,
      productDescription,
      categoryName,
      stockStatus,
    ],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
