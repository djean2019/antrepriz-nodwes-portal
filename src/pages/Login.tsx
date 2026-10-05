import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../i18n/I18nContext'

type Mode = 'login' | 'signup'

export function Login() {
  const { user, login, signUp } = useAuth()
  const { t } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from

  const [mode, setMode] = useState<Mode>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/account'} replace />
  }

  function redirectAfterAuth(role: 'customer' | 'admin') {
    if (from && role === 'customer' && from !== '/admin') {
      navigate(from, { replace: true })
      return
    }
    if (from === '/admin' && role === 'admin') {
      navigate('/admin', { replace: true })
      return
    }
    navigate(role === 'admin' ? '/admin' : '/account', { replace: true })
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const result = login(username, password)
    if (!result.ok) {
      setError(t('auth.errors.invalid'))
      return
    }
    redirectAfterAuth(result.user.role)
  }

  function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError(t('auth.errors.passwordMismatch'))
      return
    }
    const result = signUp(username, password)
    if (!result.ok) {
      if (result.reason === 'exists') setError(t('auth.errors.exists'))
      else if (result.reason === 'invalid_username') setError(t('auth.errors.invalidUsername'))
      else setError(t('auth.errors.weakPassword'))
      return
    }
    redirectAfterAuth('customer')
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">
        {mode === 'login' ? t('auth.loginTitle') : t('auth.signUpTitle')}
      </h1>
      <p className="mt-2 text-sm text-slate-600">{t('auth.guestHint')}</p>

      <div className="mt-6 flex rounded-lg border border-slate-200 p-1">
        <button
          type="button"
          onClick={() => {
            setMode('login')
            setError(null)
          }}
          className={[
            'flex-1 rounded-md py-2 text-sm font-semibold',
            mode === 'login' ? 'bg-brand-600 text-white' : 'text-slate-600',
          ].join(' ')}
        >
          {t('auth.login')}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('signup')
            setError(null)
          }}
          className={[
            'flex-1 rounded-md py-2 text-sm font-semibold',
            mode === 'signup' ? 'bg-brand-600 text-white' : 'text-slate-600',
          ].join(' ')}
        >
          {t('auth.signUp')}
        </button>
      </div>

      <form
        onSubmit={mode === 'login' ? handleLogin : handleSignUp}
        className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            {t('auth.username')}
          </label>
          <input
            required
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            {t('auth.password')}
          </label>
          <input
            required
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        {mode === 'signup' && (
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              {t('auth.confirmPassword')}
            </label>
            <input
              required
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-xl bg-brand-600 py-3 font-semibold text-white hover:bg-brand-700"
        >
          {mode === 'login' ? t('auth.login') : t('auth.createAccount')}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        <Link to="/" className="font-semibold text-brand-700 hover:underline">
          {t('auth.continueAsGuest')}
        </Link>
      </p>
    </div>
  )
}
