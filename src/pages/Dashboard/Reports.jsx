const Reports = () => {
  return (
    <div>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>التقارير</h1>
          <p style={{ fontSize: '.92rem' }}>أنشئ تقارير مفصّلة وصدّرها بصيغة PDF أو CSV لمشاركتها مع فريقك</p>
        </div>
        <button className="btn btn-blue">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          إنشاء تقرير جديد
        </button>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>عنوان التقرير</th>
              <th>النوع</th>
              <th>الفترة</th>
              <th>الحالة</th>
              <th>الصيغة</th>
              <th>الإجراء</th>
            </tr>
          </thead>
          <tbody>
            {[
              { title: 'تقرير المشاعر الشهري - مارس 2026', type: 'تحليل مشاعر', period: '1-31 مارس', status: 'جاهز', format: 'PDF', badge: 'badge-green' },
              { title: 'مقارنة فيسبوك vs X - الربع الأول', type: 'مقارنة منصات', period: '1 يناير - 31 مارس', status: 'جاهز', format: 'PDF', badge: 'badge-green' },
              { title: 'تصدير البيانات الخام - أبريل', type: 'بيانات خام', period: '1-5 أبريل', status: 'قيد التجهيز', format: 'CSV', badge: 'badge-amber' },
              { title: 'تقرير المواضيع الرائجة - فبراير', type: 'تحليل مواضيع', period: '1-28 فبراير', status: 'جاهز', format: 'PDF', badge: 'badge-green' },
              { title: 'ملخص تنفيذي - الربع الأول', type: 'ملخص تنفيذي', period: '1 يناير - 31 مارس', status: 'جاهز', format: 'PDF', badge: 'badge-green' },
            ].map((r, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 700 }}>{r.title}</td>
                <td><span className="badge badge-gray">{r.type}</span></td>
                <td className="mono" style={{ fontSize: '.85rem', color: 'var(--text-secondary)' }}>{r.period}</td>
                <td><span className={`badge ${r.badge}`}>{r.status}</span></td>
                <td className="mono" style={{ fontWeight: 700 }}>{r.format}</td>
                <td>
                  <button className="btn btn-ghost" style={{ fontSize: '.85rem' }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                    تحميل
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Reports
