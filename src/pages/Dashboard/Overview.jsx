import { useState, useEffect } from 'react'
import api from '../../services/api'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useDashPage, PageHero, DashKpi, DashCard, DashLoading } from '../../components/dashboard/DashboardUI'

const Overview = () => {
  const [stats, setStats] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [chartFilter, setChartFilter] = useState('all')
  const { t, lang, isRTL, pageProps } = useDashPage()

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

  const chartMargin = { top: 10, right: isRTL ? 8 : 0, left: isRTL ? 0 : 8, bottom: 0 }

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
          subtitle={t('ovChartSub')}
          action={
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className={`badge ${chartFilter === 'all' || chartFilter === 'posts' ? 'badge-blue' : 'badge-gray'}`}
                style={{ cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}
                onClick={() => setChartFilter(chartFilter === 'posts' ? 'all' : 'posts')}
              >
                {t('ovChartPosts')}
              </button>
              <button
                type="button"
                className="badge badge-gray"
                style={{ cursor: 'pointer', border: 'none', fontFamily: 'inherit', opacity: chartFilter === 'posts' ? 0.5 : 1 }}
                onClick={() => setChartFilter(chartFilter === 'comments' ? 'all' : 'comments')}
              >
                {t('ovChartComments')}
              </button>
            </div>
          }
        >
          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.timeline} margin={chartMargin}>
                <defs>
                  <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 8" vertical={false} stroke="var(--border-light)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} dy={8} minTickGap={30} />
                <YAxis orientation={isRTL ? 'right' : 'left'} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} width={36} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }} />
                {(chartFilter === 'all' || chartFilter === 'comments') && (
                  <Area type="monotone" dataKey="comments" name={t('ovChartComments')} stroke="#64748b" strokeWidth={2.5} fill="url(#colorComments)" activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} animationDuration={1200} />
                )}
                {(chartFilter === 'all' || chartFilter === 'posts') && (
                  <Area type="monotone" dataKey="posts" name={t('ovChartPosts')} stroke="#2563eb" strokeWidth={2.5} fill="url(#colorPosts)" activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} animationDuration={1400} />
                )}
              </AreaChart>
            </ResponsiveContainer>
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
