import type { Locale } from '../i18n/I18nContext'
import { useI18n } from '../i18n/I18nContext'

const options: { code: Locale; label: string }[] = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
]

export function LanguageSwitch() {
  const { locale, setLocale } = useI18n()

  return (
    <div
      className="flex rounded-lg border border-slate-200 p-0.5 text-xs font-semibold"
      role="group"
      aria-label="Language"
    >
      {options.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          className={[
            'min-w-[2.25rem] rounded-md px-2 py-1.5 transition-colors',
            locale === code
              ? 'bg-brand-600 text-white'
              : 'text-slate-600 hover:bg-slate-100',
          ].join(' ')}
          aria-pressed={locale === code}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
