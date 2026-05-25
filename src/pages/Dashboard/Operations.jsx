import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useLanguage } from '../../LanguageContext'

const Operations = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [engineFilter, setEngineFilter] = useState('all')
  const [selectedItem, setSelectedItem] = useState(null) // For modal
  const { lang, isRTL } = useLanguage()

  const fetchOperationsLog = async () => {
    try {
      setLoading(true)
      const res = await api.get('/posts/operations-log/')
      setLogs(res.data)
    } catch (err) {
      console.error('Error fetching operations log:', err)
      setError(lang === 'ar' ? 'فشل تحميل سجل العمليات' : 'Failed to load operations log')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOperationsLog()
  }, [])

  // Calculate statistics
  const totalItems = logs.length
  const aiCount = logs.filter(l => l.engine_used && (l.engine_used.toLowerCase().includes('gemini') || l.engine_used.toLowerCase().includes('ai'))).length
  const localCount = totalItems - aiCount
  const aiPercentage = totalItems > 0 ? Math.round((aiCount / totalItems) * 100) : 0
  const localPercentage = totalItems > 0 ? Math.round((localCount / totalItems) * 100) : 0

  // Filter logs based on search and filters
  const filteredLogs = logs.filter(log => {
    const contentMatch = log.content.toLowerCase().includes(searchTerm.toLowerCase()) || log.id.toString().includes(searchTerm)
    const typeMatch = typeFilter === 'all' || log.media_type === typeFilter
    
    let engineMatch = true
    if (engineFilter !== 'all') {
      if (engineFilter === 'gemini') {
        engineMatch = log.engine_used.toLowerCase().includes('gemini') || log.engine_used.toLowerCase().includes('ai')
      } else if (engineFilter === 'marbert') {
        engineMatch = log.engine_used.toLowerCase().includes('marbert')
      } else if (engineFilter === 'lexicon') {
        engineMatch = log.engine_used.toLowerCase().includes('lexicon') || log.engine_used.toLowerCase().includes('local')
      } else if (engineFilter === 'rule') {
        engineMatch = log.engine_used.toLowerCase().includes('rule') || log.engine_used.toLowerCase().includes('system')
      }
    }
    
    return contentMatch && typeMatch && engineMatch
  })

  // Format engine badges nicely
  const getEngineBadgeStyles = (engine) => {
    const lower = (engine || '').toLowerCase()
    if (lower.includes('gemini') || lower.includes('ai')) {
      return {
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
        color: '#8b5cf6',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        icon: '🧠'
      }
    }
    if (lower.includes('marbert')) {
      return {
        background: 'rgba(236, 72, 153, 0.08)',
        color: '#ec4899',
        border: '1px solid rgba(236, 72, 153, 0.2)',
        icon: '💻'
      }
    }
    if (lower.includes('lexicon')) {
      return {
        background: 'rgba(16, 185, 129, 0.08)',
        color: '#10b981',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        icon: '📖'
      }
    }
    return {
      background: 'rgba(107, 114, 128, 0.08)',
      color: '#6b7280',
      border: '1px solid rgba(107, 114, 128, 0.2)',
      icon: '⚙️'
    }
  }

  return (
    <div style={{ fontFamily: isRTL ? 'var(--font-ar)' : 'var(--font-en)', direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .log-row:hover {
          background-color: var(--bg-elevated) !important;
          transform: translateY(-1px);
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>
            {lang === 'ar' ? 'عمليات السحب والتحليل' : 'Scrapes & Audits Operations'}
          </h1>
          <p style={{ fontSize: '.92rem', color: 'var(--text-secondary)' }}>
            {lang === 'ar' 
              ? 'سجل تتبع تفصيلي لمصادر التصنيف ونوعية المحركات والنماذج المستخدمة لكل منشور أو تعليق.' 
              : 'Detailed tracking audit of the models, engines, and classification logic applied to each item.'}
          </p>
        </div>
        <button onClick={fetchOperationsLog} className="btn" style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-card)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', outline: 'none' }}>
          🔄 {lang === 'ar' ? 'تحديث السجل' : 'Refresh Log'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '16px', background: 'var(--red-light)', color: 'var(--red)', borderRadius: '8px', marginBottom: '24px' }}>
          ⚠️ {error}
        </div>
      )}

      {/* High Density Lineage Statistics */}
      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {/* Card 1: Total Scrapes */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '20px 24px', borderRadius: '16px', animation: 'fadeIn 0.4s ease-out' }}>
            <div style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px' }}>
              {lang === 'ar' ? 'إجمالي السجلات المسحوبة' : 'Total Items Processed'}
            </div>
            <div className="mono" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {totalItems}
            </div>
            <span style={{ fontSize: '.75rem', color: 'var(--text-secondary)' }}>
              {lang === 'ar' ? 'منشورات وتعليقات معالجة بنجاح' : 'Processed posts & comments'}
            </span>
          </div>

          {/* Card 2: AI-Powered */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '20px 24px', borderRadius: '16px', animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px' }}>
              {lang === 'ar' ? 'اعتماد الذكاء الاصطناعي' : 'AI Engine Coverage'}
            </div>
            <div className="mono" style={{ fontSize: '2rem', fontWeight: 800, color: '#8b5cf6', marginBottom: '4px' }}>
              {aiPercentage}%
            </div>
            <span style={{ fontSize: '.75rem', color: 'var(--text-secondary)' }}>
              {lang === 'ar' ? `تم عبر Gemini (${aiCount} عملية)` : `Handled by Gemini (${aiCount} tasks)`}
            </span>
          </div>

          {/* Card 3: Local Engine */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '20px 24px', borderRadius: '16px', animation: 'fadeIn 0.6s ease-out' }}>
            <div style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px' }}>
              {lang === 'ar' ? 'محركات المعالجة المحلية' : 'Local Engine Coverage'}
            </div>
            <div className="mono" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--blue)', marginBottom: '4px' }}>
              {localPercentage}%
            </div>
            <span style={{ fontSize: '.75rem', color: 'var(--text-secondary)' }}>
              {lang === 'ar' ? `المحلي والمطابقات الفورية (${localCount} عملية)` : `Marbert & Lexicon local rules (${localCount} tasks)`}
            </span>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      {!loading && !error && (
        <div style={{ 
          background: 'var(--bg-card)', 
          border: '1px solid var(--border)', 
          padding: '16px 20px', 
          borderRadius: '12px', 
          display: 'flex', 
          gap: '16px', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          marginBottom: '24px',
          flexDirection: isRTL ? 'row' : 'row-reverse' 
        }}>
          {/* Search bar */}
          <input
            type="text"
            placeholder={lang === 'ar' ? '🔍 ابحث بالنص أو المعرّف (ID)...' : '🔍 Search by text or ID...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              flex: 1, 
              minWidth: '220px', 
              padding: '9px 16px', 
              borderRadius: '8px', 
              border: '1px solid var(--border)', 
              background: 'var(--bg)', 
              color: 'var(--text-primary)',
              fontFamily: isRTL ? 'var(--font-ar)' : 'var(--font-en)',
              fontSize: '.85rem',
              outline: 'none'
            }}
          />

          {/* Media Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontFamily: isRTL ? 'var(--font-ar)' : 'var(--font-en)', fontSize: '.85rem', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
          >
            <option value="all">{lang === 'ar' ? '📱 جميع أنواع المحتوى' : '📱 All Content Types'}</option>
            <option value="post">{lang === 'ar' ? '📝 منشور أصلي' : '📝 Parent Post'}</option>
            <option value="comment">{lang === 'ar' ? '💬 تعليق' : '💬 Comment'}</option>
          </select>

          {/* Engine Filter */}
          <select
            value={engineFilter}
            onChange={(e) => setEngineFilter(e.target.value)}
            style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontFamily: isRTL ? 'var(--font-ar)' : 'var(--font-en)', fontSize: '.85rem', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
          >
            <option value="all">{lang === 'ar' ? '⚙️ جميع محركات المعالجة' : '⚙️ All Processing Engines'}</option>
            <option value="gemini">{lang === 'ar' ? '🧠 ذكاء اصطناعي (Gemini)' : '🧠 AI Engine (Gemini)'}</option>
            <option value="marbert">{lang === 'ar' ? '💻 محلي (MARBERT)' : '💻 Local (MARBERT)'}</option>
            <option value="lexicon">{lang === 'ar' ? '📖 قاموس محلي (Lexicon)' : '📖 Local Lexicon'}</option>
            <option value="rule">{lang === 'ar' ? '⚙️ قواعد النظام الثابتة' : '⚙️ System Rule'}</option>
          </select>
        </div>
      )}

      {/* Main Operations Table */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <span style={{ fontSize: '1.2rem', display: 'block', marginBottom: '10px' }}>⏳</span>
          {lang === 'ar' ? 'جاري تحميل سجل العمليات والمحركات...' : 'Loading operations log & lineages...'}
        </div>
      ) : (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.88rem', textAlign: isRTL ? 'right' : 'left' }}>
              <thead>
                <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '16px 20px', fontWeight: 700 }}>{lang === 'ar' ? 'المعرّف (ID)' : 'ID'}</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700 }}>{lang === 'ar' ? 'نوع المحتوى' : 'Type'}</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700 }}>{lang === 'ar' ? 'النص والمعاينة' : 'Content Snippet'}</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700 }}>{lang === 'ar' ? 'محرك المعالجة' : 'Engine Used'}</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700 }}>{lang === 'ar' ? 'المشاعر' : 'Sentiment'}</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700 }}>{lang === 'ar' ? 'الموضوع' : 'Topic'}</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700 }}>{lang === 'ar' ? 'تاريخ النشر' : 'Posted At'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => {
                  const badge = getEngineBadgeStyles(log.engine_used)
                  return (
                    <tr key={log.id} className="log-row" style={{ borderBottom: '1px solid var(--border-light)', transition: 'all 0.2s', cursor: 'pointer' }} onClick={() => setSelectedItem(log)}>
                      {/* ID */}
                      <td className="mono" style={{ padding: '16px 20px', color: 'var(--text-tertiary)', fontWeight: 600 }}>#{log.id}</td>
                      
                      {/* Media Type */}
                      <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                        {log.media_type === 'post' ? (
                          <span className="badge badge-gray" style={{ fontSize: '.75rem', fontWeight: 700 }}>
                            📝 {lang === 'ar' ? 'منشور أصلي' : 'Parent Post'}
                          </span>
                        ) : (
                          <span className="badge badge-blue" style={{ fontSize: '.75rem', color: 'var(--blue)', background: 'var(--blue-soft)', fontWeight: 700 }}>
                            💬 {lang === 'ar' ? 'تعليق' : 'Comment'}
                          </span>
                        )}
                      </td>
                      
                      {/* Content Preview */}
                      <td style={{ padding: '16px 20px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {log.content}
                      </td>
                      
                      {/* Engine Used */}
                      <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '.78rem',
                          fontWeight: 700,
                          background: badge.background,
                          color: badge.color,
                          border: badge.border
                        }}>
                          <span>{badge.icon}</span>
                          <span>{log.engine_used}</span>
                        </span>
                      </td>
                      
                      {/* Sentiment */}
                      <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                        <span className={`badge ${log.sentiment === 'إيجابي' ? 'badge-green' : log.sentiment === 'سلبي' ? 'badge-red' : 'badge-amber'}`} style={{ fontSize: '.78rem', fontWeight: 700 }}>
                          {log.sentiment}
                        </span>
                      </td>
                      
                      {/* Topic */}
                      <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                        {log.topic ? (
                          <span className="badge badge-gray" style={{ fontSize: '.75rem', fontWeight: 600 }}>
                            📌 {log.topic}
                          </span>
                        ) : '—'}
                      </td>
                      
                      {/* Date */}
                      <td style={{ padding: '16px 20px', whiteSpace: 'nowrap', color: 'var(--text-tertiary)', fontSize: '.78rem' }}>
                        {log.posted_at}
                      </td>
                    </tr>
                  )
                })}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      {lang === 'ar' ? 'لا توجد سجلات مطابقة للبحث أو الفلتر حالياً.' : 'No matching audit records found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detailed Diagnostics Modal */}
      {selectedItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.2s ease-out'
        }} onClick={() => setSelectedItem(null)}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            padding: '32px',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '600px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            textAlign: isRTL ? 'right' : 'left',
            direction: isRTL ? 'rtl' : 'ltr'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>
                🔍 {lang === 'ar' ? `تفاصيل تشخيص السجل #${selectedItem.id}` : `Diagnostics details #${selectedItem.id}`}
              </h2>
              <button onClick={() => setSelectedItem(null)} style={{ border: 'none', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-secondary)', outline: 'none' }}>&times;</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Content Box */}
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border-light)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '.75rem', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase' }}>
                  {lang === 'ar' ? 'المحتوى الكامل' : 'Full Content'}
                </div>
                <p style={{ margin: 0, fontSize: '.92rem', color: 'var(--text-primary)', lineHeight: 1.8, fontWeight: 500 }}>
                  {selectedItem.content}
                </p>
              </div>

              {/* Grid metadata */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '.75rem', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase' }}>
                    {lang === 'ar' ? 'نوع السجل' : 'Media Type'}
                  </div>
                  <span style={{ fontSize: '.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {selectedItem.media_type === 'post' ? '📝 منشور أصلي' : '💬 تعليق صفحة'}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: '.75rem', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase' }}>
                    {lang === 'ar' ? 'الموضوع الفعلي' : 'Assigned Topic'}
                  </div>
                  <span style={{ fontSize: '.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {selectedItem.topic ? `📌 ${selectedItem.topic}` : '—'}
                  </span>
                </div>
              </div>

              {/* Engine Lineage Box */}
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border-light)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '.75rem', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>
                  {lang === 'ar' ? 'سلسلة المعالجة ونموذج التحليل' : 'Processing Lineage & Model Audit'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '.85rem',
                    fontWeight: 700,
                    background: getEngineBadgeStyles(selectedItem.engine_used).background,
                    color: getEngineBadgeStyles(selectedItem.engine_used).color,
                    border: getEngineBadgeStyles(selectedItem.engine_used).border
                  }}>
                    {getEngineBadgeStyles(selectedItem.engine_used).icon} {selectedItem.engine_used}
                  </span>
                  <span className={`badge ${selectedItem.sentiment === 'إيجابي' ? 'badge-green' : selectedItem.sentiment === 'سلبي' ? 'badge-red' : 'badge-amber'}`} style={{ fontSize: '.85rem', fontWeight: 700 }}>
                    {selectedItem.sentiment}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {lang === 'ar' 
                    ? `اعتمد محرك التحليل على هذا النموذج المحدد لتحديد درجة مشاعر المحتوى وتصنيف الموضوع بدقة متناهية وبنسبة ثقة بلغت ${(selectedItem.confidence * 100).toFixed(0)}%.` 
                    : `The classification pipeline routed this content to the specified model with an evaluation confidence of ${(selectedItem.confidence * 100).toFixed(0)}%.`}
                </p>
              </div>

              {/* Close Button */}
              <button onClick={() => setSelectedItem(null)} className="btn btn-blue" style={{ width: '100%', padding: '10px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', outline: 'none' }}>
                {lang === 'ar' ? 'إغلاق نافذة التشخيص' : 'Close Diagnostics'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Operations
