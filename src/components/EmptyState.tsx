import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function EmptyState({
  title,
  description,
  actionLabel = 'Browse catalog',
  actionTo = '/products',
  icon,
}: {
  title: string
  description: string
  actionLabel?: string
  actionTo?: string
  icon?: ReactNode
}) {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      {icon && <div className="mb-4 flex justify-center text-brand-600">{icon}</div>}
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      <Link
        to={actionTo}
        className="mt-6 inline-flex rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
      >
        {actionLabel}
      </Link>
    </div>
  )
}
