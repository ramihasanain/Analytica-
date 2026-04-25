import { useState, useEffect } from 'react'
import api from '../../services/api'

const Reports = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/reports/')
        const mapped = res.data.map(r => ({
          id: r.id,
          title: r.type + ' ' + (r.period_from || ''),
          type: r.type,
          period: `${r.period_from || '?'} - ${r.period_to || '?'}`,
          status: r.status,
          format: r.format,
          badge: r.status === 'جاهز' || r.status === 'Completed' ? 'badge-green' : 'badge-amber',
          file_url: r.file_url
        }))
        setReports(mapped)
      } catch (err) {
        console.error('Error fetching reports', err)
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [])

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
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>جاري التحميل...</td></tr>
            ) : reports.length > 0 ? reports.map((r, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 700 }}>{r.title}</td>
                <td><span className="badge badge-gray">{r.type}</span></td>
                <td className="mono" style={{ fontSize: '.85rem', color: 'var(--text-secondary)' }}>{r.period}</td>
                <td><span className={`badge ${r.badge}`}>{r.status}</span></td>
                <td className="mono" style={{ fontWeight: 700 }}>{r.format}</td>
                <td>
                  <button className="btn btn-ghost" style={{ fontSize: '.85rem' }} disabled={!r.file_url} onClick={() => window.open(r.file_url)}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                    تحميل
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>لا توجد تقارير.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Reports
