import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../i18n/I18nContext'

export function UserAccount() {
  const { user } = useAuth()
  const { orders } = useApp()
  const { t, formatMoney } = useI18n()

  const myOrders = orders.filter((o) => o.userId === user?.username)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">{t('account.title')}</h1>
      <p className="mt-2 text-slate-600">
        {t('account.welcome', { name: user?.username ?? '' })}
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">{t('account.myOrders')}</h2>
        {myOrders.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">{t('account.noOrders')}</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {myOrders.map((order) => (
              <li key={order.id} className="flex flex-wrap items-center justify-between gap-2 py-4">
                <div>
                  <p className="font-medium text-slate-900">{order.reference}</p>
                  <p className="text-sm text-slate-500">
                    {t(`orderStatus.${order.status}`)} · {formatMoney(order.total)}
                  </p>
                </div>
                <Link
                  to={`/orders/${order.id}`}
                  state={{ order }}
                  className="text-sm font-semibold text-brand-700 hover:underline"
                >
                  {t('account.viewOrder')}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link
        to="/products"
        className="mt-8 inline-flex rounded-xl bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700"
      >
        {t('account.shopCatalog')}
      </Link>
    </div>
  )
}
