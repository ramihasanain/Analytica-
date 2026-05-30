import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useLanguage } from '../../LanguageContext'
import { useDashPage, PageHero, DashKpi, DashCard, DashLoading, DashModal } from '../../components/dashboard/DashboardUI'

const ConnectedAccounts = () => {
  const [showModal, setShowModal] = useState(false)
  const [modalPlatform, setModalPlatform] = useState('facebook')
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState([])
  const { t, lang, isRTL } = useLanguage()
  const { pageProps } = useDashPage()

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await api.get('/profiles/')
        // Filter profiles to only include Facebook
        const fbProfiles = res.data.filter(p => p.platform === 'facebook')
        const mapped = fbProfiles.map(p => ({
          id: p.id,
          name: p.account_name || p.url?.split('/').pop() || `حساب ${p.platform}`,
          url: p.url || '',
          platform: p.platform,
          followers: p.followers_count || 0,
          posts: p.posts_count || 0,
          status: 'active',
          lastSync: 'Live ● Connected',
          profile_picture_url: p.profile_picture_url || ''
        }))
        setAccounts(mapped)
      } catch (err) {
        console.error('Error fetching profiles', err)
      } finally {
        setLoading(false)
      }
    }
    
    const fetchJobs = async () => {
      try {
        const res = await api.get('/scrape-jobs/')
        // Filter jobs to only include Facebook
        const fbJobs = res.data.filter(job => job.platform === 'facebook')
        setJobs(fbJobs.sort((a, b) => new Date(b.started_at || 0) - new Date(a.started_at || 0)))
      } catch (err) {
        console.error('Error fetching scrape jobs', err)
      }
    }

    fetchProfiles()
    fetchJobs()
  }, [])

  const handleDelete = async (id) => {
    try {
      await api.delete(`/profiles/${id}/`)
      setAccounts(prev => prev.filter(a => a.id !== id))
    } catch (err) {
      console.error('Error deleting profile', err)
    }
  }

  const handleToggle = (id) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'active' ? 'paused' : 'active' } : a))
  }

  const [syncingId, setSyncingId] = useState(null)

  const handleSync = async (id) => {
    setSyncingId(id)
    try {
      const res = await api.post(`/profiles/${id}/sync/`)
      alert(res.data.message || t('caSyncSuccess'))
      setAccounts(prev => prev.map(a => a.id === id ? {
        ...a,
        name: res.data.profile.account_name || a.name,
        followers: res.data.profile.followers_count || a.followers,
        posts: res.data.profile.posts_count || a.posts,
        profile_picture_url: res.data.profile.profile_picture_url || a.profile_picture_url,
        lastSync: 'Live ● Connected'
      } : a))
      
      const jobsRes = await api.get('/scrape-jobs/')
      const fbJobs = jobsRes.data.filter(job => job.platform === 'facebook')
      setJobs(fbJobs.sort((a, b) => new Date(b.started_at || 0) - new Date(a.started_at || 0)))
      
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.error || t('caSyncFailed'))
    } finally {
      setSyncingId(null)
    }
  }

  const handleConnect = async (platform) => {
    try {
      const res = await api.get(`/oauth/${platform}/login/`)
      if (res.data.auth_url) {
        window.location.href = res.data.auth_url
      }
    } catch (err) {
      console.error('Error initiating OAuth', err)
      alert(t('caConnectFailed'))
    }
  }

  if (loading) {
    return (
      <div {...pageProps}>
        <DashLoading text={t('dbLoading')} />
      </div>
    )
  }

  return (
    <div {...pageProps}>
      <PageHero
        title={t('caTitle')}
        subtitle={t('caSubtitle')}
        badge="Facebook API"
        actions={
          <button type="button" onClick={() => setShowModal(true)} className="dash-btn dash-btn-primary">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            {t('caConnectNew')}
          </button>
        }
      />

      <div className="dash-kpi-grid">
        {[
          { label: t('caTotalAccounts'), val: accounts.length, icon: '🔗', variant: 'blue' },
          { label: t('caActiveAccounts'), val: accounts.filter(a => a.status === 'active').length, icon: '✅', variant: 'green' },
          { label: t('caPausedAccounts'), val: accounts.filter(a => a.status === 'paused').length, icon: '⏸️', variant: 'amber' },
          { label: t('caTotalPosts'), val: accounts.reduce((sum, a) => sum + a.posts, 0).toLocaleString(), icon: '📄', variant: 'indigo' },
        ].map((s, i) => (
          <DashKpi key={i} variant={s.variant} icon={s.icon} label={s.label} value={s.val} delay={i * 0.06} />
        ))}
      </div>

      {/* My Accounts */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
          <span>{t('caMyAccounts')}</span>
          <span className="badge badge-gray">{accounts.length}</span>
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
          {accounts.map(acc => (
            <AccountCard key={acc.id} acc={acc} onDelete={handleDelete} onToggle={handleToggle} onSync={handleSync} isSyncing={syncingId === acc.id} t={t} isRTL={isRTL} lang={lang} />
          ))}
        </div>
      </div>

      {/* Scrape History */}
      <DashCard title={t('caScrapeHistory')}>
        <div className="dash-table-wrap">
          <table className="data-table" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <thead>
              <tr style={{ flexDirection: isRTL ? 'row' : 'row-reverse' }}>
                <th style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('caTableAccount')}</th>
                <th style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('caTablePlatform')}</th>
                <th style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('caTableStatus')}</th>
                <th style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('caTableRecords')}</th>
                <th style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('caTableStartedAt')}</th>
                <th style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('caTableFinishedAt')}</th>
                <th style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('caTableDuration')}</th>
              </tr>
            </thead>
            <tbody>
              {jobs.slice(0, 5).map((job, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 700 }}>{job.profile_name || '—'}</td>
                  <td>{t('caPlatformFB')}</td>
                  <td><span className={`badge badge-green`}>{job.status === 'completed' ? t('caJobCompleted') : job.status}</span></td>
                  <td className="mono">{job.records_fetched}</td>
                  <td className="mono" style={{ fontSize: '.82rem', color: 'var(--text-secondary)' }}>
                    {job.started_at ? new Date(job.started_at).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US') : t('caNotAvailable')}
                  </td>
                  <td className="mono" style={{ fontSize: '.82rem', color: 'var(--text-secondary)' }}>—</td>
                  <td className="mono" style={{ fontWeight: 700 }}>—</td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-tertiary)' }}>{t('caNoJobs')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DashCard>

      {showModal && (
        <DashModal onClose={() => setShowModal(false)}>
          <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{t('caConnectNew')}</h2>
            <p style={{ fontSize: '.9rem', color: 'var(--text-secondary)', marginBottom: '28px' }}>{t('caModalDesc')}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              <button type="button" onClick={() => handleConnect('facebook')} style={{ padding: '16px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'rgba(24, 119, 242, 0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 700, fontSize: '1rem', fontFamily: isRTL ? 'var(--font-ar)' : 'var(--font-en)', color: '#1877F2', width: '100%' }}>
                <svg width="24" height="24" fill="#1877F2" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                {t('caConnectFB')}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1, padding: '14px 24px' }}>{t('caCancel')}</button>
            </div>
          </div>
        </DashModal>
      )}
    </div>
  )
}

