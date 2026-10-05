import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DELIVERY_FEE } from '../data/mockData'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../i18n/I18nContext'
import type { FulfillmentType } from '../types'

export function Checkout() {
  const { cart, products, placeOrder } = useApp()
  const { user } = useAuth()
  const { t, formatMoney, productName } = useI18n()
  const navigate = useNavigate()
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('pickup')
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const lines = cart
    .map((line) => {
      const product = products.find((p) => p.id === line.productId && p.active)
      if (!product) return null
      return { ...line, product }
    })
    .filter(Boolean) as { quantity: number; product: (typeof products)[0] }[]

  const subtotal = lines.reduce(
    (sum, l) => sum + l.product.price * l.quantity,
    0,
  )
  const deliveryFee = fulfillmentType === 'delivery' ? DELIVERY_FEE : 0
  const total = subtotal + deliveryFee

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-slate-600">{t('checkout.emptyCart')}</p>
        <Link to="/products" className="mt-4 inline-block font-semibold text-brand-700">
          {t('checkout.browseProducts')}
        </Link>
      </div>
    )
  }

  function resolveError(
    err: Extract<
      ReturnType<typeof placeOrder>,
      { ok: false }
    >['error'],
  ): string {
    switch (err.code) {
      case 'empty_cart':
        return t('checkout.errors.emptyCart')
      case 'delivery_address_required':
        return t('checkout.errors.deliveryAddress')
      case 'product_unavailable':
        return t('checkout.errors.productUnavailable')
      case 'insufficient_stock': {
        const product = products.find((p) => p.id === err.productId)
        return t('checkout.errors.insufficientStock', {
          name: product ? productName(product) : '—',
          count: err.available,
        })
      }
      default:
        return t('checkout.errors.emptyCart')
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const result = placeOrder({
      customerName,
      customerEmail,
      customerPhone,
      fulfillmentType,
      deliveryAddress: fulfillmentType === 'delivery' ? deliveryAddress : undefined,
      userId: user?.role === 'customer' ? user.username : undefined,
    })
    setSubmitting(false)
    if (!result.ok) {
      setError(resolveError(result.error))
      return
    }
    navigate(`/orders/${result.order.id}`, { state: { order: result.order } })
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">{t('checkout.title')}</h1>
      <p className="mt-2 text-slate-600">{t('checkout.subtitle')}</p>

      <form onSubmit={handleSubmit} className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <fieldset className="space-y-3">
            <legend className="text-lg font-semibold text-slate-900">
              {t('checkout.fulfillment')}
            </legend>
            <label className="flex cursor-pointer gap-3 rounded-xl border border-slate-200 p-4 has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50">
              <input
                type="radio"
                name="fulfillment"
                checked={fulfillmentType === 'pickup'}
                onChange={() => setFulfillmentType('pickup')}
              />
              <span>
                <span className="block font-medium">{t('checkout.pickup')}</span>
                <span className="text-sm text-slate-600">{t('checkout.pickupHint')}</span>
              </span>
            </label>
            <label className="flex cursor-pointer gap-3 rounded-xl border border-slate-200 p-4 has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50">
              <input
                type="radio"
                name="fulfillment"
                checked={fulfillmentType === 'delivery'}
                onChange={() => setFulfillmentType('delivery')}
              />
              <span>
                <span className="block font-medium">{t('checkout.delivery')}</span>
                <span className="text-sm text-slate-600">
                  {t('checkout.deliveryHint', { fee: formatMoney(DELIVERY_FEE) })}
                </span>
              </span>
            </label>
          </fieldset>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">{t('checkout.contact')}</h2>
            <input
              required
              placeholder={t('checkout.name')}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
            <input
              required
              type="email"
              placeholder={t('checkout.email')}
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
            <input
              required
              type="tel"
              placeholder={t('checkout.phone')}
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
            {fulfillmentType === 'delivery' && (
              <textarea
                required
                placeholder={t('checkout.address')}
                rows={3}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            )}
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-brand-600 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {submitting ? t('checkout.placing') : t('checkout.placeOrder')}
          </button>
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">{t('checkout.summary')}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {lines.map(({ product, quantity }) => (
              <li key={product.id} className="flex justify-between gap-2">
                <span>
                  {productName(product)} × {quantity}
                </span>
                <span>{formatMoney(product.price * quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
            <div className="flex justify-between">
              <dt>{t('cart.subtotal')}</dt>
              <dd>{formatMoney(subtotal)}</dd>
            </div>
            {deliveryFee > 0 && (
              <div className="flex justify-between">
                <dt>{t('checkout.deliveryLine')}</dt>
                <dd>{formatMoney(deliveryFee)}</dd>
              </div>
            )}
            <div className="flex justify-between text-base font-bold">
              <dt>{t('checkout.total')}</dt>
              <dd>{formatMoney(total)}</dd>
            </div>
          </dl>
        </aside>
      </form>
    </div>
  )
}
