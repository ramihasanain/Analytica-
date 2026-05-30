import { useState, useEffect, useMemo } from 'react'
import api from '../../services/api'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useDashPage, PageHero, DashKpi, DashCard, DashLoading } from '../../components/dashboard/DashboardUI'
import {
  CHART_KEY_POS, CHART_KEY_NEG, CHART_KEY_NEU,
  formatChartDayLabel, niceAxisMax, maxStackTotal,
} from '../../utils/chartHelpers'
import { DashboardChartTooltip, SentimentGradients, SENTIMENT_CHART_COLORS, chartKeyToLabel } from '../../components/dashboard/DashboardCharts'

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

  const timelineChart = useMemo(() => (
    stats?.timeline?.map((row) => ({
      ...row,
      label: formatChartDayLabel(row.date, chartLocale),
    })) ?? []
  ), [stats, chartLocale])

  const timelineRangeLabel = useMemo(() => {
    if (timelineChart.length === 0) return ''
    const first = timelineChart[0].label
    const last = timelineChart[timelineChart.length - 1].label
    if (first === last) return first
    return lang === 'ar' ? `من ${first} إلى ${last}` : `${first} – ${last}`
  }, [timelineChart, lang])

  const volumeYMax = useMemo(() => {
    const peak = timelineChart.reduce((m, d) => Math.max(m, d.posts, d.comments), 0)
    return niceAxisMax(peak)
  }, [timelineChart])

  const sentimentYMax = useMemo(() => niceAxisMax(maxStackTotal(timelineChart)), [timelineChart])

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

  const chartMargin = { top: 16, right: isRTL ? 12 : 16, left: isRTL ? 16 : 12, bottom: 8 }
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
          subtitle={
            timelineRangeLabel
              ? (lang === 'ar' ? `منشورات + تعليقات · ${timelineRangeLabel}` : `Posts + comments · ${timelineRangeLabel}`)
              : t('ovChartSubEmpty')
          }
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
          <div className="dash-chart-box" style={{ width: '100%', minHeight: 280, height: 280 }}>
            {timelineChart.length === 0 ? (
              <div className="dash-empty">{t('ovChartSubEmpty')}</div>
            ) : (
            <ResponsiveContainer width="100%" height="100%" minHeight={280}>
              <AreaChart data={timelineChart} margin={chartMargin}>
                {chartMode === 'sentiment' ? <SentimentGradients /> : (
                  <defs>
                    <linearGradient id="ovPosts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0.03} />
                    </linearGradient>
                    <linearGradient id="ovComments" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                )}
                <CartesianGrid strokeDasharray="3 6" stroke="var(--border-light)" />
                <XAxis
                  dataKey="label"
                  axisLine={{ stroke: 'var(--border)' }}
                  tickLine={{ stroke: 'var(--border)' }}
                  tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontWeight: 600 }}
                  dy={8}
                  minTickGap={12}
                  interval={timelineChart.length <= 12 ? 0 : 'preserveStartEnd'}
                />
                <YAxis
                  orientation={isRTL ? 'right' : 'left'}
                  axisLine={{ stroke: 'var(--border)' }}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }}
                  width={40}
                  allowDecimals={false}
                  domain={[0, Math.max(chartMode === 'sentiment' ? sentimentYMax : volumeYMax, 1)]}
                />
                <Tooltip
                  content={({ active, payload, label }) => (
                    <DashboardChartTooltip
                      active={active}
                      payload={payload}
                      label={label}
                      ts={ts}
                      formatSeriesName={chartMode === 'volume' ? volumeName : undefined}
                      showPercent={chartMode === 'sentiment'}
                    />
                  )}
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
                    <Area
                      type="monotone"
                      dataKey="comments"
                      name="comments"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      fill="url(#ovComments)"
                      activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
                      animationDuration={1000}
                    />
                    <Area
                      type="monotone"
                      dataKey="posts"
                      name="posts"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      fill="url(#ovPosts)"
                      activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
                      animationDuration={1200}
                    />
                  </>
                ) : (
                  <>
                    <Area type="monotone" dataKey={CHART_KEY_POS} stackId="sent" stroke={SENTIMENT_CHART_COLORS[CHART_KEY_POS].stroke} strokeWidth={1.5} fill="url(#gradPos)" animationDuration={900} />
                    <Area type="monotone" dataKey={CHART_KEY_NEU} stackId="sent" stroke={SENTIMENT_CHART_COLORS[CHART_KEY_NEU].stroke} strokeWidth={1.5} fill="url(#gradNeu)" animationDuration={1100} />
                    <Area type="monotone" dataKey={CHART_KEY_NEG} stackId="sent" stroke={SENTIMENT_CHART_COLORS[CHART_KEY_NEG].stroke} strokeWidth={1.5} fill="url(#gradNeg)" animationDuration={1300} />
                  </>
                )}
              </AreaChart>
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
                    {t_item.count.toLocaleString()} {t('ovTopicsMentions')}
                  </span>
                  <span className={`badge ${t_item.badge}`}>
                    {lang === 'en'
                      ? (t_item.sentiment === 'سلبي' ? 'Negative' : t_item.sentiment === 'إيجابي' ? 'Positive' : 'Neutral')
                      : t_item.sentiment}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DashCard>

        <DashCard title={t('ovScrapesTitle')}>
          <div className="dash-table-wrap">
            <table className="data-table" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
              <thead>
                <tr>
                  <th>{t('ovScrapesPlatform')}</th>
                  <th>{t('ovScrapesStatus')}</th>
                  <th>{t('ovScrapesCount')}</th>
                  <th>{t('ovScrapesDate')}</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 700 }}>{lang === 'ar' ? 'فيسبوك' : 'Facebook'}</td>
                    <td><span className="badge badge-green">{job.status === 'completed' ? t('ovScrapesCompleted') : job.status}</span></td>
                    <td className="mono">{job.records_fetched}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {job.started_at ? new Date(job.started_at).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US') : 'N/A'}
                    </td>
                  </tr>
                ))}
                {jobs.length === 0 && (
                  <tr><td colSpan={4} className="dash-empty">{t('ovScrapesEmpty')}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </DashCard>
      </div>
    </div>
  )
}

export default Overview
