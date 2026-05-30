import { useState, useEffect, useMemo } from 'react'
import api from '../../services/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useDashPage, PageHero, DashKpi, DashCard, DashLoading } from '../../components/dashboard/DashboardUI'
import {
  CHART_KEY_POS, CHART_KEY_NEG, CHART_KEY_NEU,
  niceAxisMax, maxSeriesPeak,
  prepareOverviewChartSeries,
} from '../../utils/chartHelpers'
import { DashboardChartTooltip, SENTIMENT_CHART_COLORS, chartKeyToLabel } from '../../components/dashboard/DashboardCharts'

const OV_COLORS = { posts: '#2563eb', comments: '#8b5cf6' }

const Overview = () => {
  const [stats, setStats] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [chartMode, setChartMode] = useState('volume')
  const { t, lang, isRTL, ts, chartLocale, pageProps } = useDashPage()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard-stats/')
        setStats(res.data)
      } catch (err) {
        console.error('Error fetching stats', err)
      } finally {
        setLoading(false)
      }
    }
    const fetchJobs = async () => {
      try {
        const res = await api.get('/scrape-jobs/')
        const fbJobs = res.data.filter(job => job.platform === 'facebook')
        setJobs(fbJobs.sort((a, b) => new Date(b.started_at || 0) - new Date(a.started_at || 0)).slice(0, 5))
      } catch (err) {
        console.error('Error fetching jobs', err)
      }
    }
    fetchStats()
    fetchJobs()
  }, [])

  const { data: chartData, granularity, sourceDays } = useMemo(
    () => prepareOverviewChartSeries(stats?.timeline ?? [], chartLocale),
    [stats, chartLocale]
  )
  const safeChartData = chartData ?? []

  const timelineRangeLabel = useMemo(() => {
    if (safeChartData.length === 0) return ''
    const first = safeChartData[0].label
    const last = safeChartData[safeChartData.length - 1].label
    if (first === last) return first
    return lang === 'ar' ? `من ${first} إلى ${last}` : `${first} – ${last}`
  }, [safeChartData, lang])

  const chartSubtitle = useMemo(() => {
    if (!safeChartData.length) return ''
    if (granularity === 'week') {
      return lang === 'ar'
        ? `${sourceDays} يوم نشاط · ${safeChartData.length} أسابيع · ${timelineRangeLabel}`
        : `${sourceDays} active days · ${safeChartData.length} weeks · ${timelineRangeLabel}`
    }
    return lang === 'ar'
      ? `${sourceDays} ${sourceDays === 1 ? 'يوم' : 'أيام'} بها بيانات · ${timelineRangeLabel}`
      : `${sourceDays} active ${sourceDays === 1 ? 'day' : 'days'} · ${timelineRangeLabel}`
  }, [safeChartData.length, granularity, sourceDays, timelineRangeLabel, lang])

  const volumeYMax = useMemo(() => {
    const peak = safeChartData.reduce((m, d) => Math.max(m, d.posts || 0, d.comments || 0), 0)
    return niceAxisMax(peak)
  }, [safeChartData])

  const sentimentYMax = useMemo(() => niceAxisMax(maxSeriesPeak(safeChartData)), [safeChartData])

  const tickInterval = safeChartData.length <= 8 ? 0 : Math.ceil(safeChartData.length / 7) - 1
  const chartMargin = {
    top: 16,
    right: isRTL ? 12 : 20,
    left: isRTL ? 20 : 12,
    bottom: safeChartData.length > 8 ? 36 : 12,
  }

  const lineDot = (color) => ({
    r: 4,
    strokeWidth: 2,
    fill: '#fff',
    stroke: color,
  })

  if (loading) {
    return (
      <div {...pageProps}>
        <DashLoading text={t('dbLoading')} />
      </div>
    )
  }

  if (!stats) {
    return (
      <div {...pageProps}>
        <div className="dash-alert dash-alert--error">{t('ovError')}</div>
      </div>
    )
  }

  const volumeName = (key) => (key === 'posts' ? t('ovChartPosts') : t('ovChartComments'))

  return (
    <div {...pageProps}>
      <PageHero
        title={t('dbOverview')}
        subtitle={t('ovDesc')}
        badge={t('ovLastScraped')}
      />

      <div className="dash-kpi-grid">
        {[
          { label: t('ovKpiPosts'), val: stats.total_posts.toLocaleString(), sub: lang === 'ar' ? '+312 هذا الأسبوع' : '+312 this week', icon: '📄', variant: 'blue', delay: 0.05 },
          { label: t('ovKpiComments'), val: stats.total_comments.toLocaleString(), sub: lang === 'ar' ? '+2,104 هذا الأسبوع' : '+2,104 this week', icon: '💬', variant: 'indigo', delay: 0.1 },
          { label: t('ovKpiAccounts'), val: stats.linked_accounts, sub: t('ovKpiActive'), icon: '🔗', variant: 'violet', delay: 0.15 },
          { label: t('ovKpiScrapes'), val: stats.completed_scrapes, sub: t('ovKpiLastMonth'), icon: '✅', variant: 'green', delay: 0.2 },
        ].map((kpi, i) => (
          <DashKpi key={i} variant={kpi.variant} icon={kpi.icon} label={kpi.label} value={kpi.val} sub={kpi.sub} delay={kpi.delay} />
        ))}
      </div>

      <div className="dash-kpi-grid">
        {[
          { label: t('ovSentPositive'), val: `${stats.sentiment_summary.pos_pct}%`, progress: stats.sentiment_summary.pos_pct, variant: 'green' },
          { label: t('ovSentNegative'), val: `${stats.sentiment_summary.neg_pct}%`, progress: stats.sentiment_summary.neg_pct, variant: 'red' },
          { label: t('ovSentNeutral'), val: `${stats.sentiment_summary.neu_pct}%`, progress: stats.sentiment_summary.neu_pct, variant: 'amber' },
        ].map((s, i) => (
          <DashKpi key={i} variant={s.variant} label={s.label} value={s.val} progress={s.progress} delay={0.25 + i * 0.05} />
        ))}
      </div>

      <div className="dash-grid-2">
        <DashCard
          title={t('ovChartTitle')}
          subtitle={chartSubtitle || t('ovChartSubEmpty')}
          action={
            <div className="dash-chart-mode-tabs">
              <button
                type="button"
                className={`dash-chart-mode-tab ${chartMode === 'volume' ? 'active' : ''}`}
                onClick={() => setChartMode('volume')}
              >
                {lang === 'ar' ? 'الحجم' : 'Volume'}
              </button>
              <button
                type="button"
                className={`dash-chart-mode-tab ${chartMode === 'sentiment' ? 'active' : ''}`}
                onClick={() => setChartMode('sentiment')}
              >
                {lang === 'ar' ? 'المشاعر' : 'Sentiment'}
              </button>
            </div>
          }
        >
          <div className="dash-chart-box" style={{ width: '100%', minHeight: 300, height: 300 }}>
            {safeChartData.length === 0 ? (
              <div className="dash-empty">{t('ovChartSubEmpty')}</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                <LineChart data={safeChartData} margin={chartMargin}>
                  <CartesianGrid strokeDasharray="3 6" stroke="var(--border-light)" />
                  <XAxis
                    dataKey="label"
                    type="category"
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={{ stroke: 'var(--border)' }}
                    tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontWeight: 600 }}
                    dy={8}
                    interval={tickInterval}
                    angle={safeChartData.length > 8 ? -28 : 0}
                    textAnchor={safeChartData.length > 8 ? 'end' : 'middle'}
                    height={safeChartData.length > 8 ? 52 : 32}
                  />
                  <YAxis
                    orientation={isRTL ? 'right' : 'left'}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }}
                    width={44}
                    allowDecimals={false}
                    domain={[0, Math.max(chartMode === 'sentiment' ? sentimentYMax : volumeYMax, 1)]}
                    label={{
                      value: chartMode === 'volume'
                        ? (lang === 'ar' ? 'العدد' : 'Count')
                        : (lang === 'ar' ? 'تعليقات' : 'Comments'),
                      angle: -90,
                      position: isRTL ? 'insideRight' : 'insideLeft',
                      style: { fontSize: 10, fill: 'var(--text-tertiary)' },
                    }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => (
                      <DashboardChartTooltip
                        active={active}
                        payload={payload}
                        label={granularity === 'week' && lang === 'ar' ? `أسبوع: ${label}` : granularity === 'week' ? `Week: ${label}` : label}
                        ts={ts}
                        formatSeriesName={chartMode === 'volume' ? volumeName : undefined}
                        showPercent={chartMode === 'sentiment'}
                      />
                    )}
                    cursor={{ stroke: 'var(--border)', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={28}
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '0.75rem' }}
                    formatter={(value) => (chartMode === 'volume' ? volumeName(value) : chartKeyToLabel(value, ts))}
                  />
                  {chartMode === 'volume' ? (
                    <>
                      <Line
                        type="monotone"
                        dataKey="comments"
                        name="comments"
                        stroke={OV_COLORS.comments}
                        strokeWidth={2.5}
                        dot={lineDot(OV_COLORS.comments)}
                        activeDot={{ r: 6, fill: OV_COLORS.comments, stroke: '#fff', strokeWidth: 2 }}
                        animationDuration={800}
                      />
                      <Line
                        type="monotone"
                        dataKey="posts"
                        name="posts"
                        stroke={OV_COLORS.posts}
                        strokeWidth={2.5}
                        dot={lineDot(OV_COLORS.posts)}
                        activeDot={{ r: 6, fill: OV_COLORS.posts, stroke: '#fff', strokeWidth: 2 }}
                        animationDuration={1000}
                      />
                    </>
                  ) : (
                    <>
                      <Line
                        type="monotone"
                        dataKey={CHART_KEY_POS}
                        name={CHART_KEY_POS}
                        stroke={SENTIMENT_CHART_COLORS[CHART_KEY_POS].stroke}
                        strokeWidth={2.5}
                        dot={lineDot(SENTIMENT_CHART_COLORS[CHART_KEY_POS].stroke)}
                        activeDot={{ r: 6, fill: SENTIMENT_CHART_COLORS[CHART_KEY_POS].stroke, stroke: '#fff', strokeWidth: 2 }}
                        animationDuration={800}
                      />
                      <Line
                        type="monotone"
                        dataKey={CHART_KEY_NEU}
                        name={CHART_KEY_NEU}
                        stroke={SENTIMENT_CHART_COLORS[CHART_KEY_NEU].stroke}
                        strokeWidth={2.5}
                        dot={lineDot(SENTIMENT_CHART_COLORS[CHART_KEY_NEU].stroke)}
                        activeDot={{ r: 6, fill: SENTIMENT_CHART_COLORS[CHART_KEY_NEU].stroke, stroke: '#fff', strokeWidth: 2 }}
                        animationDuration={1000}
                      />
                      <Line
                        type="monotone"
                        dataKey={CHART_KEY_NEG}
                        name={CHART_KEY_NEG}
                        stroke={SENTIMENT_CHART_COLORS[CHART_KEY_NEG].stroke}
                        strokeWidth={2.5}
                        dot={lineDot(SENTIMENT_CHART_COLORS[CHART_KEY_NEG].stroke)}
                        activeDot={{ r: 6, fill: SENTIMENT_CHART_COLORS[CHART_KEY_NEG].stroke, stroke: '#fff', strokeWidth: 2 }}
                        animationDuration={1200}
                      />
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </DashCard>

        <DashCard title={t('ovDistTitle')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <svg width="22" height="22" fill="#1877F2" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                  <span style={{ fontWeight: 700 }}>{lang === 'ar' ? 'فيسبوك' : 'Facebook'}</span>
                </div>
                <span className="mono" style={{ fontWeight: 700 }}>{stats.platform_distribution.facebook} {lang === 'ar' ? 'منشور' : 'posts'}</span>
              </div>
              <div className="progress-bar" style={{ height: 8 }}>
                <div className="progress-fill" style={{ width: '100%', background: '#1877F2' }} />
              </div>
            </div>
            <div style={{ padding: 14, background: 'var(--bg)', borderRadius: 12, border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 10px var(--green)' }} />
              <span style={{ fontSize: '.85rem', fontWeight: 700 }}>
                {lang === 'ar' ? 'اتصال مباشر نشط (فيسبوك API)' : 'Live Sync Active (Facebook API)'}
              </span>
            </div>
          </div>
        </DashCard>
      </div>

      <div className="dash-grid-2">
        <DashCard title={t('ovTopicsTitle')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {stats.top_topics.map((t_item, i) => (
              <div key={i} className="dash-list-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="dash-rank">#{i + 1}</span>
                  <span style={{ fontWeight: 600 }}>{t_item.topic}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="mono" style={{ fontSize: '.82rem', color: 'var(--text-secondary)' }}>
                    {t_item.count} {lang === 'ar' ? 'منشور' : 'posts'}
                  </span>
                  <span className={`badge ${t_item.badge}`}>{t_item.sentiment}</span>
                </div>
              </div>
            ))}
          </div>
        </DashCard>

        <DashCard title={t('ovJobsTitle')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {jobs.length === 0 ? (
              <p style={{ color: 'var(--text-tertiary)', fontSize: '.9rem' }}>{t('ovNoJobs')}</p>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="dash-list-item">
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '.9rem' }}>{job.profile_name || 'Facebook'}</span>
                    <p style={{ fontSize: '.78rem', color: 'var(--text-tertiary)', margin: '4px 0 0' }}>
                      {job.started_at ? new Date(job.started_at).toLocaleString(chartLocale) : '—'}
                    </p>
                  </div>
                  <span className={`badge ${job.status === 'completed' ? 'badge-green' : job.status === 'failed' ? 'badge-red' : 'badge-amber'}`}>
                    {job.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </DashCard>
      </div>
    </div>
  )
}

export default Overview
