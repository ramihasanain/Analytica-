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

/** Daily series from first to last item date only (no padding to today or filter window). */
export function buildDataBoundedDailySeries({
  items = [],
  getDate,
  applyItem,
  seedRow = emptySentimentCounts,
}) {
  if (!items?.length) return []

  const times = items
    .map(getDate)
    .filter(Boolean)
    .map((d) => new Date(d))
    .filter((d) => !Number.isNaN(d.getTime()))

  if (!times.length) return []

  const dataMax = new Date(Math.max(...times.map((d) => d.getTime())))
  const dataMin = new Date(Math.min(...times.map((d) => d.getTime())))
  dataMax.setHours(0, 0, 0, 0)
  dataMin.setHours(0, 0, 0, 0)

  const buckets = new Map()
  const cursor = new Date(dataMin)
  while (cursor <= dataMax) {
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

export function maxSeriesPeak(rows, keys = [CHART_KEY_POS, CHART_KEY_NEG, CHART_KEY_NEU]) {
  return rows.reduce((max, row) => {
    const peak = keys.reduce((m, k) => Math.max(m, row[k] || 0), 0)
    return Math.max(max, peak)
  }, 0)
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

export function filterActiveTimelineRows(rows) {
  return rows.filter((r) => {
    const volume = (r.posts || 0) + (r.comments || 0)
    const sentiment = (r.pos || 0) + (r.neg || 0) + (r.neu || 0)
    return volume > 0 || sentiment > 0
  })
}

export function aggregateTimelineByWeek(rows, locale) {
  const buckets = new Map()
  rows.forEach((row) => {
    const d = new Date(row.date)
    if (Number.isNaN(d.getTime())) return
    const weekStart = new Date(d)
    weekStart.setHours(0, 0, 0, 0)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    const key = dayKey(weekStart)
    if (!buckets.has(key)) {
      buckets.set(key, {
        date: key,
        weekStart: new Date(weekStart),
        posts: 0,
        comments: 0,
        pos: 0,
        neg: 0,
        neu: 0,
      })
    }
    const b = buckets.get(key)
    b.posts += row.posts || 0
    b.comments += row.comments || 0
    b.pos += row.pos || 0
    b.neg += row.neg || 0
    b.neu += row.neu || 0
  })
  return Array.from(buckets.values())
    .sort((a, b) => a.weekStart - b.weekStart)
    .map((b) => {
      const weekEnd = new Date(b.weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)
      const startLbl = formatChartDayLabel(b.weekStart, locale)
      const endLbl = formatChartDayLabel(weekEnd, locale)
      return {
        date: b.date,
        posts: b.posts,
        comments: b.comments,
        pos: b.pos,
        neg: b.neg,
        neu: b.neu,
        label: startLbl === endLbl ? startLbl : `${startLbl} – ${endLbl}`,
      }
    })
}

/** Active days only; weekly buckets when many points. */
export function prepareOverviewChartSeries(rows, locale, { weekThreshold = 24 } = {}) {
  const active = filterActiveTimelineRows(rows)
  if (active.length === 0) {
    return { data: [], granularity: 'day', sourceDays: 0 }
  }
  const withLabels = active.map((row) => ({
    ...row,
    label: row.label || formatChartDayLabel(row.date, locale),
  }))
  if (withLabels.length > weekThreshold) {
    const weekly = aggregateTimelineByWeek(withLabels, locale)
    return { data: weekly, granularity: 'week', sourceDays: withLabels.length }
  }
  return { data: withLabels, granularity: 'day', sourceDays: withLabels.length }
}
