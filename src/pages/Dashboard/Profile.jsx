import { useState, useEffect } from 'react'
import api from '../../services/api'

const Profile = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    company_name: '',
    country: '',
    phone_number: '',
    password: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/me/')
      setFormData({
        username: res.data.username || '',
        email: res.data.email || '',
        company_name: res.data.company_name || '',
        country: res.data.country || '',
        phone_number: res.data.phone_number || '',
        password: '' // Keep password empty initially
      })
    } catch (err) {
      console.error(err)
      setMessage({ text: 'فشل في جلب بيانات الملف الشخصي.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ text: '', type: '' })

    try {
      // Don't send empty password if it's not being changed
      const payload = { ...formData }
      if (!payload.password) {
        delete payload.password
      }

      await api.patch('/users/me/', payload)
      setMessage({ text: 'تم تحديث الملف الشخصي بنجاح.', type: 'success' })
      
      // Clear password field after successful update
      setFormData(prev => ({ ...prev, password: '' }))
    } catch (err) {
      console.error(err)
      setMessage({ text: err.response?.data?.error || 'حدث خطأ أثناء حفظ البيانات.', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div style={{ padding: '24px' }}>جاري تحميل الملف الشخصي...</div>
  }

  return (
    <div style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>الملف الشخصي</h1>
        <p style={{ color: 'var(--text-secondary)' }}>تحديث بيانات حسابك ومعلومات الشركة.</p>
      </div>

      {message.text && (
        <div style={{
          padding: '12px 16px',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '24px',
          background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'var(--red-light)',
          color: message.type === 'success' ? '#22c55e' : 'var(--red)',
          border: `1px solid ${message.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
        }}>
          {message.text}
        </div>
      )}

      <div className="card" style={{ padding: '24px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">اسم المستخدم</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} className="form-input" dir="ltr" required />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">البريد الإلكتروني</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" dir="ltr" required />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">اسم الشركة</label>
            <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} className="form-input" />
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
              <label className="form-label">الدولة</label>
              <input type="text" name="country" value={formData.country} onChange={handleChange} className="form-input" />
            </div>

            <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
              <label className="form-label">رقم الهاتف</label>
              <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} className="form-input" dir="ltr" />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0, marginTop: '12px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
            <label className="form-label">تغيير كلمة المرور (اختياري)</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              className="form-input" 
              dir="ltr" 
              placeholder="اتركه فارغاً إذا لم ترغب بتغييره" 
            />
          </div>

          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              type="submit" 
              className="btn btn-dark" 
              disabled={saving}
              style={{ minWidth: '120px', opacity: saving ? 0.7 : 1 }}
            >
              {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile
