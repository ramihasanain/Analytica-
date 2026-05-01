import { useState, useEffect } from 'react'
import api from '../../services/api'

const ConnectedAccounts = () => {
  const [showModal, setShowModal] = useState(false)
  const [modalPlatform, setModalPlatform] = useState('facebook')
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await api.get('/profiles/')
        const mapped = res.data.map(p => ({
          id: p.id,
          name: p.account_name || p.url?.split('/').pop() || `حساب ${p.platform}`,
          url: p.url || '',
          platform: p.platform,
          followers: p.followers_count || 0,
          posts: p.posts_count || 0,
          status: 'active',
          lastSync: 'لم يبدأ بعد',
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
        setJobs(res.data.sort((a, b) => new Date(b.started_at || 0) - new Date(a.started_at || 0)))
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
      alert(res.data.message || 'تمت المزامنة بنجاح!')
      setAccounts(prev => prev.map(a => a.id === id ? {
        ...a,
        name: res.data.profile.account_name || a.name,
        followers: res.data.profile.followers_count || a.followers,
        posts: res.data.profile.posts_count || a.posts,
        profile_picture_url: res.data.profile.profile_picture_url || a.profile_picture_url,
        lastSync: 'الآن'
      } : a))
      
      const jobsRes = await api.get('/scrape-jobs/')
      setJobs(jobsRes.data.sort((a, b) => new Date(b.started_at || 0) - new Date(a.started_at || 0)))
      
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.error || 'فشلت عملية المزامنة')
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
      alert('فشل في بدء عملية الربط')
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>الحسابات المربوطة</h1>
          <p style={{ fontSize: '.92rem' }}>أضف صفحات فيسبوك أو حسابات X لبدء سحب البيانات تلقائياً كل 24 ساعة</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-blue">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          ربط حساب جديد
        </button>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'إجمالي الحسابات', val: accounts.length, icon: '🔗' },
          { label: 'حسابات نشطة', val: accounts.filter(a => a.status === 'active').length, icon: '✅' },
          { label: 'حسابات متوقفة', val: accounts.filter(a => a.status === 'paused').length, icon: '⏸️' },
          { label: 'إجمالي المنشورات المسحوبة', val: accounts.reduce((sum, a) => sum + a.posts, 0).toLocaleString(), icon: '📄' },
        ].map((s, i) => (
          <div key={i} className="card-flat">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{s.label}</span>
              <span>{s.icon}</span>
            </div>
            <div className="mono" style={{ fontSize: '1.6rem', fontWeight: 800 }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* My Accounts */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🏢 حساباتي
          <span className="badge badge-gray">{accounts.length}</span>
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {accounts.map(acc => (
            <AccountCard key={acc.id} acc={acc} onDelete={handleDelete} onToggle={handleToggle} onSync={handleSync} isSyncing={syncingId === acc.id} />
          ))}
        </div>
      </div>

      {/* Scrape History */}
      <div className="card-flat" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.05rem', marginBottom: '20px' }}>سجل عمليات السحب الأخيرة</h3>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>الحساب</th>
                <th>المنصة</th>
                <th>الحالة</th>
                <th>سجلات</th>
                <th>بدأ في</th>
                <th>انتهى في</th>
                <th>المدة</th>
              </tr>
            </thead>
            <tbody>
              {jobs.slice(0, 5).map((job, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 700 }}>{job.profile_name || 'حساب غير معروف'}</td>
                  <td>{job.platform === 'facebook' ? 'فيسبوك' : job.platform === 'twitter' ? 'X' : job.platform}</td>
                  <td><span className={`badge badge-green`}>{job.status === 'completed' ? 'مكتمل' : job.status}</span></td>
                  <td className="mono">{job.records_fetched}</td>
                  <td className="mono" style={{ fontSize: '.82rem', color: 'var(--text-secondary)' }}>
                    {job.started_at ? new Date(job.started_at).toLocaleString('ar-EG') : 'غير متوفر'}
                  </td>
                  <td className="mono" style={{ fontSize: '.82rem', color: 'var(--text-secondary)' }}>--</td>
                  <td className="mono" style={{ fontWeight: 700 }}>--</td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-tertiary)' }}>لا يوجد عمليات سحب سابقة</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Account Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={() => setShowModal(false)}>
          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: '40px', width: '480px', boxShadow: 'var(--shadow-xl)' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>ربط حساب جديد</h2>
            <p style={{ fontSize: '.9rem', color: 'var(--text-secondary)', marginBottom: '28px' }}>اختر المنصة التي تريد ربطها لسحب البيانات تلقائياً بصورة آمنة</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              <button type="button" onClick={() => handleConnect('facebook')} style={{ padding: '16px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', background: '#EFF6FF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 700, fontSize: '1rem', fontFamily: 'var(--font-ar)', color: '#1877F2' }}>
                <svg width="24" height="24" fill="#1877F2" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                ربط حساب فيسبوك (OAuth رسمي)
              </button>
              <button type="button" onClick={() => handleConnect('x')} style={{ padding: '16px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-elevated)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 700, fontSize: '1rem', fontFamily: 'var(--font-ar)', color: '#000' }}>
                <svg width="20" height="20" fill="#000" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 4.15H5.059z"/></svg>
                ربط حساب X (OAuth رسمي)
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1, padding: '14px 24px' }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const AccountCard = ({ acc, onDelete, onToggle, onSync, isSyncing }) => (
  <div className="card-flat animate-fade-up" style={{ position: 'relative' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
      <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: acc.platform === 'facebook' ? '#EFF6FF' : 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {acc.profile_picture_url ? (
            <img src={acc.profile_picture_url} alt={acc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : acc.platform === 'facebook' ? (
          <svg width="22" height="22" fill="#1877F2" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
        ) : (
          <svg width="20" height="20" fill="#000" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 4.15H5.059z"/></svg>
        )}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '.95rem', marginBottom: '2px' }}>{acc.name}</div>
        <div className="mono" style={{ fontSize: '.78rem', color: 'var(--text-tertiary)' }}>{acc.url}</div>
      </div>
      <span className={`badge ${acc.status === 'active' ? 'badge-green' : 'badge-amber'}`}>
        {acc.status === 'active' ? 'نشط' : 'متوقف'}
      </span>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', padding: '14px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', marginBottom: '16px' }}>
      <div>
        <div style={{ fontSize: '.75rem', color: 'var(--text-tertiary)', marginBottom: '4px' }}>المتابعون</div>
        <div className="mono" style={{ fontWeight: 700, fontSize: '.9rem' }}>{acc.followers}</div>
      </div>
      <div>
        <div style={{ fontSize: '.75rem', color: 'var(--text-tertiary)', marginBottom: '4px' }}>منشورات مسحوبة</div>
        <div className="mono" style={{ fontWeight: 700, fontSize: '.9rem' }}>{acc.posts.toLocaleString()}</div>
      </div>
      <div>
        <div style={{ fontSize: '.75rem', color: 'var(--text-tertiary)', marginBottom: '4px' }}>آخر سحب</div>
        <div style={{ fontWeight: 700, fontSize: '.82rem' }}>{acc.lastSync}</div>
      </div>
    </div>

    <div style={{ display: 'flex', gap: '8px' }}>
      <button onClick={() => onSync(acc.id)} disabled={isSyncing} className="btn btn-blue" style={{ fontSize: '.82rem', flex: 1, display: 'flex', justifyContent: 'center', gap: '4px', opacity: isSyncing ? 0.7 : 1 }}>
        {isSyncing ? (
          <div className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }}></div>
        ) : (
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
        )}
        {isSyncing ? 'جاري المزامنة...' : 'مزامنة الآن'}
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
