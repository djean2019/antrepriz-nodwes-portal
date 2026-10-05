import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useI18n } from '../i18n/I18nContext'

const MAX_RESULTS = 8

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" />
    </svg>
  )
}

type ProductSearchProps = {
  variant?: 'hero' | 'default'
  showLabel?: boolean
  className?: string
}

export function ProductSearch({
  variant = 'default',
  showLabel = false,
  className = '',
}: ProductSearchProps) {
  const { products } = useApp()
  const { t, productName, productDescription, formatMoney } = useI18n()
  const navigate = useNavigate()
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const trimmed = query.trim()
  const normalized = trimmed.toLowerCase()

  const matches = useMemo(() => {
    if (!normalized) return []
    return products
      .filter((p) => p.active)
      .filter((p) => {
        const name = productName(p).toLowerCase()
        const desc = productDescription(p).toLowerCase()
        return (
          name.includes(normalized) ||
          p.sku.toLowerCase().includes(normalized) ||
          desc.includes(normalized)
        )
      })
      .slice(0, MAX_RESULTS)
  }, [products, normalized, productName, productDescription])

  const showDropdown = open && trimmed.length > 0

  useEffect(() => {
    setActiveIndex(-1)
  }, [normalized])

  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  function goToProduct(id: string) {
    setQuery('')
    setOpen(false)
    setActiveIndex(-1)
    navigate(`/products/${id}`)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown) {
      if (e.key === 'Escape') {
        setOpen(false)
        inputRef.current?.blur()
      }
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i < matches.length - 1 ? i + 1 : i))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i > 0 ? i - 1 : -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && matches[activeIndex]) {
        goToProduct(matches[activeIndex].id)
      } else if (matches[0]) {
        goToProduct(matches[0].id)
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIndex(-1)
    }
  }

  const isHero = variant === 'hero'

  const field = (
    <div ref={rootRef} className="relative min-w-0 flex-1">
      {!showLabel && (
        <label htmlFor={listId} className="sr-only">
          {t('home.search')}
        </label>
      )}
      <SearchIcon
        className={[
          'pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2',
          isHero ? 'text-slate-500' : 'text-slate-400',
        ].join(' ')}
      />
      <input
        ref={inputRef}
        id={listId}
        type="search"
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls={`${listId}-listbox`}
        aria-autocomplete="list"
        aria-activedescendant={
          activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined
        }
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={t('home.searchPlaceholder')}
        autoComplete="off"
        className={[
          'w-full rounded-xl border-0 py-3 pl-11 pr-4 outline-none ring-2 ring-transparent focus:ring-brand-500',
          isHero
            ? 'text-slate-900 shadow-lg'
            : 'border border-slate-200 bg-white text-slate-900 shadow-sm',
        ].join(' ')}
      />

      {showDropdown && (
        <ul
          id={`${listId}-listbox`}
          role="listbox"
          className="absolute z-50 mt-2 max-h-80 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 text-left shadow-xl"
        >
          {matches.length === 0 ? (
            <li className="px-4 py-3 text-sm text-slate-600">{t('catalog.emptyTitle')}</li>
          ) : (
            matches.map((product, index) => (
              <li key={product.id} role="presentation">
                <button
                  id={`${listId}-option-${index}`}
                  type="button"
                  role="option"
                  aria-selected={activeIndex === index}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => goToProduct(product.id)}
                  className={[
                    'flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors',
                    activeIndex === index ? 'bg-brand-50' : 'hover:bg-slate-50',
                  ].join(' ')}
                >
                  <img
                    src={product.imageUrl}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-lg object-cover bg-slate-100"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-900">
                      {productName(product)}
                    </p>
                    <p className="truncate text-xs text-slate-500">{product.sku}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-slate-700">
                    {formatMoney(product.price)}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )

  if (!showLabel) {
    return <div className={className}>{field}</div>
  }

  return (
    <div
      className={[
        'flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4',
        className,
      ].join(' ')}
    >
      <label
        htmlFor={listId}
        className="shrink-0 text-sm font-semibold text-slate-900 sm:text-base"
      >
        {t('home.search')}
      </label>
      {field}
    </div>
  )
}
