import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useI18n } from '../i18n/I18nContext'

export function NotificationBell() {
  const { notifications, unreadNotificationCount, markNotificationRead, products } =
    useApp()
  const { t, formatMoney, productName } = useI18n()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        aria-label={t('notifications.label')}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-300"
      >
        {t('nav.alerts')}
        {unreadNotificationCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-xs font-bold text-white">
            {unreadNotificationCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
          <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t('notifications.newProducts')}
          </p>
          {notifications.length === 0 ? (
            <p className="px-2 py-4 text-sm text-slate-500">{t('notifications.empty')}</p>
          ) : (
            <ul className="max-h-72 space-y-1 overflow-y-auto">
              {notifications.map((n) => {
                const product = products.find((p) => p.id === n.productId)
                const title =
                  n.title ||
                  (product
                    ? t('notifications.newProduct', { name: productName(product) })
                    : t('notifications.newProduct', { name: '—' }))
                return (
                  <li key={n.id}>
                    <Link
                      to={`/products/${n.productId}`}
                      onClick={() => {
                        markNotificationRead(n.id)
                        setOpen(false)
                      }}
                      className={[
                        'block rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50',
                        n.read ? 'text-slate-600' : 'bg-brand-50 font-medium text-brand-900',
                      ].join(' ')}
                    >
                      <span>{title}</span>
                      {product && (
                        <span className="mt-0.5 block text-xs text-slate-500">
                          {formatMoney(product.price)} · {product.sku}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