const AccountCard = ({ acc, onDelete, onToggle, onSync, isSyncing, t, isRTL, lang }) => (
  <div className="dash-account-card animate-fade-up" style={{ position: 'relative', textAlign: isRTL ? 'right' : 'left' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
      <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(24, 119, 242, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {acc.profile_picture_url ? (
          <img src={acc.profile_picture_url} alt={acc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <svg width="22" height="22" fill="#1877F2" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
        )}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '.95rem', marginBottom: '2px' }}>{acc.name}</div>
        <div className="mono" style={{ fontSize: '.78rem', color: 'var(--text-tertiary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '180px' }}>{acc.url}</div>
      </div>
      <span className={`badge ${acc.status === 'active' ? 'badge-green' : 'badge-amber'}`}>
        {acc.status === 'active' ? t('caStatusActive') : t('caStatusPaused')}
      </span>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', padding: '14px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', marginBottom: '16px', direction: isRTL ? 'rtl' : 'ltr' }}>
      <div>
        <div style={{ fontSize: '.75rem', color: 'var(--text-tertiary)', marginBottom: '4px' }}>{t('caFollowers')}</div>
        <div className="mono" style={{ fontWeight: 700, fontSize: '.9rem' }}>{acc.followers}</div>
      </div>
      <div>
        <div style={{ fontSize: '.75rem', color: 'var(--text-tertiary)', marginBottom: '4px' }}>{t('caPosts')}</div>
        <div className="mono" style={{ fontWeight: 700, fontSize: '.9rem' }}>{acc.posts.toLocaleString()}</div>
      </div>
      <div>
        <div style={{ fontSize: '.75rem', color: 'var(--text-tertiary)', marginBottom: '4px' }}>{t('caLastSync')}</div>
        <div style={{ fontWeight: 700, fontSize: '.82rem', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: isRTL ? 'flex-start' : 'flex-end' }}>
          <span className="breathing-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 6px var(--green)', display: 'inline-block' }}></span>
          {t('caNotStarted')}
        </div>
      </div>
    </div>

    <div style={{ display: 'flex', gap: '8px', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
      <button onClick={() => onSync(acc.id)} disabled={isSyncing} className="btn btn-blue" style={{ fontSize: '.82rem', flex: 1, display: 'flex', justifyContent: 'center', gap: '4px', opacity: isSyncing ? 0.7 : 1 }}>
        {isSyncing ? (
          <div className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }}></div>
        ) : (
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
        )}
        {isSyncing ? t('caSyncing') : t('caSyncNow')}
      </button>
      <button onClick={() => onToggle(acc.id)} className="btn btn-ghost" style={{ fontSize: '.82rem', padding: '0 8px' }}>
        {acc.status === 'active' ? '⏸️' : '▶️'}
      </button>
      <button onClick={() => onDelete(acc.id)} className="btn btn-ghost" style={{ fontSize: '.82rem', color: 'var(--red)', padding: '0 8px' }}>
        🗑️
      </button>
    </div>
  </div>
)

export default ConnectedAccounts
