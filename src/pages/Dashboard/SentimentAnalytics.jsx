import { useState } from 'react'

const timelineData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  pos: Math.floor(40 + Math.random() * 30),
  neg: Math.floor(8 + Math.random() * 15),
  neu: Math.floor(10 + Math.random() * 12),
}))

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  volume: Math.floor(50 + Math.sin(i * 0.5) * 40 + Math.random() * 30),
  sentiment: 0.5 + Math.sin(i * 0.3) * 0.2 + Math.random() * 0.1,
}))

const topicData = [
  { name: 'خدمة العملاء', total: 2841, pos: 32, neg: 48, neu: 20, trend: 'up' },
  { name: 'جودة المنتج', total: 2105, pos: 78, neg: 12, neu: 10, trend: 'stable' },
  { name: 'سرعة التوصيل', total: 1887, pos: 25, neg: 55, neu: 20, trend: 'down' },
  { name: 'العروض والخصومات', total: 1542, pos: 82, neg: 8, neu: 10, trend: 'up' },
  { name: 'تجربة الموقع', total: 1204, pos: 35, neg: 42, neu: 23, trend: 'down' },
  { name: 'التغليف', total: 987, pos: 88, neg: 4, neu: 8, trend: 'up' },
  { name: 'سياسة الإرجاع', total: 654, pos: 40, neg: 35, neu: 25, trend: 'stable' },
  { name: 'طرق الدفع', total: 421, pos: 60, neg: 18, neu: 22, trend: 'stable' },
]

const SentimentAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d')
  const [platformView, setPlatformView] = useState('all')

  return (
    <div>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>تحليل المشاعر</h1>
          <p style={{ fontSize: '.92rem' }}>تقرير شامل للتوجهات العاطفية مستخرج من تحليل 89,441 نصاً عبر الذكاء الاصطناعي</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Time Filter */}
          <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '3px' }}>
            {[{ key: '7d', label: '7 أيام' }, { key: '30d', label: '30 يوم' }, { key: '90d', label: '3 أشهر' }].map(t => (
              <button key={t.key} onClick={() => setTimeRange(t.key)} className="btn" style={{ padding: '5px 12px', fontSize: '.8rem', fontWeight: 600, borderRadius: '6px', background: timeRange === t.key ? 'var(--text-primary)' : 'transparent', color: timeRange === t.key ? '#fff' : 'var(--text-secondary)', border: 'none' }}>{t.label}</button>
            ))}
          </div>
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
          { label: 'نصوص محلّلة', val: '89,441', icon: '📝', sub: '+2,104 هذا الأسبوع', badge: 'badge-blue' },
          { label: 'درجة الرضا العام', val: '7.4/10', icon: '⭐', sub: '+0.3 عن الشهر الماضي', badge: 'badge-green' },
          { label: 'إيجابي', val: '63.2%', icon: '😊', sub: '56,446 نص', badge: 'badge-green' },
          { label: 'سلبي', val: '18.5%', icon: '😠', sub: '16,547 نص', badge: 'badge-red' },
          { label: 'محايد', val: '18.3%', icon: '😐', sub: '16,448 نص', badge: 'badge-amber' },
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
            {timelineData.map((d, i) => {
              const total = d.pos + d.neg + d.neu
              const scale = total / 90
              return (
                <div key={i} title={`يوم ${d.day}: إيجابي ${d.pos}% سلبي ${d.neg}%`} style={{ flex: 1, display: 'flex', flexDirection: 'column', height: `${scale * 100}%`, borderRadius: '3px 3px 0 0', overflow: 'hidden', cursor: 'pointer', transition: 'opacity .15s', opacity: .85 }} onMouseOver={e => e.currentTarget.style.opacity = '1'} onMouseOut={e => e.currentTarget.style.opacity = '.85'}>
                  <div style={{ flex: d.pos, background: 'var(--green)' }}></div>
                  <div style={{ flex: d.neu, background: 'var(--amber)', opacity: .7 }}></div>
                  <div style={{ flex: d.neg, background: 'var(--red)' }}></div>
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ fontSize: '.72rem', color: 'var(--text-tertiary)' }}>6 مارس</span>
            <span style={{ fontSize: '.72rem', color: 'var(--text-tertiary)' }}>5 أبريل</span>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="card-flat" style={{ padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '24px', alignSelf: 'flex-start' }}>النسبة الإجمالية</h3>
          <div style={{ position: 'relative', width: '160px', height: '160px', borderRadius: '50%', background: `conic-gradient(var(--green) 0% 63%, var(--red) 63% 82%, var(--amber) 82% 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(0,0,0,.06)' }}>
            <div style={{ width: '115px', height: '115px', background: '#fff', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span className="mono" style={{ fontSize: '1.8rem', fontWeight: 800 }}>89k</span>
              <span style={{ fontSize: '.75rem', color: 'var(--text-tertiary)' }}>نص</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
            {[
              { label: '😊', val: '63%', color: 'var(--green)' },
              { label: '😠', val: '19%', color: 'var(--red)' },
              { label: '😐', val: '18%', color: 'var(--amber)' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem' }}>{s.label}</div>
                <div className="mono" style={{ fontWeight: 800, fontSize: '.9rem', color: s.color }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hourly Distribution + Platform Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Hourly Activity */}
        <div className="card-flat" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '4px' }}>نشاط التفاعل بالساعة</h3>
          <p style={{ fontSize: '.82rem', color: 'var(--text-tertiary)', marginBottom: '20px' }}>أوقات الذروة في تعليقات الجمهور</p>
          <div style={{ display: 'flex', gap: '2px', height: '140px', alignItems: 'flex-end' }}>
            {hourlyData.map((h, i) => {
              const isPeak = h.volume > 100
              return (
                <div key={i} title={`${h.hour}:00 — ${h.volume} تفاعل`} style={{ flex: 1, height: `${(h.volume / 130) * 100}%`, background: isPeak ? 'var(--blue)' : 'var(--blue-light)', borderRadius: '2px 2px 0 0', cursor: 'pointer', transition: 'background .15s' }} onMouseOver={e => e.target.style.background = 'var(--blue)'} onMouseOut={e => e.target.style.background = isPeak ? 'var(--blue)' : 'var(--blue-light)'}></div>
              )
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <span className="mono" style={{ fontSize: '.7rem', color: 'var(--text-tertiary)' }}>00:00</span>
            <span className="mono" style={{ fontSize: '.7rem', color: 'var(--text-tertiary)' }}>12:00</span>
            <span className="mono" style={{ fontSize: '.7rem', color: 'var(--text-tertiary)' }}>23:00</span>
          </div>
          <div style={{ marginTop: '16px', padding: '12px 16px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '.82rem', color: 'var(--text-secondary)' }}>🔥 ساعة الذروة</span>
            <span className="mono" style={{ fontWeight: 700 }}>8:00 - 10:00 مساءً</span>
          </div>
        </div>

        {/* Platform Comparison */}
        <div className="card-flat" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '20px' }}>مقارنة المنصات</h3>
          {[
            { name: 'فيسبوك', icon: <svg width="18" height="18" fill="#1877F2" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>, pos: 67, neg: 15, neu: 18, total: '58,204' },
            { name: 'X (تويتر)', icon: <svg width="14" height="14" fill="#000" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 4.15H5.059z"/></svg>, pos: 55, neg: 28, neu: 17, total: '31,237' },
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

      {/* Topic Breakdown Table - The Star Feature */}
      <div className="card-flat" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>تحليل المشاعر حسب الموضوع</h3>
            <p style={{ fontSize: '.82rem' }}>تفصيل لكل موضوع مع نسب المشاعر وحجم الذكر واتجاه التغيّر</p>
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>الموضوع</th>
                <th>عدد مرات الذكر</th>
                <th>التوزيع البصري</th>
                <th>😊 إيجابي</th>
                <th>😠 سلبي</th>
                <th>😐 محايد</th>
                <th>الاتجاه</th>
              </tr>
            </thead>
            <tbody>
              {topicData.map((t, i) => (
                <tr key={i}>
                  <td className="mono" style={{ color: 'var(--text-tertiary)', fontSize: '.82rem' }}>{i + 1}</td>
                  <td style={{ fontWeight: 700 }}>{t.name}</td>
                  <td className="mono" style={{ fontWeight: 700 }}>{t.total.toLocaleString()}</td>
                  <td style={{ minWidth: '200px' }}>
                    <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${t.pos}%`, background: 'var(--green)' }}></div>
                      <div style={{ width: `${t.neu}%`, background: 'var(--amber)', opacity: .6 }}></div>
                      <div style={{ width: `${t.neg}%`, background: 'var(--red)' }}></div>
                    </div>
                  </td>
                  <td><span className="mono badge badge-green" style={{ fontSize: '.8rem' }}>{t.pos}%</span></td>
                  <td><span className="mono badge badge-red" style={{ fontSize: '.8rem' }}>{t.neg}%</span></td>
                  <td><span className="mono badge badge-amber" style={{ fontSize: '.8rem' }}>{t.neu}%</span></td>
                  <td>
                    <span style={{ fontSize: '1rem' }}>
                      {t.trend === 'up' ? '📈' : t.trend === 'down' ? '📉' : '➡️'}
                    </span>
                  </td>
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
