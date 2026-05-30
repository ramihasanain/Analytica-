import { useLanguage } from '../../LanguageContext'

export const useDashPage = () => {
  const { t, lang, isRTL, ts, topicLabel, formatDate, chartLocale } = useLanguage()
  return {
    t, lang, isRTL, ts, topicLabel, formatDate, chartLocale,
    pageProps: {
      className: 'dash-page',
      style: {
        fontFamily: isRTL ? 'var(--font-ar)' : 'var(--font-en)',
        direction: isRTL ? 'rtl' : 'ltr',
        textAlign: isRTL ? 'right' : 'left',
      },
    },
  }
}

export const PageHero = ({ title, subtitle, badge, actions, children }) => (
  <header className="dash-hero animate-fade-up">
    <div className="dash-hero-mesh" aria-hidden />
    <div className="dash-hero-inner">
      <div>
        {badge && (
          <span className="dash-hero-badge">
            <span className="dash-hero-dot" />
            {badge}
          </span>
        )}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {children}
      </div>
      {actions && <div className="dash-hero-actions">{actions}</div>}
    </div>
  </header>
)

export const DashKpi = ({ variant = 'blue', icon, label, value, sub, progress, delay = 0 }) => (
  <div
    className={`dash-kpi dash-kpi--${variant} animate-fade-up`}
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="dash-kpi-glow" aria-hidden />
    <div className="dash-kpi-head">
      <span className="dash-kpi-label">{label}</span>
      {icon && <span className="dash-kpi-icon">{icon}</span>}
    </div>
    <div className="dash-kpi-value">{value}</div>
    {progress != null && (
      <div className="dash-kpi-bar">
        <div className="dash-kpi-bar-fill" style={{ width: `${Math.min(100, progress)}%` }} />
      </div>
    )}
    {sub && <div className="dash-kpi-sub">{sub}</div>}
  </div>
)

export const DashCard = ({ title, subtitle, action, children, className = '' }) => (
  <div className={`dash-card animate-fade-up ${className}`}>
    {(title || action) && (
      <div className="dash-card-head">
        <div>
          {title && <h3 className="dash-card-title">{title}</h3>}
          {subtitle && <p className="dash-card-sub">{subtitle}</p>}
        </div>
        {action}
      </div>
    )}
    {children}
  </div>
)

export const DashFilters = ({ children }) => (
  <div className="dash-filters animate-fade-up">{children}</div>
)

export const DashLoading = ({ text }) => (
  <div className="dash-loading">
    <div className="dash-spinner" />
    <p>{text}</p>
  </div>
)

export const DashAlert = ({ variant = 'error', children }) => (
  <div className={`dash-alert dash-alert--${variant}`}>{children}</div>
)

export const DashModal = ({ onClose, children, wide }) => (
  <div className="dash-modal-overlay" onClick={onClose} role="presentation">
    <div
      className="dash-modal"
      style={wide ? { maxWidth: 560 } : undefined}
      onClick={e => e.stopPropagation()}
      role="dialog"
    >
      {children}
    </div>
  </div>
)
