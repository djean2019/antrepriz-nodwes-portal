import { Link, useLocation, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useI18n } from '../i18n/I18nContext'
import type { PlacedOrder } from '../types'

export function OrderConfirmation() {
  const { orderId } = useParams()
  const location = useLocation()
  const { orders } = useApp()
  const { t, formatMoney } = useI18n()

  const order =
    (location.state as { order?: PlacedOrder } | null)?.order ??
    orders.find((o) => o.id === orderId)

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-slate-600">{t('order.notFound')}</p>
        <Link to="/" className="mt-4 inline-block font-semibold text-brand-700">
          {t('order.returnHome')}
        </Link>
      </div>
    )
  }

  const modeKey =
    order.fulfillmentType === 'pickup' ? 'order.modePickup' : 'order.modeDelivery'

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
          {t('order.confirmed')}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          {t('order.reference', { ref: order.reference })}
        </h1>
        <p className="mt-2 text-slate-600">
          {t('order.thankYou', {
            name: order.customerName,
            mode: t(modeKey),
          })}
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">{t('order.status')}</dt>
            <dd className="font-medium">{t(`orderStatus.${order.status}`)}</dd>
          </div>
          <div>
            <dt className="text-slate-500">{t('order.fulfillment')}</dt>
            <dd className="font-medium capitalize">
              {t(`fulfillment.${order.fulfillmentType}`)}
            </dd>
          </div>
          {order.deliveryAddress && (
            <div className="sm:col-span-2">
              <dt className="text-slate-500">{t('order.deliveryAddress')}</dt>
              <dd className="font-medium">{order.deliveryAddress}</dd>
            </div>
          )}
        </dl>

        <ul className="mt-6 divide-y divide-slate-100">
          {order.items.map((item) => (
            <li key={item.productId} className="flex justify-between py-3 text-sm">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatMoney(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-right text-lg font-bold">
          {t('order.total')} {formatMoney(order.total)}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          to="/products"
          className="rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700"
        >
          {t('order.continueShopping')}
        </Link>
        <Link to="/" className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold">
          {t('order.home')}
        </Link>
      </div>
    </div>
  )
}
