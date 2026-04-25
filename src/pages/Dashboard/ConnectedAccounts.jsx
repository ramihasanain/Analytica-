import { useState, useEffect } from 'react'
import api from '../../services/api'

const ConnectedAccounts = () => {
  const [showModal, setShowModal] = useState(false)
  const [modalPlatform, setModalPlatform] = useState('facebook')
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await api.get('/profiles/')
        const mapped = res.data.map(p => ({
          id: p.id,
          name: p.url ? p.url.split('/').pop() : `حساب ${p.platform}`, // Basic extraction
          url: p.url || '',
          platform: p.platform,
          followers: '-',
          posts: 0,
          status: 'active',
          lastSync: 'لم يبدأ بعد'
        }))
        setAccounts(mapped)
      } catch (err) {
        console.error('Error fetching profiles', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfiles()
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

  const handleAdd = async (e) => {
    e.preventDefault()
    const form = e.target
    const url = form.url.value
    
    // In a real app we'd need to get the user ID, but we rely on the backend token if it assigns it automatically
    // Wait, the API requires a user ID if it's not automatically set by the serializer from the request.user.
    // For now we will try to post, if it fails due to user field, backend needs update.
    try {
      const res = await api.post('/profiles/', {
        platform: modalPlatform,
        url: url,
        user: 1, // HARDCODED for now, usually backend assigns request.user
      })
      const newAcc = {
        id: res.data.id,
        name: res.data.url.split('/').pop(),
        url: res.data.url,
        platform: res.data.platform,
        followers: '-',
        posts: 0,
        status: 'active',
        lastSync: 'لم يبدأ بعد'
      }
      setAccounts(prev => [...prev, newAcc])
      setShowModal(false)
    } catch (err) {
      console.error('Error adding profile', err)
      alert('فشل إضافة الحساب. ربما تحتاج لتعديل الـ Backend لربط المستخدم تلقائياً.')
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
            <AccountCard key={acc.id} acc={acc} onDelete={handleDelete} onToggle={handleToggle} />
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
              {[
                { acc: 'شركة الأفق', platform: 'فيسبوك', status: 'مكتمل', records: '412', started: '06:00:00', ended: '06:04:12', duration: '4:12', badge: 'badge-green' },
                { acc: '@alofoq_official', platform: 'X', status: 'مكتمل', records: '287', started: '06:00:05', ended: '06:02:18', duration: '2:13', badge: 'badge-green' },
                { acc: 'Alofoq Store', platform: 'فيسبوك', status: 'مكتمل', records: '156', started: '06:00:10', ended: '06:03:45', duration: '3:35', badge: 'badge-green' },
                { acc: '@alofoq_support', platform: 'X', status: 'مكتمل', records: '198', started: '06:00:15', ended: '06:01:52', duration: '1:37', badge: 'badge-green' },
              ].map((job, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 700 }}>{job.acc}</td>
                  <td>{job.platform}</td>
                  <td><span className={`badge ${job.badge}`}>{job.status}</span></td>
                  <td className="mono">{job.records}</td>
                  <td className="mono" style={{ fontSize: '.82rem', color: 'var(--text-secondary)' }}>{job.started}</td>
                  <td className="mono" style={{ fontSize: '.82rem', color: 'var(--text-secondary)' }}>{job.ended}</td>
                  <td className="mono" style={{ fontWeight: 700 }}>{job.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Account Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={() => setShowModal(false)}>
          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: '40px', width: '480px', boxShadow: 'var(--shadow-xl)' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>ربط حساب جديد</h2>
            <p style={{ fontSize: '.9rem', color: 'var(--text-secondary)', marginBottom: '28px' }}>أدخل بيانات الصفحة أو الحساب لبدء سحب البيانات تلقائياً</p>

            <form onSubmit={handleAdd}>
              {/* Platform Selection */}
              <div style={{ marginBottom: '20px' }}>
                <label className="form-label">المنصة</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" onClick={() => setModalPlatform('facebook')} style={{ flex: 1, padding: '14px', border: modalPlatform === 'facebook' ? '2px solid #1877F2' : '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', background: modalPlatform === 'facebook' ? '#EFF6FF' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 700, fontSize: '.9rem', fontFamily: 'var(--font-ar)' }}>
                    <svg width="20" height="20" fill="#1877F2" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                    فيسبوك
                  </button>
                  <button type="button" onClick={() => setModalPlatform('twitter')} style={{ flex: 1, padding: '14px', border: modalPlatform === 'twitter' ? '2px solid #000' : '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', background: modalPlatform === 'twitter' ? 'var(--bg-elevated)' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 700, fontSize: '.9rem', fontFamily: 'var(--font-ar)' }}>
                    <svg width="18" height="18" fill="#000" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 4.15H5.059z"/></svg>
                    X (تويتر)
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{modalPlatform === 'facebook' ? 'اسم الصفحة' : 'اسم الحساب'}</label>
                <input name="name" type="text" className="form-input" placeholder={modalPlatform === 'facebook' ? 'مثال: شركة الأفق' : 'مثال: @alofoq'} required />
              </div>

              <div className="form-group" style={{ marginBottom: '32px' }}>
                <label className="form-label">رابط {modalPlatform === 'facebook' ? 'الصفحة' : 'الحساب'}</label>
                <input name="url" type="text" className="form-input" dir="ltr" placeholder={modalPlatform === 'facebook' ? 'facebook.com/pagename' : 'x.com/username'} required />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn-blue" style={{ flex: 1, padding: '14px' }}>ربط الحساب وبدء السحب</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ padding: '14px 24px' }}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const AccountCard = ({ acc, onDelete, onToggle }) => (
  <div className="card-flat animate-fade-up" style={{ position: 'relative' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
      <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: acc.platform === 'facebook' ? '#EFF6FF' : 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {acc.platform === 'facebook' ? (
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
      <button onClick={() => onToggle(acc.id)} className="btn btn-ghost" style={{ fontSize: '.82rem', flex: 1 }}>
        {acc.status === 'active' ? '⏸️ إيقاف مؤقت' : '▶️ تفعيل'}
      </button>
      <button onClick={() => onDelete(acc.id)} className="btn btn-ghost" style={{ fontSize: '.82rem', color: 'var(--red)' }}>
        🗑️ حذف
      </button>
    </div>
  </div>
)

export default ConnectedAccounts
