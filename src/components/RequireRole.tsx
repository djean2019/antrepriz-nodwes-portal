import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth, type UserRole } from '../context/AuthContext'

export function RequireRole({
  role,
  children,
}: {
  role: UserRole
  children: ReactNode
}) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/account'} replace />
  }

  return children
}
