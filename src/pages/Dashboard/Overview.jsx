import { useState, useEffect } from 'react'
import api from '../../services/api'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useLanguage } from '../../LanguageContext'

const Overview = () => {
  const [stats, setStats] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [chartFilter, setChartFilter] = useState('all') // 'all', 'posts', 'comments'
  const { t, lang, isRTL } = useLanguage()

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

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', fontFamily: isRTL ? 'var(--font-ar)' : 'var(--font-en)' }}>{t('dbLoading')}</div>
  if (!stats) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--red)', fontFamily: isRTL ? 'var(--font-ar)' : 'var(--font-en)' }}>{t('ovError')}</div>

  return (
    <div style={{ fontFamily: isRTL ? 'var(--font-ar)' : 'var(--font-en)', direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>{t('dbOverview')}</h1>
          <p style={{ fontSize: '.92rem', color: 'var(--text-secondary)' }}>{t('ovDesc')}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="badge badge-green" style={{ padding: '6px 14px', fontSize: '.85rem', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green)', display: 'inline-block', marginInlineEnd: isRTL ? '6px' : '0', marginInlineStart: !isRTL ? '6px' : '0' }}></span>
            {t('ovLastScraped')}
          </span>
        </div>
      </div>

      {/* KPI Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
        {[
          { label: t('ovKpiPosts'), val: stats.total_posts.toLocaleString(), change: lang === 'ar' ? '+312 هذا الأسبوع' : '+312 this week', up: true, icon: '📄' },
          { label: t('ovKpiComments'), val: stats.total_comments.toLocaleString(), change: lang === 'ar' ? '+2,104 هذا الأسبوع' : '+2,104 this week', up: true, icon: '💬' },
          { label: t('ovKpiAccounts'), val: stats.linked_accounts, change: t('ovKpiActive'), up: null, icon: '🔗' },
          { label: t('ovKpiScrapes'), val: stats.completed_scrapes, change: t('ovKpiLastMonth'), up: null, icon: '✅' },
        ].map((kpi, i) => (
          <div key={i} className="card-flat animate-fade-up" style={{ animationDelay: `${i * .08}s`, textAlign: isRTL ? 'right' : 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
              <span style={{ fontSize: '.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{kpi.label}</span>
              <span style={{ fontSize: '1.4rem' }}>{kpi.icon}</span>
            </div>
            <div className="mono" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>{kpi.val}</div>
            <span className={`badge ${kpi.up === true ? 'badge-green' : kpi.up === false ? 'badge-red' : 'badge-gray'}`}>
              {kpi.change}
            </span>
          </div>
        ))}
      </div>

      {/* KPI Row 2 - Sentiment Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: t('ovSentPositive'), val: `${stats.sentiment_summary.pos_pct}%`, color: 'var(--green)', bg: 'var(--green-light)', width: `${stats.sentiment_summary.pos_pct}%` },
          { label: t('ovSentNegative'), val: `${stats.sentiment_summary.neg_pct}%`, color: 'var(--red)', bg: 'var(--red-light)', width: `${stats.sentiment_summary.neg_pct}%` },
          { label: t('ovSentNeutral'), val: `${stats.sentiment_summary.neu_pct}%`, color: 'var(--amber)', bg: 'var(--amber-light)', width: `${stats.sentiment_summary.neu_pct}%` },
        ].map((s, i) => (
          <div key={i} className="card-flat animate-fade-up" style={{ animationDelay: `${(i + 4) * .08}s` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
              <span style={{ fontSize: '.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{s.label}</span>
              <span className="mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: s.color }}>{s.val}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: s.width, background: s.color }}></div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Timeline Chart */}
        <div className="card-flat" style={{ padding: '28px', flex: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>{t('ovChartTitle')}</h3>
              <p style={{ fontSize: '.82rem', color: 'var(--text-secondary)' }}>{t('ovChartSub')}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span 
                className={`badge ${chartFilter === 'all' || chartFilter === 'posts' ? 'badge-blue' : 'badge-gray'}`} 
                style={{ fontSize: '.75rem', cursor: 'pointer', opacity: chartFilter === 'comments' ? 0.5 : 1 }}
                onClick={() => setChartFilter(chartFilter === 'posts' ? 'all' : 'posts')}
              >
                {t('ovChartPosts')}
              </span>
              <span 
                className={`badge ${chartFilter === 'all' || chartFilter === 'comments' ? 'badge-gray' : 'badge-gray'}`} 
                style={{ fontSize: '.75rem', cursor: 'pointer', opacity: chartFilter === 'posts' ? 0.5 : 1, background: chartFilter !== 'posts' ? 'var(--bg-elevated)' : '' }}
                onClick={() => setChartFilter(chartFilter === 'comments' ? 'all' : 'comments')}
              >
                {t('ovChartComments')}
              </span>
            </div>
          </div>
          <div style={{ height: '240px', width: '100%', marginTop: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.timeline} margin={{ top: 10, right: isRTL ? -20 : 0, left: isRTL ? 0 : -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--blue)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--blue)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} dy={10} minTickGap={30} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} orientation={isRTL ? 'right' : 'left'} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', textAlign: isRTL ? 'right' : 'left' }}
                  labelStyle={{ color: 'var(--text-secondary)', marginBottom: '4px', fontSize: '0.85rem' }}
                  itemStyle={{ fontSize: '0.9rem', fontWeight: 600 }}
                />
                {(chartFilter === 'all' || chartFilter === 'comments') && (
                  <Area type="monotone" dataKey="comments" name={t('ovChartComments')} stroke="#94a3b8" strokeWidth={3} fillOpacity={1} fill="url(#colorComments)" activeDot={{ r: 6 }} />
                )}
                {(chartFilter === 'all' || chartFilter === 'posts') && (
                  <Area type="monotone" dataKey="posts" name={t('ovChartPosts')} stroke="var(--blue)" strokeWidth={3} fillOpacity={1} fill="url(#colorPosts)" activeDot={{ r: 6 }} />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="card-flat" style={{ padding: '28px', flex: 1 }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '24px' }}>{t('ovDistTitle')}</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { name: lang === 'ar' ? 'فيسبوك' : 'Facebook', posts: stats.platform_distribution.facebook, pct: '100%', color: '#1877F2', icon: <svg width="20" height="20" fill="#1877F2" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg> },
            ].map((p, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
                    {p.icon}
                    <span style={{ fontWeight: 700, fontSize: '.92rem' }}>{p.name}</span>
                  </div>
                  <span className="mono" style={{ fontWeight: 700, fontSize: '.9rem' }}>{p.posts} {lang === 'ar' ? 'منشور' : 'posts'}</span>
                </div>
                <div className="progress-bar" style={{ height: '8px' }}>
                  <div className="progress-fill" style={{ width: p.pct, background: p.color }}></div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '28px', padding: '16px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '10px', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 8px var(--green)', display: 'inline-block' }}></span>
            <div style={{ fontSize: '.85rem', fontWeight: 700 }}>
              {lang === 'ar' ? 'اتصال مباشر نشط (فيسبوك API)' : 'Live Sync Active (Facebook API)'}
            </div>
          </div>
        </div>

      </div>

      {/* Top Topics & Scrapes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Top Topics */}
        <div className="card-flat" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '20px' }}>{t('ovTopicsTitle')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats.top_topics.map((t_item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
                  <span className="mono" style={{ fontSize: '.78rem', color: 'var(--text-tertiary)', width: '20px' }}>#{i + 1}</span>
                  <span style={{ fontWeight: 600, fontSize: '.92rem' }}>{t_item.topic}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
                  <span className="mono" style={{ fontSize: '.82rem', color: 'var(--text-secondary)' }}>{t_item.count.toLocaleString()} {t('ovTopicsMentions')}</span>
                  <span className={`badge ${t_item.badge}`}>{lang === 'en' ? (t_item.sentiment === 'سلبي' ? 'Negative' : t_item.sentiment === 'إيجابي' ? 'Positive' : 'Neutral') : t_item.sentiment}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Scrape Jobs */}
        <div className="card-flat" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '20px' }}>{t('ovScrapesTitle')}</h3>
          <div className="table-wrap">
            <table className="data-table" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
              <thead>
                <tr style={{ flexDirection: isRTL ? 'row' : 'row-reverse' }}>
                  <th style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('ovScrapesPlatform')}</th>
                  <th style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('ovScrapesStatus')}</th>
                  <th style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('ovScrapesCount')}</th>
                  <th style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('ovScrapesDate')}</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 700 }}>{lang === 'ar' ? 'فيسبوك' : 'Facebook'}</td>
                    <td><span className={`badge badge-green`}>{job.status === 'completed' ? t('ovScrapesCompleted') : job.status}</span></td>
                    <td className="mono">{job.records_fetched}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{job.started_at ? new Date(job.started_at).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US') : 'N/A'}</td>
                  </tr>
                ))}
                {jobs.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-tertiary)' }}>{t('ovScrapesEmpty')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview
