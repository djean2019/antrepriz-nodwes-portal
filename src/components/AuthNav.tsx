import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../i18n/I18nContext'

export function AuthNav() {
  const { user, logout, isGuest } = useAuth()
  const { t } = useI18n()

  if (isGuest) {
    return (
      <Link
        to="/login"
        className="rounded-lg border border-brand-600 px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
      >
        {t('auth.login')}
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {user?.role === 'customer' ? (
        <Link
          to="/account"
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          {user.username}
        </Link>
      ) : (
        <Link
          to="/admin"
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          {user?.username}
        </Link>
      )}
      <button
        type="button"
        onClick={logout}
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:border-slate-300"
      >
        {t('auth.logout')}
      </button>
    </div>
  )
}
