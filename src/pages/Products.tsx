import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { EmptyState } from '../components/EmptyState'
import { categories } from '../data/mockData'
import { useApp } from '../context/AppContext'
import { useI18n } from '../i18n/I18nContext'

export function Products() {
  const { products } = useApp()
  const { t, productName, productDescription, categoryName } = useI18n()
  const [params, setParams] = useSearchParams()
  const q = (params.get('q') ?? '').trim().toLowerCase()
  const categorySlug = params.get('category') ?? ''

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.active)
    if (categorySlug) {
      const cat = categories.find((c) => c.slug === categorySlug)
      if (cat) list = list.filter((p) => p.categoryId === cat.id)
    }
    if (q) {
      list = list.filter((p) => {
        const name = productName(p).toLowerCase()
        const desc = productDescription(p).toLowerCase()
        return (
          name.includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          desc.includes(q)
        )
      })
    }
    return list
  }, [products, q, categorySlug, productName, productDescription])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{t('catalog.title')}</h1>
        <p className="mt-2 text-slate-600">{t('catalog.subtitle')}</p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setParams({})}
          className={[
            'rounded-full px-4 py-1.5 text-sm font-medium',
            !categorySlug ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700',
          ].join(' ')}
        >
          {t('catalog.all')}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setParams({ category: cat.slug })}
            className={[
              'rounded-full px-4 py-1.5 text-sm font-medium',
              categorySlug === cat.slug
                ? 'bg-brand-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
            ].join(' ')}
          >
            {categoryName(cat.id)}
          </button>
        ))}
      </div>

      {q && (
        <p className="mb-4 text-sm text-slate-600">
          {t('catalog.resultsFor')}{' '}
          <span className="font-medium text-slate-900">&quot;{q}&quot;</span>
        </p>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title={t('catalog.emptyTitle')}
          description={t('catalog.emptyDescription')}
          actionLabel={t('catalog.clearFilters')}
          actionTo="/products"
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
