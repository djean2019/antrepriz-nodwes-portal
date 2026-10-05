import { Link } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { ProductSearch } from '../components/ProductSearch'
import { categories } from '../data/mockData'
import { useApp } from '../context/AppContext'
import { useI18n } from '../i18n/I18nContext'
import { useMemo } from 'react'

export function Home() {
  const { products } = useApp()
  const { t, categoryName } = useI18n()

  const activeProducts = useMemo(
    () => products.filter((p) => p.active),
    [products],
  )

  const featured = useMemo(() => activeProducts.slice(0, 4), [activeProducts])

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-850 via-slate-800 to-brand-800 text-white">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-100">
            {t('brand.region')}
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {t('brand.company')}
          </h1>
          <p className="mt-2 max-w-3xl text-sm font-medium text-slate-300 sm:text-base">
            {t('brand.address')}
          </p>
          <p className="mt-4 max-w-2xl text-lg text-slate-200 sm:text-xl">{t('home.heroText')}</p>

          <div className="mt-10 flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur hover:bg-white/20"
              >
                {categoryName(cat.id)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <ProductSearch showLabel className="mb-8 max-w-2xl" />

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{t('home.featuredTitle')}</h2>
            <p className="mt-1 text-slate-600">{t('home.featuredSubtitle')}</p>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            {t('home.viewCatalog')}
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
          <div>
            <h3 className="font-semibold text-slate-900">{t('home.pickupTitle')}</h3>
            <p className="mt-2 text-sm text-slate-600">{t('home.pickupText')}</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{t('home.deliveryTitle')}</h3>
            <p className="mt-2 text-sm text-slate-600">{t('home.deliveryText')}</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{t('home.stockTitle')}</h3>
            <p className="mt-2 text-sm text-slate-600">{t('home.stockText')}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
