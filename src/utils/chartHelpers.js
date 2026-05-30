/** Stable Recharts data keys (not locale-dependent). */
export const CHART_KEY_POS = 'pos'
export const CHART_KEY_NEG = 'neg'
export const CHART_KEY_NEU = 'neu'

const AR_TO_CHART = {
  'إيجابي': CHART_KEY_POS,
  'سلبي': CHART_KEY_NEG,
  'محايد': CHART_KEY_NEU,
}

export function sentimentLabelToChartKey(label) {
  return AR_TO_CHART[label] || CHART_KEY_NEU
}

export function emptySentimentCounts() {
  return { [CHART_KEY_POS]: 0, [CHART_KEY_NEG]: 0, [CHART_KEY_NEU]: 0, total: 0 }
}

/** Round axis max to a readable step (4 ticks). */
export function niceAxisMax(maxVal, tickCount = 4) {
  if (!maxVal || maxVal <= 0) return tickCount
  const rawStep = maxVal / tickCount
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)))
  const normalized = rawStep / magnitude
  let niceStep
  if (normalized <= 1) niceStep = 1
  else if (normalized <= 2) niceStep = 2
  else if (normalized <= 5) niceStep = 5
  else niceStep = 10
  return Math.ceil((niceStep * magnitude * tickCount))
}

export function formatChartDayLabel(dateInput, locale) {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString(locale, { month: 'short', day: 'numeric' })
}

/** Local calendar day (avoid UTC shift from toISOString). */
export function dayKey(dateInput) {
  const d = dateInput instanceof Date ? new Date(dateInput) : new Date(dateInput)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Span of days to chart from comment dates. */
export function resolveTimelineDays(timeRange, items, getDate) {
  if (timeRange === '7d') return 7
  if (timeRange === '30d') return 30
  if (!items?.length) return 14

  const times = items.map(getDate).filter(Boolean).map((d) => new Date(d).getTime()).filter((t) => !Number.isNaN(t))
  if (!times.length) return 14

  const min = Math.min(...times)
  const max = Math.max(...times)
  const spanDays = Math.ceil((max - min) / 86400000) + 1
  return Math.min(Math.max(spanDays, 7), 90)
}

/**
 * Build a continuous daily series (fills missing days with zeros).
 */
export function buildContinuousDailySeries({
  items = [],
  getDate,
  applyItem,
  days = 14,
  endDate = new Date(),
  seedRow = emptySentimentCounts,
}) {
  const end = new Date(endDate)
  end.setHours(0, 0, 0, 0)

  let rangeEnd = end
  let rangeStart = new Date(end)
  rangeStart.setDate(rangeStart.getDate() - (days - 1))

  if (items.length > 0) {
    const times = items.map(getDate).filter(Boolean).map((d) => new Date(d)).filter((d) => !Number.isNaN(d.getTime()))
    if (times.length) {
      const dataMax = new Date(Math.max(...times.map((d) => d.getTime())))
      const dataMin = new Date(Math.min(...times.map((d) => d.getTime())))
      dataMax.setHours(0, 0, 0, 0)
      dataMin.setHours(0, 0, 0, 0)
      if (dataMin < rangeStart) rangeStart = dataMin
      if (dataMax > rangeEnd) rangeEnd = dataMax
    }
  }

  const buckets = new Map()
  const cursor = new Date(rangeStart)
  cursor.setHours(0, 0, 0, 0)
  const last = new Date(rangeEnd)
  last.setHours(0, 0, 0, 0)

  while (cursor <= last) {
    const key = dayKey(cursor)
    buckets.set(key, { dateKey: key, rawDate: new Date(cursor), ...seedRow() })
    cursor.setDate(cursor.getDate() + 1)
  }

  items.forEach((item) => {
    const raw = getDate(item)
    if (!raw) return
    const key = dayKey(raw)
    if (!buckets.has(key)) return
    applyItem(buckets.get(key), item)
  })

  return Array.from(buckets.values()).sort((a, b) => a.rawDate - b.rawDate)
}

export function maxStackTotal(rows, keys = [CHART_KEY_POS, CHART_KEY_NEG, CHART_KEY_NEU]) {
  return rows.reduce((max, row) => {
    const sum = keys.reduce((s, k) => s + (row[k] || 0), 0)
    return Math.max(max, sum)
  }, 0)
}

/** Add percentage fields for 100% stacked bars. */
export function toPercentStack(rows, keys = [CHART_KEY_POS, CHART_KEY_NEG, CHART_KEY_NEU]) {
  return rows.map((row) => {
    const total = keys.reduce((s, k) => s + (row[k] || 0), 0)
    const pct = {}
    keys.forEach((k) => {
      pct[`${k}Pct`] = total > 0 ? Math.round((row[k] / total) * 1000) / 10 : 0
    })
    return { ...row, total, ...pct }
  })
}

export function piePercentLabel(total) {
  return ({ name, value, percent }) =>
    percent >= 0.08 ? `${Math.round(percent * 100)}%` : ''
}
