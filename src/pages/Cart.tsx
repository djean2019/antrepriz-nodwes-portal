import { Link } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { useApp } from '../context/AppContext'
import { useI18n } from '../i18n/I18nContext'

export function Cart() {
  const { cart, products, updateCartQuantity, removeFromCart } = useApp()
  const { t, formatMoney, productName } = useI18n()

  const lines = cart
    .map((line) => {
      const product = products.find((p) => p.id === line.productId && p.active)
      if (!product) return null
      return { ...line, product }
    })
    .filter(Boolean) as { productId: string; quantity: number; product: (typeof products)[0] }[]

  const subtotal = lines.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0,
  )

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <EmptyState
          title={t('cart.emptyTitle')}
          description={t('cart.emptyDescription')}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">{t('cart.title')}</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <ul className="space-y-4 lg:col-span-2">
          {lines.map(({ product, quantity }) => (
            <li
              key={product.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center"
            >
              <img
                src={product.imageUrl}
                alt=""
                className="h-24 w-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <Link
                  to={`/products/${product.id}`}
                  className="font-semibold text-slate-900 hover:text-brand-700"
                >
                  {productName(product)}
                </Link>
                <p className="text-sm text-slate-500">{product.sku}</p>
                <p className="mt-1 font-medium">
                  {formatMoney(product.price)} {t('cart.each')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={product.onHand}
                  value={quantity}
                  onChange={(e) =>
                    updateCartQuantity(
                      product.id,
                      Math.max(1, Number(e.target.value) || 1),
                    )
                  }
                  className="w-16 rounded-lg border border-slate-300 px-2 py-1"
                />
                <button
                  type="button"
                  onClick={() => removeFromCart(product.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  {t('cart.remove')}
                </button>
              </div>
              <p className="font-semibold sm:w-24 sm:text-right">
                {formatMoney(product.price * quantity)}
              </p>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{t('cart.summary')}</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">{t('cart.subtotal')}</dt>
              <dd className="font-medium">{formatMoney(subtotal)}</dd>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2 text-base">
              <dt className="font-semibold text-slate-900">{t('cart.estimatedTotal')}</dt>
              <dd className="font-bold">{formatMoney(subtotal)}</dd>
            </div>
          </dl>
          <p className="mt-2 text-xs text-slate-500">{t('cart.deliveryNote')}</p>
          <Link
            to="/checkout"
            className="mt-6 block rounded-xl bg-brand-600 py-3 text-center font-semibold text-white hover:bg-brand-700"
          >
            {t('cart.checkout')}
          </Link>
        </aside>
      </div>
    </div>
  )
}
