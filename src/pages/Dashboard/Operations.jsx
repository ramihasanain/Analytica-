import { useState, useEffect } from 'react'
import api from '../../services/api'
import { isGeminiEngine, isLocalTrainedEngine } from '../../utils/i18nHelpers'
import { useDashPage, PageHero, DashKpi, DashCard, DashFilters, DashAlert, DashLoading } from '../../components/dashboard/DashboardUI'

const Operations = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [engineFilter, setEngineFilter] = useState('all')
  const [selectedItem, setSelectedItem] = useState(null) // For modal
  const { t, lang, isRTL, ts, pageProps } = useDashPage()

  const fetchOperationsLog = async () => {
    try {
      setLoading(true)
      const res = await api.get('/posts/operations-log/')
      setLogs(res.data)
    } catch (err) {
      console.error('Error fetching operations log:', err)
      setError(t('opsLoadError'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOperationsLog()
  }, [])

  // Calculate statistics
  const totalItems = logs.length
  const aiCount = logs.filter(l => isGeminiEngine(l.engine_used)).length
  const localCount = totalItems - aiCount
  const aiPercentage = totalItems > 0 ? Math.round((aiCount / totalItems) * 100) : 0
  const localPercentage = totalItems > 0 ? Math.round((localCount / totalItems) * 100) : 0

  // Filter logs based on search and filters
  const filteredLogs = logs.filter(log => {
    const contentMatch = log.content.toLowerCase().includes(searchTerm.toLowerCase()) || log.id.toString().includes(searchTerm)
    const typeMatch = typeFilter === 'all' || log.media_type === typeFilter
    
    let engineMatch = true
    if (engineFilter === 'ai') {
      engineMatch = isGeminiEngine(log.engine_used)
    } else if (engineFilter === 'local') {
      engineMatch = isLocalTrainedEngine(log.engine_used)
    }
    
    return contentMatch && typeMatch && engineMatch
  })

  const getEngineCategoryLabel = (engine) =>
    isGeminiEngine(engine) ? t('opsEngineCategoryAi') : t('opsEngineCategoryLocal')

  const getEngineBadgeStyles = (engine) => {
    if (isGeminiEngine(engine)) {
      return {
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
        color: '#8b5cf6',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        icon: '🧠',
      }
    }
    return {
      background: 'rgba(16, 185, 129, 0.08)',
      color: '#10b981',
      border: '1px solid rgba(16, 185, 129, 0.2)',
      icon: '💻',
    }
  }

  if (loading) {
    return (
      <div {...pageProps}>
        <DashLoading text={t('opsLoading')} />
      </div>
    )
  }

  return (
    <div {...pageProps}>
      <style>{`.log-row:hover { background: var(--bg-elevated) !important; transform: translateY(-1px); }`}</style>

      <PageHero
        title={t('opsTitle')}
        subtitle={t('opsSubtitle')}
        actions={
          <button type="button" onClick={fetchOperationsLog} className="dash-btn dash-btn-ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.25)', background: 'rgba(255,255,255,.1)' }}>
            🔄 {t('opsRefresh')}
          </button>
        }
      />

      {error && <DashAlert variant="error">⚠️ {error}</DashAlert>}

      {!error && (
        <div className="dash-kpi-grid">
          <DashKpi variant="blue" icon="📋" label={t('opsTotalItems')} value={totalItems} sub={t('opsTotalDesc')} delay={0.08} />
          <DashKpi variant="violet" icon="🧠" label={t('opsAiCoverage')} value={`${aiPercentage}%`} sub={t('opsAiDesc', { count: aiCount })} progress={aiPercentage} delay={0.12} />
          <DashKpi variant="green" icon="💻" label={t('opsLocalCoverage')} value={`${localPercentage}%`} sub={t('opsLocalDesc', { count: localCount })} progress={localPercentage} delay={0.16} />
        </div>
      )}

      {!error && (
        <DashFilters>
          <input
            type="text"
            className="dash-input"
            placeholder={`🔍 ${t('opsSearchPlaceholder')}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Media Type Filter */}
          <select className="dash-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">📱 {t('opsFilterAllTypes')}</option>
            <option value="post">📝 {t('opsFilterPost')}</option>
            <option value="comment">💬 {t('opsFilterComment')}</option>
          </select>
          <select className="dash-select" value={engineFilter} onChange={(e) => setEngineFilter(e.target.value)}>
            <option value="all">⚙️ {t('opsFilterAllEngines')}</option>
            <option value="ai">🧠 {t('opsFilterAi')}</option>
            <option value="local">💻 {t('opsFilterLocalModel')}</option>
          </select>
        </DashFilters>
      )}

      {!error && (
        <DashCard>
          <div className="dash-table-wrap" style={{ border: 'none' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.88rem', textAlign: isRTL ? 'right' : 'left' }}>
              <thead>
                <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '16px 20px', fontWeight: 700 }}>{t('opsTableId')}</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700 }}>{t('opsTableType')}</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700 }}>{t('opsTableContent')}</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700 }}>{t('opsTableEngine')}</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700 }}>{t('opsTableSentiment')}</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700 }}>{t('opsTableTopic')}</th>
                  <th style={{ padding: '16px 20px', fontWeight: 700 }}>{t('opsTableDate')}</th>
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
                            📝 {t('opsFilterPost')}
                          </span>
                        ) : (
                          <span className="badge badge-blue" style={{ fontSize: '.75rem', color: 'var(--blue)', background: 'var(--blue-soft)', fontWeight: 700 }}>
                            💬 {t('opsFilterComment')}
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
                          <span title={log.engine_used}>{getEngineCategoryLabel(log.engine_used)}</span>
                        </span>
                      </td>
                      
                      {/* Sentiment */}
                      <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                        <span className={`badge ${log.sentiment === 'إيجابي' ? 'badge-green' : log.sentiment === 'سلبي' ? 'badge-red' : 'badge-amber'}`} style={{ fontSize: '.78rem', fontWeight: 700 }}>
                          {ts(log.sentiment)}
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
                      {t('opsNoRecords')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          </div>
        </DashCard>
      )}

      {selectedItem && (
        <div className="dash-modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="dash-modal" style={{ maxWidth: 600, textAlign: isRTL ? 'right' : 'left' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>
                🔍 {t('opsDiagTitle')} #{selectedItem.id}
              </h2>
              <button onClick={() => setSelectedItem(null)} style={{ border: 'none', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-secondary)', outline: 'none' }}>&times;</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Content Box */}
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border-light)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '.75rem', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase' }}>
                  {t('opsFullContent')}
                </div>
                <p style={{ margin: 0, fontSize: '.92rem', color: 'var(--text-primary)', lineHeight: 1.8, fontWeight: 500 }}>
                  {selectedItem.content}
                </p>
              </div>

              {/* Grid metadata */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '.75rem', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase' }}>
                    {t('opsMediaType')}
                  </div>
                  <span style={{ fontSize: '.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {selectedItem.media_type === 'post' ? '📝 منشور أصلي' : '💬 تعليق صفحة'}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: '.75rem', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase' }}>
                    {t('opsAssignedTopic')}
                  </div>
                  <span style={{ fontSize: '.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {selectedItem.topic ? `📌 ${selectedItem.topic}` : '—'}
                  </span>
                </div>
              </div>

              {/* Engine Lineage Box */}
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border-light)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '.75rem', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>
                  {t('opsLineage')}
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
                    {getEngineBadgeStyles(selectedItem.engine_used).icon}{' '}
                    <span title={selectedItem.engine_used}>{getEngineCategoryLabel(selectedItem.engine_used)}</span>
                  </span>
                  <span className={`badge ${selectedItem.sentiment === 'إيجابي' ? 'badge-green' : selectedItem.sentiment === 'سلبي' ? 'badge-red' : 'badge-amber'}`} style={{ fontSize: '.85rem', fontWeight: 700 }}>
                    {ts(selectedItem.sentiment)}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {t('opsDiagExplain', { pct: (selectedItem.confidence * 100).toFixed(0) })}
                </p>
              </div>

              {/* Close Button */}
              <button onClick={() => setSelectedItem(null)} className="btn btn-blue" style={{ width: '100%', padding: '10px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', outline: 'none' }}>
                {t('opsClose')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Operations
