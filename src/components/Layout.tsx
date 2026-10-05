import { Link, NavLink, Outlet } from 'react-router-dom'
import { useI18n } from '../i18n/I18nContext'
import { AuthNav } from './AuthNav'
import { CartNavLink } from './CartNavLink'
import { LanguageSwitch } from './LanguageSwitch'
import { NotificationBell } from './NotificationBell'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-brand-600 text-white'
      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
  ].join(' ')

export function Layout() {
  const { t } = useI18n()

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link to="/" className="group flex flex-col leading-tight">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
              {t('brand.tagline')}
            </span>
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-brand-700 sm:text-2xl">
              {t('brand.company')}
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-1 sm:gap-2">
            <LanguageSwitch />
            <NavLink to="/" end className={navLinkClass}>
              {t('nav.home')}
            </NavLink>
            <NavLink to="/products" className={navLinkClass}>
              {t('nav.catalog')}
            </NavLink>
            <CartNavLink />
            <NotificationBell />
            <AuthNav />
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-slate-850 text-slate-300">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-white">{t('brand.company')}</p>
            <p className="text-sm text-slate-400">{t('footer.pickupDelivery')}</p>
          </div>
          <p className="text-sm text-slate-500">{t('footer.mvpNote')}</p>
        </div>
      </footer>
    </div>
  )
}
