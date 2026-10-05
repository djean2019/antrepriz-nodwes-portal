import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { useApp } from '../context/AppContext'
import { useI18n } from '../i18n/I18nContext'

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useApp()
  const { t, formatMoney, productName, stockStatus } = useI18n()
  const stock = stockStatus(product)

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <Link to={`/products/${product.id}`} className="block aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={product.imageUrl}
          alt={productName(product)}
          className="h-full w-full object-cover transition duration-300 hover:scale-105"
          loading="lazy"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {product.sku}
          </p>
          <Link
            to={`/products/${product.id}`}
            className="mt-1 line-clamp-2 text-lg font-semibold text-slate-900 hover:text-brand-700"
          >
            {productName(product)}
          </Link>
        </div>
        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <p className="text-xl font-bold text-slate-900">{formatMoney(product.price)}</p>
            <p
              className={[
                'text-xs font-medium',
                stock.tone === 'ok' && 'text-emerald-700',
                stock.tone === 'low' && 'text-amber-700',
                stock.tone === 'out' && 'text-red-700',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {stock.text}
            </p>
          </div>
          <button
            type="button"
            disabled={product.onHand <= 0}
            onClick={() => addToCart(product.id, 1)}
            className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {t('product.add')}
          </button>
        </div>
      </div>
    </article>
  )
}
