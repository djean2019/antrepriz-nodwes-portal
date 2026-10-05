import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { categories } from '../data/mockData'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../i18n/I18nContext'
import type { OrderStatus, Product } from '../types'

const ORDER_STATUSES: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'READY_FOR_PICKUP',
  'OUT_FOR_DELIVERY',
  'COMPLETED',
  'CANCELLED',
]

const emptyDraft = (): Omit<Product, 'id' | 'active'> => ({
  sku: '',
  name: '',
  description: '',
  price: 0,
  categoryId: categories[0]?.id ?? '',
  imageUrl: '',
  onHand: 0,
  lowStockThreshold: 5,
})

export function Admin() {
  const {
    products,
    orders,
    publishProduct,
    archiveProduct,
    setStock,
    updateOrderStatus,
  } = useApp()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { t, formatMoney, productName, stockStatus, categoryName } = useI18n()

  const [draft, setDraft] = useState(emptyDraft)
  const [editingId, setEditingId] = useState<string | null>(null)

  const lowStock = useMemo(
    () =>
      products.filter(
        (p) => p.active && p.onHand > 0 && p.onHand <= p.lowStockThreshold,
      ),
    [products],
  )

  function startEdit(product: Product) {
    setEditingId(product.id)
    setDraft({
      sku: product.sku,
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl,
      onHand: product.onHand,
      lowStockThreshold: product.lowStockThreshold,
    })
  }

  function handlePublish(e: React.FormEvent) {
    e.preventDefault()
    publishProduct({
      ...draft,
      id: editingId ?? undefined,
      price: Number(draft.price),
      onHand: Number(draft.onHand),
      lowStockThreshold: Number(draft.lowStockThreshold),
    })
    setDraft(emptyDraft())
    setEditingId(null)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t('admin.dashboard')}</h1>
          <p className="text-slate-600">{t('admin.dashboardSubtitle')}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            logout()
            navigate('/')
          }}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium"
        >
          {t('auth.logout')}
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">{t('admin.activeProducts')}</p>
          <p className="text-3xl font-bold">{products.filter((p) => p.active).length}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm text-amber-800">{t('admin.lowStock')}</p>
          <p className="text-3xl font-bold text-amber-900">{lowStock.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">{t('admin.recentOrders')}</p>
          <p className="text-3xl font-bold">{orders.length}</p>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">
            {editingId ? t('admin.editProduct') : t('admin.addProduct')}
          </h2>
          <form onSubmit={handlePublish} className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              placeholder={t('admin.sku')}
              required
              value={draft.sku}
              onChange={(e) => setDraft({ ...draft, sku: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 sm:col-span-1"
            />
            <input
              placeholder={t('admin.name')}
              required
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 sm:col-span-1"
            />
            <textarea
              placeholder={t('admin.description')}
              required
              rows={2}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 sm:col-span-2"
            />
            <input
              type="number"
              step="0.01"
              placeholder={t('admin.price')}
              required
              value={draft.price || ''}
              onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
            <select
              value={draft.categoryId}
              onChange={(e) => setDraft({ ...draft, categoryId: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {categoryName(c.id)}
                </option>
              ))}
            </select>
            <input
              placeholder={t('admin.imageUrl')}
              required
              value={draft.imageUrl}
              onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 sm:col-span-2"
            />
            <input
              type="number"
              placeholder={t('admin.stockOnHand')}
              required
              value={draft.onHand || ''}
              onChange={(e) => setDraft({ ...draft, onHand: Number(e.target.value) })}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
            <input
              type="number"
              placeholder={t('admin.lowStockThreshold')}
              required
              value={draft.lowStockThreshold || ''}
              onChange={(e) =>
                setDraft({ ...draft, lowStockThreshold: Number(e.target.value) })
              }
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
            <div className="flex gap-2 sm:col-span-2">
              <button
                type="submit"
                className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700"
              >
                {editingId ? t('admin.save') : t('admin.publish')}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null)
                    setDraft(emptyDraft())
                  }}
                  className="rounded-lg border px-4 py-2"
                >
                  {t('admin.cancel')}
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">{t('admin.inventory')}</h2>
          <ul className="mt-4 max-h-96 space-y-3 overflow-y-auto text-sm">
            {products
              .filter((p) => p.active)
              .map((p) => {
                const stock = stockStatus(p)
                return (
                  <li
                    key={p.id}
                    className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3"
                  >
                    <div>
                      <p className="font-medium">{productName(p)}</p>
                      <p className={stock.tone === 'low' ? 'text-amber-700' : 'text-slate-500'}>
                        {stock.text}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        defaultValue={p.onHand}
                        key={p.onHand}
                        onBlur={(e) => setStock(p.id, Number(e.target.value) || 0)}
                        className="w-20 rounded border border-slate-300 px-2 py-1"
                      />
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        className="text-brand-700 hover:underline"
                      >
                        {t('admin.edit')}
                      </button>
                      <button
                        type="button"
                        onClick={() => archiveProduct(p.id)}
                        className="text-red-600 hover:underline"
                      >
                        {t('admin.archive')}
                      </button>
                    </div>
                  </li>
                )
              })}
          </ul>
        </section>
      </div>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold">{t('admin.orders')}</h2>
        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">{t('admin.noOrders')}</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="py-2 pr-4">{t('admin.reference')}</th>
                  <th className="py-2 pr-4">{t('admin.customer')}</th>
                  <th className="py-2 pr-4">{t('admin.total')}</th>
                  <th className="py-2 pr-4">{t('admin.fulfillment')}</th>
                  <th className="py-2">{t('admin.status')}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-slate-50">
                    <td className="py-3 pr-4 font-medium">{o.reference}</td>
                    <td className="py-3 pr-4">{o.customerName}</td>
                    <td className="py-3 pr-4">{formatMoney(o.total)}</td>
                    <td className="py-3 pr-4 capitalize">
                      {t(`fulfillment.${o.fulfillmentType}`)}
                    </td>
                    <td className="py-3">
                      <select
                        value={o.status}
                        onChange={(e) =>
                          updateOrderStatus(o.id, e.target.value as OrderStatus)
                        }
                        className="rounded border border-slate-300 px-2 py-1 text-xs"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {t(`orderStatus.${s}`)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
