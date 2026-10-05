import { NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useI18n } from '../i18n/I18nContext'

function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="17" cy="20" r="1.5" />
      <path d="M2 3h2l2.4 12.4a2 2 0 0 0 2 1.6h9.2a2 2 0 0 0 2-1.6L22 6H6" />
    </svg>
  )
}

export function CartNavLink() {
  const { cart } = useApp()
  const { t } = useI18n()
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0)

  return (
    <NavLink
      to="/cart"
      aria-label={t('nav.cart')}
      title={t('nav.cart')}
      className={({ isActive }) =>
        [
          'relative inline-flex items-center justify-center rounded-lg p-2.5 transition-colors',
          isActive
            ? 'bg-brand-600 text-white'
            : 'text-slate-700 hover:bg-slate-100 hover:text-brand-700',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          <CartIcon className="h-6 w-6" />
          {cartCount > 0 && (
            <span
              className={[
                'absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold ring-2',
                isActive
                  ? 'bg-white text-brand-700 ring-brand-600'
                  : 'bg-brand-600 text-white ring-white',
              ].join(' ')}
            >
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}
