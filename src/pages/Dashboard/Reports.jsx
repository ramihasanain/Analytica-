import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useLanguage } from '../../LanguageContext'
import { useDashPage, PageHero, DashModal } from '../../components/dashboard/DashboardUI'

const Reports = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { t, lang, isRTL } = useLanguage()
  const { pageProps } = useDashPage()

  // New report form states
  const [reportType, setReportType] = useState('General')
  const [periodFrom, setPeriodFrom] = useState('')
  const [periodTo, setPeriodTo] = useState('')

  const fetchReports = async () => {
    try {
      const res = await api.get('/reports/')
      const mapped = res.data.map(r => ({
        id: r.id,
        title: (lang === 'ar' ? 'تقرير ' : 'Report ') + (
          r.type === 'General' ? t('repType1') : 
          r.type === 'Sentiment' ? t('repType2') : 
          r.type === 'Topic' ? t('repType3') : r.type
        ) + ' ' + (r.period_from || ''),
        type: r.type === 'General' ? t('repType1') : 
              r.type === 'Sentiment' ? t('repType2') : 
              r.type === 'Topic' ? t('repType3') : r.type,
        period: `${r.period_from || '—'} - ${r.period_to || '—'}`,
        status: lang === 'ar' ? 'جاهز' : 'Completed',
        format: 'Excel (XLSX)',
        badge: 'badge-green',
        file_url: r.file_url
      }))
      setReports(mapped)
    } catch (err) {
      console.error('Error fetching reports', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [lang])

  const handleGenerate = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // POST to /reports/
      await api.post('/reports/', {
        type: reportType,
        period_from: periodFrom || null,
        period_to: periodTo || null,
        status: lang === 'ar' ? 'جاهز' : 'Completed',
        format: 'Excel'
      })
      alert(lang === 'ar' ? 'تم إنشاء التقرير بنجاح!' : 'Report generated successfully!')
      setShowModal(false)
      // Reset form
      setPeriodFrom('')
      setPeriodTo('')
      setReportType('General')
      fetchReports()
    } catch (err) {
      console.error(err)
      alert(lang === 'ar' ? 'فشل إنشاء التقرير' : 'Failed to generate report')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownload = async (id, title) => {
    try {
      const res = await api.get(`/reports/${id}/download/`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${title}.csv`)
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
    } catch (err) {
      console.error('Error downloading report', err)
      alert(lang === 'ar' ? 'فشل تحميل التقرير' : 'Failed to download report')
    }
  }

  return (
    <div {...pageProps}>
      <PageHero
        title={t('dbReports')}
        subtitle={t('repSubtitle')}
        actions={
          <button type="button" onClick={() => setShowModal(true)} className="dash-btn dash-btn-primary">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            {t('repGenerateNew')}
          </button>
        }
      />

      <div className="dash-table-wrap">
        <table className="data-table" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
          <thead>
            <tr style={{ flexDirection: isRTL ? 'row' : 'row-reverse' }}>
              <th style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('repTableTitle')}</th>
              <th style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('repTableType')}</th>
              <th style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('repTablePeriod')}</th>
              <th style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('repTableStatus')}</th>
              <th style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('repTableFormat')}</th>
              <th style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('repTableAction')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>{t('dbLoading')}</td></tr>
            ) : reports.length > 0 ? reports.map((r, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 700 }}>{r.title}</td>
                <td><span className="badge badge-gray">{r.type}</span></td>
                <td className="mono" style={{ fontSize: '.85rem', color: 'var(--text-secondary)' }}>{r.period}</td>
                <td><span className={`badge ${r.badge}`}>{r.status}</span></td>
                <td className="mono" style={{ fontWeight: 700, color: 'var(--green)' }}>{r.format}</td>
                <td>
                  <button className="btn btn-ghost" style={{ fontSize: '.85rem', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--blue)' }} onClick={() => handleDownload(r.id, r.title)}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                    {t('repDownload')}
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>{t('repEmpty')}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Generate Report Modal */}
      {showModal && (
        <DashModal onClose={() => setShowModal(false)}>
          <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{t('repModalTitle')}</h2>
            <p style={{ fontSize: '.9rem', color: 'var(--text-secondary)', marginBottom: '28px' }}>{t('repModalDesc')}</p>

            <form onSubmit={handleGenerate}>
              {/* Type Select */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>{t('repTypeLabel')}</label>
                <select 
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text)', outline: 'none', fontFamily: 'inherit' }}
                >
                  <option value="General">{t('repType1')}</option>
                  <option value="Sentiment">{t('repType2')}</option>
                  <option value="Topic">{t('repType3')}</option>
                </select>
              </div>

              {/* Date Inputs */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>{t('repPeriodLabel')}</label>
                <div style={{ display: 'flex', gap: '12px', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '.75rem', color: 'var(--text-tertiary)', display: 'block', marginBottom: '4px' }}>{t('repFrom')}</span>
                    <input 
                      type="date" 
                      value={periodFrom} 
                      onChange={(e) => setPeriodFrom(e.target.value)} 
                      style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text)', outline: 'none' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '.75rem', color: 'var(--text-tertiary)', display: 'block', marginBottom: '4px' }}>{t('repTo')}</span>
                    <input 
                      type="date" 
                      value={periodTo} 
                      onChange={(e) => setPeriodTo(e.target.value)} 
                      style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg)', color: 'var(--text)', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
                <button type="submit" className="btn btn-blue" style={{ flex: 1 }} disabled={isSubmitting}>
                  {isSubmitting ? t('repGenerating') : t('repGenerateNew')}
                </button>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)} disabled={isSubmitting}>
                  {t('caCancel')}
                </button>
              </div>
            </form>
          </div>
        </DashModal>
      )}
    </div>
  )
}

export default Reports
