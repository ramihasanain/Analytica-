import {
  CHART_KEY_POS,
  CHART_KEY_NEG,
  CHART_KEY_NEU,
} from '../../utils/chartHelpers'
import { SENTIMENT_POSITIVE, SENTIMENT_NEGATIVE, SENTIMENT_NEUTRAL } from '../../utils/i18nHelpers'

export const SENTIMENT_CHART_COLORS = {
  [CHART_KEY_POS]: { stroke: '#10b981', fill: 'url(#gradPos)', light: '#34d399' },
  [CHART_KEY_NEG]: { stroke: '#ef4444', fill: 'url(#gradNeg)', light: '#f87171' },
  [CHART_KEY_NEU]: { stroke: '#f59e0b', fill: 'url(#gradNeu)', light: '#fbbf24' },
}

export const chartKeyToLabel = (key, ts) => {
  const map = {
    [CHART_KEY_POS]: SENTIMENT_POSITIVE,
    [CHART_KEY_NEG]: SENTIMENT_NEGATIVE,
    [CHART_KEY_NEU]: SENTIMENT_NEUTRAL,
    posPct: SENTIMENT_POSITIVE,
    negPct: SENTIMENT_NEGATIVE,
    neuPct: SENTIMENT_NEUTRAL,
    posts: null,
    comments: null,
  }
  const sent = map[key]
  if (sent) return ts(sent)
  if (key === 'posts') return 'Posts'
  if (key === 'comments') return 'Comments'
  return key
}

export const DashboardChartTooltip = ({ active, payload, label, ts, formatSeriesName, showPercent }) => {
  if (!active || !payload?.length) return null
  const total = payload.reduce((s, e) => s + (Number(e.value) || 0), 0)

  const resolveName = (name) => {
    if (typeof formatSeriesName === 'function') return formatSeriesName(name)
    return chartKeyToLabel(name, ts)
  }

  return (
    <div className="dash-chart-tooltip">
      {label && <div className="dash-chart-tooltip-title">{label}</div>}
      {payload.filter((e) => Number(e.value) > 0).map((entry, i) => {
        const val = Number(entry.value)
        const pct = showPercent && total > 0 ? ` (${Math.round((val / total) * 100)}%)` : ''
        return (
          <div key={i} className="dash-chart-tooltip-row">
            <span className="dash-chart-tooltip-dot" style={{ background: entry.color || entry.fill }} />
            <span className="dash-chart-tooltip-name">
              {resolveName(entry.name)}
            </span>
            <span className="dash-chart-tooltip-val mono">
              {showPercent && String(entry.name).endsWith('Pct') ? `${val}%` : val}
              {!String(entry.name).endsWith('Pct') ? pct : ''}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export const SentimentGradients = () => (
  <defs>
    <linearGradient id="gradPos" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#10b981" stopOpacity={0.55} />
      <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
    </linearGradient>
    <linearGradient id="gradNeg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.5} />
      <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05} />
    </linearGradient>
    <linearGradient id="gradNeu" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.45} />
      <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.05} />
    </linearGradient>
    <linearGradient id="barGradPos" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#10b981" />
      <stop offset="100%" stopColor="#34d399" />
    </linearGradient>
    <linearGradient id="barGradNeg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#ef4444" />
      <stop offset="100%" stopColor="#f87171" />
    </linearGradient>
    <linearGradient id="barGradNeu" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#f59e0b" />
      <stop offset="100%" stopColor="#fbbf24" />
    </linearGradient>
  </defs>
)
