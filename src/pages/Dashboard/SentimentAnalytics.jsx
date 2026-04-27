import { useState, useEffect } from 'react'
import api from '../../services/api'

const SentimentAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d')
  const [platformView, setPlatformView] = useState('all')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard-stats/')
        setStats(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>جاري تحليل المشاعر...</div>
  if (!stats) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--red)' }}>حدث خطأ أثناء تحميل البيانات</div>

  const fbPct = Math.round((stats.platform_distribution.facebook / (stats.total_posts || 1)) * 100)
  const xPct = 100 - fbPct

  return (
    <div>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>تحليل المشاعر</h1>
          <p style={{ fontSize: '.92rem' }}>تقرير شامل للتوجهات العاطفية مستخرج من تحليل {stats.total_posts} نصاً عبر الذكاء الاصطناعي</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Platform Filter */}
          <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '3px' }}>
            {[{ key: 'all', label: 'الكل' }, { key: 'fb', label: '📘 FB' }, { key: 'x', label: '𝕏' }].map(t => (
              <button key={t.key} onClick={() => setPlatformView(t.key)} className="btn" style={{ padding: '5px 12px', fontSize: '.8rem', fontWeight: 600, borderRadius: '6px', background: platformView === t.key ? 'var(--text-primary)' : 'transparent', color: platformView === t.key ? '#fff' : 'var(--text-secondary)', border: 'none' }}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Score Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'نصوص محلّلة', val: stats.total_posts.toLocaleString(), icon: '📝', sub: '+2,104 هذا الأسبوع', badge: 'badge-blue' },
          { label: 'درجة الرضا العام', val: '7.4/10', icon: '⭐', sub: '+0.3 عن الشهر الماضي', badge: 'badge-green' },
          { label: 'إيجابي', val: `${stats.sentiment_summary.pos_pct}%`, icon: '😊', sub: `${stats.sentiment_summary.pos_count} نص`, badge: 'badge-green' },
          { label: 'سلبي', val: `${stats.sentiment_summary.neg_pct}%`, icon: '😠', sub: `${stats.sentiment_summary.neg_count} نص`, badge: 'badge-red' },
          { label: 'محايد', val: `${stats.sentiment_summary.neu_pct}%`, icon: '😐', sub: `${stats.sentiment_summary.neu_count} نص`, badge: 'badge-amber' },
        ].map((s, i) => (
          <div key={i} className="card-flat animate-fade-up" style={{ animationDelay: `${i * .06}s` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{s.label}</span>
              <span style={{ fontSize: '1.3rem' }}>{s.icon}</span>
            </div>
            <div className="mono" style={{ fontSize: '1.7rem', fontWeight: 800, marginBottom: '6px' }}>{s.val}</div>
            <span className={`badge ${s.badge}`} style={{ fontSize: '.75rem' }}>{s.sub}</span>
          </div>
        ))}
      </div>

      {/* Main Chart Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Stacked Sentiment Timeline */}
        <div className="card-flat" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>خط المشاعر الزمني</h3>
              <p style={{ fontSize: '.82rem' }}>توزيع المشاعر يومياً — المساحة تمثل الحجم النسبي</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '.78rem', color: 'var(--text-secondary)' }}><span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--green)' }}></span>إيجابي</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '.78rem', color: 'var(--text-secondary)' }}><span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--amber)' }}></span>محايد</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '.78rem', color: 'var(--text-secondary)' }}><span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--red)' }}></span>سلبي</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '3px', height: '220px', alignItems: 'flex-end' }}>
            {stats.timeline.map((d, i) => {
              const total = d.pos + d.neg + d.neu
              const scale = total > 0 ? total / Math.max(...stats.timeline.map(x => x.pos + x.neg + x.neu)) : 0.1
              return (
                <div key={i} title={`${d.date}: إيجابي ${d.pos} سلبي ${d.neg}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', height: `${scale * 100}%`, borderRadius: '3px 3px 0 0', overflow: 'hidden', cursor: 'pointer', transition: 'opacity .15s', opacity: .85 }} onMouseOver={e => e.currentTarget.style.opacity = '1'} onMouseOut={e => e.currentTarget.style.opacity = '.85'}>
                  <div style={{ flex: d.pos, background: 'var(--green)' }}></div>
                  <div style={{ flex: d.neu, background: 'var(--amber)', opacity: .7 }}></div>
                  <div style={{ flex: d.neg, background: 'var(--red)' }}></div>
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ fontSize: '.72rem', color: 'var(--text-tertiary)' }}>{stats.timeline[0]?.date}</span>
            <span style={{ fontSize: '.72rem', color: 'var(--text-tertiary)' }}>{stats.timeline[stats.timeline.length-1]?.date}</span>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="card-flat" style={{ padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '24px', alignSelf: 'flex-start' }}>النسبة الإجمالية</h3>
          <div style={{ position: 'relative', width: '160px', height: '160px', borderRadius: '50%', background: `conic-gradient(var(--green) 0% ${stats.sentiment_summary.pos_pct}%, var(--red) ${stats.sentiment_summary.pos_pct}% ${stats.sentiment_summary.pos_pct + stats.sentiment_summary.neg_pct}%, var(--amber) ${stats.sentiment_summary.pos_pct + stats.sentiment_summary.neg_pct}% 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(0,0,0,.06)' }}>
            <div style={{ width: '115px', height: '115px', background: '#fff', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span className="mono" style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.total_posts}</span>
              <span style={{ fontSize: '.75rem', color: 'var(--text-tertiary)' }}>نص</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
            {[
              { label: '😊', val: `${stats.sentiment_summary.pos_pct}%`, color: 'var(--green)' },
              { label: '😠', val: `${stats.sentiment_summary.neg_pct}%`, color: 'var(--red)' },
              { label: '😐', val: `${stats.sentiment_summary.neu_pct}%`, color: 'var(--amber)' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem' }}>{s.label}</div>
                <div className="mono" style={{ fontWeight: 800, fontSize: '.9rem', color: s.color }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="card-flat" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '20px' }}>مقارنة المنصات</h3>
          {[
            { name: 'فيسبوك', icon: <svg width="18" height="18" fill="#1877F2" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>, pos: stats.sentiment_summary.pos_pct, neg: stats.sentiment_summary.neg_pct, neu: stats.sentiment_summary.neu_pct, total: stats.platform_distribution.facebook.toLocaleString() },
            { name: 'X (تويتر)', icon: <svg width="14" height="14" fill="#000" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 4.15H5.059z"/></svg>, pos: stats.sentiment_summary.pos_pct, neg: stats.sentiment_summary.neg_pct, neu: stats.sentiment_summary.neu_pct, total: stats.platform_distribution.twitter.toLocaleString() },
          ].map((plt, i) => (
            <div key={i} style={{ marginBottom: i === 0 ? '24px' : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {plt.icon}
                  <span style={{ fontWeight: 700, fontSize: '.92rem' }}>{plt.name}</span>
                </div>
                <span className="mono" style={{ fontSize: '.82rem', color: 'var(--text-tertiary)' }}>{plt.total} نص</span>
              </div>
              <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{ width: `${plt.pos}%`, background: 'var(--green)' }}></div>
                <div style={{ width: `${plt.neu}%`, background: 'var(--amber)', opacity: .6 }}></div>
                <div style={{ width: `${plt.neg}%`, background: 'var(--red)' }}></div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ fontSize: '.78rem' }}>😊 <span className="mono" style={{ fontWeight: 700, color: 'var(--green)' }}>{plt.pos}%</span></span>
                <span style={{ fontSize: '.78rem' }}>😐 <span className="mono" style={{ fontWeight: 700, color: 'var(--amber)' }}>{plt.neu}%</span></span>
                <span style={{ fontSize: '.78rem' }}>😠 <span className="mono" style={{ fontWeight: 700, color: 'var(--red)' }}>{plt.neg}%</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Topic Breakdown Table */}
      <div className="card-flat" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>تحليل المشاعر حسب الموضوع</h3>
            <p style={{ fontSize: '.82rem' }}>تفصيل لكل موضوع مع نسب المشاعر وحجم الذكر</p>
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>الموضوع</th>
                <th>عدد مرات الذكر</th>
                <th>المشاعر</th>
                <th>الاتجاه</th>
              </tr>
            </thead>
            <tbody>
              {stats.top_topics.map((t, i) => (
                <tr key={i}>
                  <td className="mono" style={{ color: 'var(--text-tertiary)', fontSize: '.82rem' }}>{i + 1}</td>
                  <td style={{ fontWeight: 700 }}>{t.topic}</td>
                  <td className="mono" style={{ fontWeight: 700 }}>{t.count.toLocaleString()}</td>
                  <td><span className={`mono badge ${t.badge}`} style={{ fontSize: '.8rem' }}>{t.sentiment}</span></td>
                  <td><span style={{ fontSize: '1rem' }}>➡️</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SentimentAnalytics
