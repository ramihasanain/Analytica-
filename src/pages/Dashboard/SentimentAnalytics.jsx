import { useState, useEffect, useMemo } from 'react'
import api from '../../services/api'
import { useLanguage } from '../../LanguageContext'
import { SENTIMENT_POSITIVE, SENTIMENT_NEGATIVE, SENTIMENT_NEUTRAL, TOPIC_UNSPECIFIED, isGeminiEngine } from '../../utils/i18nHelpers'
import {
  buildContinuousDailySeries,
  emptySentimentCounts,
  sentimentLabelToChartKey,
  formatChartDayLabel,
  niceAxisMax,
  maxStackTotal,
  toPercentStack,
  CHART_KEY_POS,
  CHART_KEY_NEG,
  CHART_KEY_NEU,
} from '../../utils/chartHelpers'
import { DashboardChartTooltip, SentimentGradients, chartKeyToLabel } from '../../components/dashboard/DashboardCharts'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend, Label
} from 'recharts'

const COLORS = {
  pos: '#10b981',
  posLight: '#34d399',
  neg: '#ef4444',
  negLight: '#f87171',
  neu: '#f59e0b',
  neuLight: '#fbbf24',
  blue: '#2563eb',
  indigo: '#6366f1',
  violet: '#8b5cf6',
}

const KpiCard = ({ variant, icon, label, value, sub, progress, delay = 0 }) => (
  <div className={`sent-kpi sent-kpi--${variant} animate-fade-up`} style={{ animationDelay: `${delay}s` }}>
    <div className="sent-kpi-glow" aria-hidden />
    <div className="sent-kpi-top">
      <span className="sent-kpi-label">{label}</span>
      <span className="sent-kpi-icon">{icon}</span>
    </div>
    <div className="sent-kpi-value">{value}</div>
    {progress != null && (
      <div className="sent-kpi-bar">
        <div className="sent-kpi-bar-fill" style={{ width: `${Math.min(100, progress)}%` }} />
      </div>
    )}
    {sub && <div className="sent-kpi-sub">{sub}</div>}
  </div>
)

const ChartPanel = ({ title, subtitle, children, className = '', action }) => (
  <div className={`sent-chart-panel animate-fade-up ${className}`}>
    <div className="sent-chart-head">
      <div>
        <h3 className="sent-chart-title">{title}</h3>
        {subtitle && <p className="sent-chart-sub">{subtitle}</p>}
      </div>
      {action}
    </div>
    <div className="sent-chart-body">{children}</div>
  </div>
)

const SentimentAnalytics = () => {
  const { t, lang, isRTL, ts, topicLabel, chartLocale } = useLanguage()
  const [allData, setAllData] = useState([])
  const [profiles, setProfiles] = useState([])
  const [topics, setTopics] = useState(['الكل'])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [selectedProfile, setSelectedProfile] = useState('all')
  const [selectedTopic, setSelectedTopic] = useState('الكل')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedSentiment, setSelectedSentiment] = useState('all')
  const [timeRange, setTimeRange] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, profilesRes, topicsRes] = await Promise.all([
          api.get('/posts/'),
          api.get('/profiles/'),
          api.get('/posts/topics/')
        ])
        const fbProfiles = profilesRes.data.filter(prof => prof.platform === 'facebook')
        setProfiles(fbProfiles)
        const fbAllData = postsRes.data.filter(p => p.platform === 'facebook')
        const mappedData = fbAllData.map(p => {
          const rawDate = p.posted_at ? new Date(p.posted_at) : new Date()
          return {
            id: p.id,
            profile_id: p.profile,
            platform: p.platform || 'facebook',
            content: p.content,
            raw_date: rawDate,
            sentiment: p.sentiment || SENTIMENT_NEUTRAL,
            score: p.score || 0.5,
            type: p.media_type || 'post',
            parent_post: p.parent_post ?? null,
            topic: p.topic || TOPIC_UNSPECIFIED,
            engine_used: p.engine_used || 'Local Lexicon',
            is_analyzed: p.is_analyzed || false
          }
        })
        setAllData(mappedData)
        setTopics(['الكل', ...topicsRes.data])
      } catch (err) {
        console.error('Error fetching analytics data:', err)
        setError(t('sentLoadError'))
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const timelineDays = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 14

  const postById = useMemo(() => {
    const map = {}
    allData.forEach(item => {
      if (item.type === 'post') map[item.id] = item
    })
    return map
  }, [allData])

  const getPostTopic = (item) => {
    if (item.type === 'post') {
      const t = item.topic?.trim()
      return t || TOPIC_UNSPECIFIED
    }
    if (item.parent_post && postById[item.parent_post]) {
      const t = postById[item.parent_post].topic?.trim()
      return t || TOPIC_UNSPECIFIED
    }
    return TOPIC_UNSPECIFIED
  }

  const filteredData = useMemo(() => allData.filter(item => {
    if (selectedProfile !== 'all' && item.profile_id !== parseInt(selectedProfile)) return false
    if (selectedTopic !== 'الكل' && getPostTopic(item) !== selectedTopic) return false
    if (selectedType !== 'all' && item.type !== selectedType) return false
    if (selectedSentiment !== 'all' && item.sentiment !== selectedSentiment) return false
    if (searchQuery.trim() && !item.content.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (timeRange !== 'all') {
      const now = new Date()
      const diffDays = Math.ceil(Math.abs(now - item.raw_date) / (1000 * 60 * 60 * 24))
      if (timeRange === '7d' && diffDays > 7) return false
      if (timeRange === '30d' && diffDays > 30) return false
    }
    return true
  }), [allData, postById, selectedProfile, selectedTopic, selectedType, selectedSentiment, searchQuery, timeRange])

  const filteredComments = useMemo(() => filteredData.filter(i => i.type === 'comment'), [filteredData])

  const metrics = useMemo(() => {
    const commentTotal = filteredComments.length
    const commentPositive = filteredComments.filter(i => i.sentiment === SENTIMENT_POSITIVE).length
    const commentNegative = filteredComments.filter(i => i.sentiment === SENTIMENT_NEGATIVE).length
    const commentNeutral = filteredComments.filter(i => i.sentiment === SENTIMENT_NEUTRAL).length
    const posPct = commentTotal > 0 ? Math.round((commentPositive / commentTotal) * 100) : 0
    const negPct = commentTotal > 0 ? Math.round((commentNegative / commentTotal) * 100) : 0
    const neuPct = commentTotal > 0 ? Math.round((commentNeutral / commentTotal) * 100) : 0
    const csatScore = commentTotal > 0
      ? (((commentPositive * 10) + (commentNeutral * 5)) / commentTotal).toFixed(1)
      : '0.0'
    const avgConfidence = commentTotal > 0
      ? Math.round((filteredComments.reduce((acc, curr) => acc + curr.score, 0) / commentTotal) * 100)
      : 0
    const postsCount = filteredData.filter(i => i.type === 'post').length
    const commentsCount = commentTotal
    const commentsRatio = postsCount > 0 ? (commentsCount / postsCount).toFixed(1) : '0.0'
    return {
      commentTotal, commentPositive, commentNegative, commentNeutral,
      posPct, negPct, neuPct, csatScore, avgConfidence, postsCount, commentsCount, commentsRatio
    }
  }, [filteredComments, filteredData])

  const pieData = useMemo(() => [
    { name: CHART_KEY_POS, value: metrics.commentPositive, color: COLORS.pos },
    { name: CHART_KEY_NEG, value: metrics.commentNegative, color: COLORS.neg },
    { name: CHART_KEY_NEU, value: metrics.commentNeutral, color: COLORS.neu },
  ].filter(item => item.value > 0), [metrics])

  const timelineData = useMemo(() => {
    const rows = buildContinuousDailySeries({
      items: filteredComments,
      getDate: (item) => item.raw_date,
      days: timelineDays,
      seedRow: emptySentimentCounts,
      applyItem: (row, item) => {
        const k = sentimentLabelToChartKey(item.sentiment)
        row[k] += 1
        row.total += 1
      },
    })
    return rows.map((r) => ({
      ...r,
      date: formatChartDayLabel(r.rawDate, chartLocale),
    }))
  }, [filteredComments, chartLocale, timelineDays])

  const timelineYMax = useMemo(() => niceAxisMax(maxStackTotal(timelineData)), [timelineData])

  const topicChartData = useMemo(() => {
    const groups = {}
    filteredComments.forEach(item => {
      const topicKey = getPostTopic(item)
      if (!groups[topicKey]) {
        groups[topicKey] = {
          topicKey,
          topicLabel: topicLabel(topicKey),
          [CHART_KEY_POS]: 0,
          [CHART_KEY_NEG]: 0,
          [CHART_KEY_NEU]: 0,
          total: 0,
        }
      }
      const k = sentimentLabelToChartKey(item.sentiment)
      groups[topicKey][k] += 1
      groups[topicKey].total += 1
    })

    return toPercentStack(
      Object.values(groups)
        .sort((a, b) => b.total - a.total)
        .slice(0, 5)
    )
  }, [filteredComments, topicLabel, postById])

  const sentimentPills = [
    { key: 'all', label: t('filterAll'), color: COLORS.blue },
    { key: SENTIMENT_POSITIVE, label: ts(SENTIMENT_POSITIVE), color: COLORS.pos },
    { key: SENTIMENT_NEGATIVE, label: ts(SENTIMENT_NEGATIVE), color: COLORS.neg },
    { key: SENTIMENT_NEUTRAL, label: ts(SENTIMENT_NEUTRAL), color: COLORS.neu },
  ]

  const chartMargin = { top: 20, right: isRTL ? 12 : 20, left: isRTL ? 20 : 12, bottom: 8 }

  const topicBarTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    const row = payload[0].payload
    return (
      <DashboardChartTooltip
        active
        payload={[
          { name: CHART_KEY_POS, value: row[CHART_KEY_POS], color: COLORS.pos },
          { name: CHART_KEY_NEG, value: row[CHART_KEY_NEG], color: COLORS.neg },
          { name: CHART_KEY_NEU, value: row[CHART_KEY_NEU], color: COLORS.neu },
        ].filter((p) => p.value > 0)}
        label={`${label} · ${row.total} ${lang === 'ar' ? 'تعليق' : 'comments'}`}
        ts={ts}
        showPercent
      />
    )
  }
  const yOrient = isRTL ? 'right' : 'left'

  if (loading) {
    return (
      <div className="sent-page" style={{ fontFamily: isRTL ? 'var(--font-ar)' : 'var(--font-en)' }}>
        <div className="sent-loading">
          <div className="sent-loading-ring" />
          <p>{t('sentLoading')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="sent-page" style={{ fontFamily: isRTL ? 'var(--font-ar)' : 'var(--font-en)' }}>
        <div className="sent-error">{error}</div>
      </div>
    )
  }

  return (
    <div
      className="sent-page dash-page"
      style={{ fontFamily: isRTL ? 'var(--font-ar)' : 'var(--font-en)', direction: isRTL ? 'rtl' : 'ltr' }}
    >
      {/* Hero */}
      <header className="sent-hero animate-fade-up">
        <div className="sent-hero-mesh" aria-hidden />
        <div className="sent-hero-grid" aria-hidden />
        <div className="sent-hero-inner">
          <div className="sent-hero-text">
            <span className="sent-hero-pill">
              <span className="sent-hero-pulse" />
              {t('sentFilteredFacebookBadge')}
            </span>
            <h1>{t('sentTitle')}</h1>
            <p>{t('sentSubtitle', { count: metrics.commentTotal })}</p>
          </div>
          <div className="sent-hero-actions">
            <div className="sent-time-tabs">
              {[
                { key: 'all', label: t('sentTimeAll') },
                { key: '30d', label: t('sentTime30d') },
                { key: '7d', label: t('sentTime7d') }
              ].map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  className={`sent-time-tab ${timeRange === tab.key ? 'active' : ''}`}
                  onClick={() => setTimeRange(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="sent-sentiment-pills">
              {sentimentPills.map(p => (
                <button
                  key={p.key}
                  type="button"
                  className={`sent-pill ${selectedSentiment === p.key ? 'active' : ''}`}
                  style={{ '--pill-color': p.color }}
                  onClick={() => setSelectedSentiment(p.key)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="sent-filters animate-fade-up" style={{ animationDelay: '.06s' }}>
        {[
          { id: 'profile', label: t('sentFilterPage'), icon: '🏢', el: (
            <select value={selectedProfile} onChange={e => setSelectedProfile(e.target.value)} className="sent-select">
              <option value="all">{t('sentAllPages')}</option>
              {profiles.map(p => <option key={p.id} value={p.id}>{p.account_name}</option>)}
            </select>
          )},
          { id: 'topic', label: t('sentFilterTopic'), icon: '📌', el: (
            <select value={selectedTopic} onChange={e => setSelectedTopic(e.target.value)} className="sent-select">
              {topics.map(topic => (
                <option key={topic} value={topic}>
                  {topic === 'الكل' ? t('topicAll') : topicLabel(topic)}
                </option>
              ))}
            </select>
          )},
          { id: 'type', label: t('sentFilterType'), icon: '📂', el: (
            <select value={selectedType} onChange={e => setSelectedType(e.target.value)} className="sent-select">
              <option value="all">{t('sentTypeAll')}</option>
              <option value="post">{t('sentTypePost')}</option>
              <option value="comment">{t('sentTypeComment')}</option>
            </select>
          )},
          { id: 'search', label: t('sentSearchLabel'), icon: '🔍', el: (
            <input
              type="text"
              className="sent-search"
              placeholder={t('sentSearchPlaceholder')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          )}
        ].map(f => (
          <div key={f.id} className="sent-filter-field">
            <label>{f.icon} {f.label}</label>
            {f.el}
          </div>
        ))}
      </div>

      {/* KPIs */}
      <div className="sent-kpi-grid">
        <KpiCard variant="blue" icon="💬" label={t('sentTotalAnalyzedComments')} value={metrics.commentTotal.toLocaleString()} sub={t('sentFilteredFacebookBadge')} delay={0.08} />
        <KpiCard variant="indigo" icon="⭐" label={t('sentCsatTitle')} value={`${metrics.csatScore}/10`} sub={t('sentCsatBadge')} progress={parseFloat(metrics.csatScore) * 10} delay={0.12} />
        <KpiCard variant="violet" icon="🎯" label={t('sentConfidenceTitle')} value={`${metrics.avgConfidence}%`} sub={t('sentConfidenceBadge')} progress={metrics.avgConfidence} delay={0.16} />
        <KpiCard variant="green" icon="😊" label={t('sentPositiveComments')} value={`${metrics.posPct}%`} sub={t('sentCommentsCount', { count: metrics.commentPositive })} progress={metrics.posPct} delay={0.2} />
        <KpiCard variant="red" icon="😠" label={t('sentNegativeComments')} value={`${metrics.negPct}%`} sub={t('sentCommentsCount', { count: metrics.commentNegative })} progress={metrics.negPct} delay={0.24} />
        <KpiCard
          variant="cyan"
          icon="📊"
          label={t('sentEngagementTitle')}
          value={<><span className="mono">{metrics.commentsRatio}</span><span className="sent-kpi-unit"> {t('sentEngagementUnit')}</span></>}
          sub={t('sentEngagementBase', { posts: metrics.postsCount, comments: metrics.commentsCount })}
          delay={0.28}
        />
      </div>

      {/* Charts row 1 */}
      <div className="sent-charts-row sent-charts-row--main">
        <ChartPanel
          className="sent-chart-wide"
          title={`📈 ${t('sentChartTimeline')}`}
          subtitle={lang === 'ar' ? `${metrics.commentTotal} تعليق في الفترة المحددة` : `${metrics.commentTotal} comments in selected period`}
          action={
            <div className="sent-legend-inline">
              {[SENTIMENT_POSITIVE, SENTIMENT_NEGATIVE, SENTIMENT_NEUTRAL].map((s, i) => (
                <span key={s} className="sent-legend-item">
                  <i style={{ background: [COLORS.pos, COLORS.neg, COLORS.neu][i] }} />
                  {ts(s)}
                </span>
              ))}
            </div>
          }
        >
          <div className="sent-chart-h sent-chart-h--tall">
            {timelineData.length === 0 ? (
              <div className="sent-empty">{t('sentChartTimelineEmpty')}</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%" minHeight={320}>
                <AreaChart data={timelineData} margin={chartMargin}>
                  <SentimentGradients />
                  <CartesianGrid strokeDasharray="4 8" vertical={false} stroke="var(--border-light)" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }}
                    dy={8}
                    minTickGap={20}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    orientation={yOrient}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }}
                    width={40}
                    allowDecimals={false}
                    domain={[0, timelineYMax]}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => (
                      <DashboardChartTooltip active={active} payload={payload} label={label} ts={ts} showPercent />
                    )}
                    cursor={{ stroke: 'var(--border)', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area type="monotone" dataKey={CHART_KEY_POS} stackId="sent" stroke={COLORS.pos} strokeWidth={1.5} fill="url(#gradPos)" animationDuration={900} />
                  <Area type="monotone" dataKey={CHART_KEY_NEU} stackId="sent" stroke={COLORS.neu} strokeWidth={1.5} fill="url(#gradNeu)" animationDuration={1100} />
                  <Area type="monotone" dataKey={CHART_KEY_NEG} stackId="sent" stroke={COLORS.neg} strokeWidth={1.5} fill="url(#gradNeg)" animationDuration={1300} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartPanel>

        <ChartPanel
          title={`🍩 ${t('sentChartPie')}`}
          subtitle={lang === 'ar' ? 'توزيع المشاعر على التعليقات' : 'Comment sentiment split'}
        >
          <div className="sent-donut-wrap">
            {metrics.commentTotal === 0 ? (
              <div className="sent-empty">{t('sentChartPieEmpty')}</div>
            ) : (
              <>
                <div className="sent-donut-chart" style={{ minHeight: 220, height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%" minHeight={220}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius="58%"
                        outerRadius="82%"
                        paddingAngle={3}
                        dataKey="value"
                        animationBegin={200}
                        animationDuration={1200}
                        stroke="var(--bg-card)"
                        strokeWidth={3}
                        label={({ name, percent }) => (percent >= 0.08 ? `${Math.round(percent * 100)}%` : '')}
                        labelLine={false}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => (
                          <DashboardChartTooltip
                            active={active}
                            payload={payload?.map((p) => ({ ...p, name: p.payload.name }))}
                            ts={ts}
                            showPercent
                          />
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="sent-donut-center">
                    <span className="mono sent-donut-num">{metrics.commentTotal}</span>
                    <span>{t('sentChartPieCenter')}</span>
                  </div>
                </div>
                <div className="sent-donut-legend">
                  {[
                    { key: SENTIMENT_POSITIVE, pct: metrics.posPct, color: COLORS.pos },
                    { key: SENTIMENT_NEGATIVE, pct: metrics.negPct, color: COLORS.neg },
                    { key: SENTIMENT_NEUTRAL, pct: metrics.neuPct, color: COLORS.neu },
                  ].map(lg => (
                    <div key={lg.key} className="sent-donut-leg-item">
                      <div className="sent-donut-leg-bar">
                        <div style={{ width: `${lg.pct}%`, background: lg.color }} />
                      </div>
                      <div className="sent-donut-leg-meta">
                        <span><i style={{ background: lg.color }} />{ts(lg.key)}</span>
                        <strong className="mono">{lg.pct}%</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </ChartPanel>
      </div>

      {/* Charts row 2 */}
      <div className="sent-charts-row sent-charts-row--split">
        <ChartPanel
          title={`📊 ${t('sentChartByPost')}`}
          subtitle={t('sentChartByPostSub')}
        >
          <div className="sent-chart-h">
            {topicChartData.length === 0 ? (
              <div className="sent-empty">{t('sentChartByPostEmpty')}</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                <BarChart data={topicChartData} layout="vertical" margin={{ top: 8, right: isRTL ? 8 : 24, left: isRTL ? 24 : 8, bottom: 4 }} barCategoryGap="22%">
                  <SentimentGradients />
                  <CartesianGrid strokeDasharray="4 8" horizontal={false} stroke="var(--border-light)" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    dataKey="topicLabel"
                    type="category"
                    width={isRTL ? 155 : 165}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: 'var(--text-primary)', fontWeight: 600 }}
                  />
                  <Tooltip content={topicBarTooltip} cursor={{ fill: 'rgba(37, 99, 235, 0.06)' }} />
                  <Legend
                    verticalAlign="top"
                    align={isRTL ? 'left' : 'right'}
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '0.75rem', paddingBottom: 8 }}
                    formatter={(value) => {
                      const map = { posPct: CHART_KEY_POS, negPct: CHART_KEY_NEG, neuPct: CHART_KEY_NEU }
                      return chartKeyToLabel(map[value] || value, ts)
                    }}
                  />
                  <Bar dataKey={`${CHART_KEY_POS}Pct`} stackId="topic" fill="url(#barGradPos)" animationDuration={900} />
                  <Bar dataKey={`${CHART_KEY_NEU}Pct`} stackId="topic" fill="url(#barGradNeu)" animationDuration={1100} />
                  <Bar dataKey={`${CHART_KEY_NEG}Pct`} stackId="topic" fill="url(#barGradNeg)" radius={[0, 6, 6, 0]} animationDuration={1300} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartPanel>

        <ChartPanel
          className="sent-explorer-panel"
          title={`🔍 ${t('sentExplorerTitle')}`}
          action={<span className="sent-count-badge">{t('sentExplorerResults', { count: filteredData.length })}</span>}
        >
          <div className="sent-explorer-list">
            {filteredData.length === 0 ? (
              <div className="sent-empty">{t('sentExplorerEmpty')}</div>
            ) : (
              filteredData.slice(0, 10).map((item, idx) => {
                const sentColor = item.sentiment === SENTIMENT_POSITIVE ? COLORS.pos
                  : item.sentiment === SENTIMENT_NEGATIVE ? COLORS.neg : COLORS.neu
                return (
                  <article
                    key={item.id}
                    className="sent-explorer-item animate-fade-up"
                    style={{ animationDelay: `${idx * 0.04}s`, '--accent': sentColor }}
                  >
                    <div className="sent-explorer-accent" />
                    <div className="sent-explorer-content">
                      <p>{item.content}</p>
                      <div className="sent-explorer-meta">
                        <span className="sent-tag sent-tag--type">
                          {item.type === 'post' ? `📄 ${t('sentExplorerPost')}` : `💬 ${t('sentExplorerComment')}`}
                        </span>
                        <span className="sent-tag sent-tag--topic">📌 {topicLabel(getPostTopic(item))}</span>
                        <span className="sent-tag sent-tag--engine">
                          {isGeminiEngine(item.engine_used) ? `✨ ${t('sentExplorerAiUsed')}` : `⚡ ${t('sentExplorerLocalEngine')}`}
                        </span>
                      </div>
                    </div>
                    <div className="sent-explorer-side">
                      <span className="sent-sent-badge" style={{ color: sentColor, borderColor: `${sentColor}40`, background: `${sentColor}14` }}>
                        {ts(item.sentiment)}
                      </span>
                      {!isGeminiEngine(item.engine_used) && (
                        <span className="mono sent-score">{(item.score * 100).toFixed(0)}%</span>
                      )}
                    </div>
                  </article>
                )
              })
            )}
          </div>
        </ChartPanel>
      </div>

      <style>{`
        .sent-page { --sent-radius: 20px; padding-bottom: 40px; }

        .sent-loading {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          min-height: 420px; gap: 20px; color: var(--text-secondary);
        }
        .sent-loading-ring {
          width: 52px; height: 52px; border-radius: 50%;
          border: 3px solid var(--border);
          border-top-color: var(--blue);
          animation: sentSpin .9s linear infinite;
        }
        @keyframes sentSpin { to { transform: rotate(360deg); } }

        .sent-error {
          padding: 24px; background: var(--red-light); color: var(--red);
          border-radius: var(--radius); border: 1px solid rgba(220,38,38,.2);
        }

        /* Hero */
        .sent-hero {
          position: relative; overflow: hidden; border-radius: var(--sent-radius);
          margin-bottom: 24px; padding: 28px 32px;
          background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 42%, #1e40af 100%);
          color: #fff; box-shadow: 0 20px 50px -12px rgba(15, 23, 42, 0.45);
        }
        .sent-hero-mesh {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 10% 20%, rgba(16, 185, 129, 0.35), transparent),
            radial-gradient(ellipse 60% 50% at 90% 80%, rgba(99, 102, 241, 0.4), transparent),
            radial-gradient(ellipse 50% 40% at 70% 10%, rgba(37, 99, 235, 0.3), transparent);
          pointer-events: none;
        }
        .sent-hero-grid {
          position: absolute; inset: 0; opacity: 0.12;
          background-image: linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px);
          background-size: 32px 32px; pointer-events: none;
        }
        .sent-hero-inner {
          position: relative; z-index: 1;
          display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 24px;
        }
        .sent-hero h1 { font-size: 1.75rem; font-weight: 800; color: #fff; margin: 10px 0 8px; letter-spacing: -0.02em; }
        .sent-hero p { color: rgba(255,255,255,.75); font-size: .92rem; max-width: 520px; margin: 0; }
        .sent-hero-pill {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 5px 14px; border-radius: 100px; font-size: .72rem; font-weight: 700;
          background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.2);
          backdrop-filter: blur(8px);
        }
        .sent-hero-pulse {
          width: 7px; height: 7px; border-radius: 50%; background: #34d399;
          box-shadow: 0 0 12px #34d399; animation: sentPulse 2s ease infinite;
        }
        @keyframes sentPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .6; transform: scale(.85); } }

        .sent-hero-actions { display: flex; flex-direction: column; gap: 12px; align-items: flex-end; }
        .sent-time-tabs {
          display: flex; gap: 4px; padding: 4px; border-radius: 12px;
          background: rgba(0,0,0,.25); border: 1px solid rgba(255,255,255,.12);
        }
        .sent-time-tab {
          padding: 8px 16px; border: none; border-radius: 9px; font-size: .8rem; font-weight: 600;
          font-family: inherit; cursor: pointer; color: rgba(255,255,255,.65);
          background: transparent; transition: all .2s;
        }
        .sent-time-tab:hover { color: #fff; background: rgba(255,255,255,.08); }
        .sent-time-tab.active {
          background: #fff; color: #1e40af; box-shadow: 0 4px 14px rgba(0,0,0,.15);
        }
        .sent-sentiment-pills { display: flex; flex-wrap: wrap; gap: 6px; justify-content: flex-end; }
        .sent-pill {
          padding: 6px 12px; border-radius: 100px; font-size: .72rem; font-weight: 700;
          border: 1px solid rgba(255,255,255,.2); background: rgba(0,0,0,.2);
          color: rgba(255,255,255,.8); cursor: pointer; font-family: inherit; transition: all .2s;
        }
        .sent-pill:hover { border-color: rgba(255,255,255,.4); color: #fff; }
        .sent-pill.active {
          background: var(--pill-color); border-color: transparent; color: #fff;
          box-shadow: 0 4px 16px color-mix(in srgb, var(--pill-color) 50%, transparent);
        }

        /* Filters */
        .sent-filters {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px;
          padding: 18px 20px; background: var(--bg-card);
          border: 1px solid var(--border); border-radius: var(--sent-radius);
          box-shadow: var(--shadow-sm);
        }
        @media (max-width: 960px) { .sent-filters { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 520px) { .sent-filters { grid-template-columns: 1fr; } }
        .sent-filter-field label {
          display: block; font-size: .72rem; font-weight: 700; color: var(--text-tertiary);
          margin-bottom: 8px; text-transform: uppercase; letter-spacing: .04em;
        }
        .sent-select, .sent-search {
          width: 100%; padding: 11px 14px; border-radius: 10px;
          border: 1px solid var(--border); background: var(--bg);
          color: var(--text-primary); font-size: .85rem; font-weight: 600;
          font-family: inherit; outline: none; transition: border-color .2s, box-shadow .2s;
        }
        .sent-select:focus, .sent-search:focus {
          border-color: var(--blue); box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }

        /* KPI */
        .sent-kpi-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;
        }
        @media (max-width: 900px) { .sent-kpi-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 520px) { .sent-kpi-grid { grid-template-columns: 1fr; } }

        .sent-kpi {
          position: relative; overflow: hidden; padding: 22px 22px 18px;
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--sent-radius); transition: transform .25s, box-shadow .25s;
        }
        .sent-kpi:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
        .sent-kpi-glow {
          position: absolute; top: -40px; width: 120px; height: 120px; border-radius: 50%;
          opacity: .35; filter: blur(40px); pointer-events: none;
        }
        .sent-kpi--blue .sent-kpi-glow { right: -20px; background: ${COLORS.blue}; }
        .sent-kpi--indigo .sent-kpi-glow { right: -20px; background: ${COLORS.indigo}; }
        .sent-kpi--violet .sent-kpi-glow { right: -20px; background: ${COLORS.violet}; }
        .sent-kpi--green .sent-kpi-glow { right: -20px; background: ${COLORS.pos}; }
        .sent-kpi--red .sent-kpi-glow { right: -20px; background: ${COLORS.neg}; }
        .sent-kpi--cyan .sent-kpi-glow { right: -20px; background: #06b6d4; }
        .sent-kpi--blue { border-top: 3px solid ${COLORS.blue}; }
        .sent-kpi--indigo { border-top: 3px solid ${COLORS.indigo}; }
        .sent-kpi--violet { border-top: 3px solid ${COLORS.violet}; }
        .sent-kpi--green { border-top: 3px solid ${COLORS.pos}; }
        .sent-kpi--red { border-top: 3px solid ${COLORS.neg}; }
        .sent-kpi--cyan { border-top: 3px solid #06b6d4; }

        .sent-kpi-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
        .sent-kpi-label { font-size: .8rem; font-weight: 700; color: var(--text-secondary); max-width: 70%; line-height: 1.4; }
        .sent-kpi-icon { font-size: 1.35rem; opacity: .9; }
        .sent-kpi-value { font-size: 2rem; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 10px; color: var(--text-primary); }
        .sent-kpi-bar { height: 4px; border-radius: 4px; background: var(--bg-elevated); overflow: hidden; margin-bottom: 10px; }
        .sent-kpi-bar-fill { height: 100%; border-radius: 4px; background: linear-gradient(90deg, var(--blue), #8b5cf6); transition: width .8s cubic-bezier(.22,1,.36,1); }
        .sent-kpi--green .sent-kpi-bar-fill { background: linear-gradient(90deg, ${COLORS.pos}, ${COLORS.posLight}); }
        .sent-kpi--red .sent-kpi-bar-fill { background: linear-gradient(90deg, ${COLORS.neg}, ${COLORS.negLight}); }
        .sent-kpi--indigo .sent-kpi-bar-fill { background: linear-gradient(90deg, ${COLORS.indigo}, ${COLORS.violet}); }
        .sent-kpi--violet .sent-kpi-bar-fill { background: linear-gradient(90deg, ${COLORS.violet}, #a78bfa); }
        .sent-kpi-sub { font-size: .72rem; color: var(--text-tertiary); line-height: 1.5; }
        .sent-kpi-unit { font-weight: 600; color: var(--text-secondary); }

        /* Chart panels */
        .sent-charts-row { display: grid; gap: 20px; margin-bottom: 20px; }
        .sent-charts-row--main { grid-template-columns: 1.65fr 1fr; }
        .sent-charts-row--split { grid-template-columns: 1fr 1.35fr; }
        @media (max-width: 1024px) {
          .sent-charts-row--main, .sent-charts-row--split { grid-template-columns: 1fr; }
        }

        .sent-chart-panel {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--sent-radius); padding: 24px 26px;
          box-shadow: var(--shadow-sm);
        }
        .sent-chart-head {
          display: flex; justify-content: space-between; align-items: flex-start;
          gap: 16px; margin-bottom: 20px; flex-wrap: wrap;
        }
        .sent-chart-title { font-size: 1.05rem; font-weight: 800; margin: 0 0 4px; letter-spacing: -0.01em; }
        .sent-chart-sub { font-size: .8rem; color: var(--text-tertiary); margin: 0; }
        .sent-chart-h { height: 300px; width: 100%; }
        .sent-chart-h--tall { height: 320px; }

        .sent-legend-inline { display: flex; flex-wrap: wrap; gap: 12px; }
        .sent-legend-item {
          display: flex; align-items: center; gap: 6px; font-size: .75rem;
          font-weight: 600; color: var(--text-secondary);
        }
        .sent-legend-item i { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }

        .sent-tooltip {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 12px; padding: 12px 14px; box-shadow: var(--shadow-lg);
          min-width: 140px;
        }
        .sent-tooltip-label { font-size: .75rem; color: var(--text-tertiary); margin-bottom: 8px; font-weight: 600; }
        .sent-tooltip-rows { display: flex; flex-direction: column; gap: 6px; }
        .sent-tooltip-row { display: flex; align-items: center; gap: 8px; font-size: .82rem; }
        .sent-tooltip-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .sent-tooltip-name { flex: 1; color: var(--text-secondary); font-weight: 600; }
        .sent-tooltip-val { font-weight: 800; color: var(--text-primary); }

        .sent-empty {
          height: 100%; min-height: 200px; display: flex; align-items: center; justify-content: center;
          color: var(--text-tertiary); font-size: .88rem; text-align: center; padding: 24px;
          background: var(--bg); border-radius: 12px; border: 1px dashed var(--border);
        }

        /* Donut */
        .sent-donut-wrap { display: flex; flex-direction: column; align-items: center; gap: 20px; }
        .sent-donut-chart { position: relative; width: 100%; max-width: 220px; height: 220px; }
        .sent-donut-center {
          position: absolute; inset: 0; display: flex; flex-direction: column;
          align-items: center; justify-content: center; pointer-events: none;
        }
        .sent-donut-num { font-size: 2rem; font-weight: 800; line-height: 1; color: var(--text-primary); }
        .sent-donut-center span:last-child { font-size: .72rem; color: var(--text-tertiary); margin-top: 4px; font-weight: 600; }
        .sent-donut-legend { width: 100%; display: flex; flex-direction: column; gap: 12px; }
        .sent-donut-leg-bar { height: 5px; border-radius: 5px; background: var(--bg-elevated); overflow: hidden; margin-bottom: 6px; }
        .sent-donut-leg-bar div { height: 100%; border-radius: 5px; transition: width .9s cubic-bezier(.22,1,.36,1); }
        .sent-donut-leg-meta { display: flex; justify-content: space-between; align-items: center; font-size: .8rem; }
        .sent-donut-leg-meta span { display: flex; align-items: center; gap: 8px; color: var(--text-secondary); font-weight: 600; }
        .sent-donut-leg-meta i { width: 10px; height: 10px; border-radius: 3px; display: inline-block; }
        .sent-donut-leg-meta strong { color: var(--text-primary); }

        /* Explorer */
        .sent-explorer-panel .sent-chart-body { padding: 0; }
        .sent-count-badge {
          font-size: .72rem; font-weight: 700; padding: 6px 12px; border-radius: 100px;
          background: var(--bg-elevated); color: var(--text-secondary); border: 1px solid var(--border);
        }
        .sent-explorer-list {
          display: flex; flex-direction: column; gap: 10px;
          max-height: 340px; overflow-y: auto; padding-inline-end: 4px;
        }
        .sent-explorer-list::-webkit-scrollbar { width: 5px; }
        .sent-explorer-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

        .sent-explorer-item {
          position: relative; display: flex; gap: 14px; padding: 14px 16px 14px 18px;
          background: var(--bg); border: 1px solid var(--border-light);
          border-radius: 14px; transition: border-color .2s, box-shadow .2s, transform .2s;
        }
        .sent-explorer-item:hover {
          border-color: color-mix(in srgb, var(--accent) 40%, var(--border));
          box-shadow: 0 8px 24px rgba(0,0,0,.04); transform: translateX(${isRTL ? '-2px' : '2px'});
        }
        .sent-explorer-accent {
          position: absolute; top: 12px; bottom: 12px; width: 3px; border-radius: 3px;
          background: var(--accent); ${isRTL ? 'right: 8px;' : 'left: 8px;'}
        }
        .sent-explorer-content { flex: 1; min-width: 0; padding-${isRTL ? 'right' : 'left'}: 8px; }
        .sent-explorer-content p {
          margin: 0 0 10px; font-size: .86rem; line-height: 1.65; font-weight: 500;
          color: var(--text-primary);
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .sent-explorer-meta { display: flex; flex-wrap: wrap; gap: 6px; }
        .sent-tag {
          font-size: .65rem; font-weight: 700; padding: 3px 8px; border-radius: 6px;
        }
        .sent-tag--type { background: var(--bg-elevated); color: var(--text-secondary); }
        .sent-tag--topic { background: var(--blue-soft); color: var(--blue); }
        .sent-tag--engine { color: var(--text-tertiary); }
        .sent-explorer-side { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
        .sent-sent-badge {
          font-size: .75rem; font-weight: 800; padding: 5px 10px; border-radius: 8px; border: 1px solid;
        }
        .sent-score { font-size: .72rem; color: var(--text-tertiary); }
      `}</style>
    </div>
  )
}

export default SentimentAnalytics
