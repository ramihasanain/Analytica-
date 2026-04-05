const Overview = () => {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>نظرة عامة</h1>
          <p style={{ fontSize: '.92rem' }}>ملخص أداء صفحاتك خلال آخر 30 يوماً</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="badge badge-green" style={{ padding: '6px 14px', fontSize: '.85rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }}></span>
            آخر سحب: اليوم 06:00 ص
          </span>
        </div>
      </div>

      {/* KPI Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
        {[
          { label: 'إجمالي المنشورات', val: '14,208', change: '+312 هذا الأسبوع', up: true, icon: '📄' },
          { label: 'إجمالي التعليقات', val: '89,441', change: '+2,104 هذا الأسبوع', up: true, icon: '💬' },
          { label: 'الصفحات المربوطة', val: '6', change: '3 فيسبوك + 3 X', up: null, icon: '🔗' },
          { label: 'عمليات السحب المكتملة', val: '184', change: 'آخر 30 يوماً', up: null, icon: '✅' },
        ].map((kpi, i) => (
          <div key={i} className="card-flat animate-fade-up" style={{ animationDelay: `${i * .08}s` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'مشاعر إيجابية', val: '63.2%', color: 'var(--green)', bg: 'var(--green-light)', width: '63%' },
          { label: 'مشاعر سلبية', val: '18.5%', color: 'var(--red)', bg: 'var(--red-light)', width: '18%' },
          { label: 'مشاعر محايدة', val: '18.3%', color: 'var(--amber)', bg: 'var(--amber-light)', width: '18%' },
        ].map((s, i) => (
          <div key={i} className="card-flat animate-fade-up" style={{ animationDelay: `${(i + 4) * .08}s` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{s.label}</span>
              <span className="mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: s.color }}>{s.val}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: s.width, background: s.color }}></div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Timeline Chart */}
        <div className="card-flat" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>حجم البيانات المسحوبة يومياً</h3>
              <p style={{ fontSize: '.82rem' }}>منشورات + تعليقات خلال آخر 30 يوماً</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="badge badge-blue" style={{ fontSize: '.75rem' }}>منشورات</span>
              <span className="badge badge-gray" style={{ fontSize: '.75rem' }}>تعليقات</span>
            </div>
          </div>
          <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
            {Array.from({length: 30}).map((_, i) => {
              const postH = 20 + Math.sin(i * 0.3) * 15 + Math.random() * 25
              const commentH = postH * (1.5 + Math.random())
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ height: `${Math.min(commentH * 0.5, 60)}%`, background: 'var(--bg-elevated)', borderRadius: '2px 2px 0 0' }}></div>
                  <div style={{ height: `${Math.min(postH, 40)}%`, background: 'var(--blue)', borderRadius: '0 0 2px 2px', opacity: .8 }}></div>
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
            <span style={{ fontSize: '.72rem', color: 'var(--text-tertiary)' }}>6 أبريل</span>
            <span style={{ fontSize: '.72rem', color: 'var(--text-tertiary)' }}>5 مايو</span>
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="card-flat" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '24px' }}>توزيع المنصات</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { name: 'فيسبوك', posts: '9,412', pct: '66%', color: '#1877F2', icon: <svg width="20" height="20" fill="#1877F2" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg> },
              { name: 'X (تويتر)', posts: '4,796', pct: '34%', color: '#000', icon: <svg width="18" height="18" fill="#000" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 4.15H5.059z"/></svg> },
            ].map((p, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {p.icon}
                    <span style={{ fontWeight: 700, fontSize: '.92rem' }}>{p.name}</span>
                  </div>
                  <span className="mono" style={{ fontWeight: 700, fontSize: '.9rem' }}>{p.posts} منشور</span>
                </div>
                <div className="progress-bar" style={{ height: '8px' }}>
                  <div className="progress-fill" style={{ width: p.pct, background: p.color }}></div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '28px', padding: '16px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '.82rem', color: 'var(--text-tertiary)', marginBottom: '8px', fontWeight: 600 }}>الموعد القادم للسحب</div>
            <div className="mono" style={{ fontSize: '1.1rem', fontWeight: 700 }}>غداً 06:00 صباحاً</div>
          </div>
        </div>
      </div>

      {/* Top Topics + Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Top Topics */}
        <div className="card-flat" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '20px' }}>أبرز المواضيع المكتشفة</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { topic: 'خدمة العملاء', count: 1842, sentiment: 'سلبي', badge: 'badge-red' },
              { topic: 'جودة المنتج', count: 1621, sentiment: 'إيجابي', badge: 'badge-green' },
              { topic: 'سرعة التوصيل', count: 1204, sentiment: 'سلبي', badge: 'badge-red' },
              { topic: 'العروض والخصومات', count: 987, sentiment: 'إيجابي', badge: 'badge-green' },
              { topic: 'سياسة الإرجاع', count: 654, sentiment: 'محايد', badge: 'badge-amber' },
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="mono" style={{ fontSize: '.78rem', color: 'var(--text-tertiary)', width: '20px' }}>#{i + 1}</span>
                  <span style={{ fontWeight: 600, fontSize: '.92rem' }}>{t.topic}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="mono" style={{ fontSize: '.82rem', color: 'var(--text-secondary)' }}>{t.count.toLocaleString()} ذكر</span>
                  <span className={`badge ${t.badge}`}>{t.sentiment}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Scrape Jobs */}
        <div className="card-flat" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '20px' }}>آخر عمليات السحب</h3>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>المنصة</th>
                  <th>الحالة</th>
                  <th>سجلات</th>
                  <th>التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { platform: 'فيسبوك', status: 'مكتمل', records: '412', date: '05/04', badge: 'badge-green' },
                  { platform: 'X', status: 'مكتمل', records: '287', date: '05/04', badge: 'badge-green' },
                  { platform: 'فيسبوك', status: 'مكتمل', records: '398', date: '04/04', badge: 'badge-green' },
                  { platform: 'X', status: 'فشل', records: '0', date: '04/04', badge: 'badge-red' },
                  { platform: 'فيسبوك', status: 'مكتمل', records: '445', date: '03/04', badge: 'badge-green' },
                ].map((job, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 700 }}>{job.platform}</td>
                    <td><span className={`badge ${job.badge}`}>{job.status}</span></td>
                    <td className="mono">{job.records}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{job.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview
