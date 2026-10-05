import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { useApp } from '../context/AppContext'
import { useI18n } from '../i18n/I18nContext'

export function ProductDetails() {
  const { id } = useParams()
  const { products, addToCart } = useApp()
  const { t, formatMoney, productName, productDescription, categoryName, stockStatus } =
    useI18n()
  const product = products.find((p) => p.id === id && p.active)
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <EmptyState
          title={t('product.notFoundTitle')}
          description={t('product.notFoundDescription')}
          actionLabel={t('product.browseCatalog')}
        />
      </div>
    )
  }

  const stock = stockStatus(product)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/products" className="text-sm font-medium text-brand-700 hover:underline">
        {t('product.back')}
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
          <img
            src={product.imageUrl}
            alt={productName(product)}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div>
          <p className="text-sm font-medium text-slate-500">
            {categoryName(product.categoryId)} · {product.sku}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{productName(product)}</h1>
          <p className="mt-4 text-slate-600">{productDescription(product)}</p>

          <p className="mt-6 text-3xl font-bold text-slate-900">{formatMoney(product.price)}</p>
          <p
            className={[
              'mt-1 text-sm font-medium',
              stock.tone === 'ok' && 'text-emerald-700',
              stock.tone === 'low' && 'text-amber-700',
              stock.tone === 'out' && 'text-red-700',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {stock.text}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              {t('product.quantity')}
              <input
                type="number"
                min={1}
                max={Math.max(1, product.onHand)}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Math.min(product.onHand, Number(e.target.value) || 1)))
                }
                className="w-20 rounded-lg border border-slate-300 px-2 py-2"
                disabled={product.onHand <= 0}
              />
            </label>
            <button
              type="button"
              disabled={product.onHand <= 0}
              onClick={() => addToCart(product.id, quantity)}
              className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700 disabled:bg-slate-300"
            >
              {t('product.addToCart')}
            </button>
            <Link
              to="/cart"
              className="text-sm font-semibold text-brand-700 hover:underline"
            >
              {t('product.viewCart')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
