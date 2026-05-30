import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useDashPage, PageHero, DashCard, DashLoading, DashAlert } from '../../components/dashboard/DashboardUI'

const passwordCriteria = (password) => {
  if (!password) return {
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
    noSequence: false,
    isValid: false,
    strength: 0,
  }

  const length = password.length >= 8
  const lowercase = /[a-z]/.test(password)
  const uppercase = /[A-Z]/.test(password)
  const number = /\d/.test(password)
  const special = /[@$!%*?&#^()_\-+={[\]}|:;\"'<>,./?`~]/.test(password)
  
  const uniqueChars = new Set(password).size
  const isTooRepetitive = password.length >= 5 && uniqueChars <= 2

  const digits = password.replace(/\D/g, '')
  let hasSequence = false
  if (digits.length >= 5) {
    for (let i = 0; i <= digits.length - 5; i++) {
      const seq = digits.slice(i, i + 5)
      if ("01234567890".includes(seq) || "98765432109".includes(seq)) {
        hasSequence = true
        break
      }
    }
  }
  const noSequence = !isTooRepetitive && !hasSequence

  let score = 0
  if (length) score++
  if (lowercase && uppercase) score++
  if (number) score++
  if (special) score++
  if (noSequence && password.length >= 8) score++

  const isValid = length && lowercase && uppercase && number && special && noSequence

  return {
    length,
    lowercase,
    uppercase,
    number,
    special,
    noSequence,
    isValid,
    strength: Math.min(score, 5)
  }
}

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
    
    if (formData.password) {
      const val = passwordCriteria(formData.password)
      if (!val.isValid) {
        setMessage({ text: 'يرجى التأكد من استيفاء جميع شروط كلمة المرور المعقدة قبل حفظ التغييرات.', type: 'error' })
        return
      }
    }

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

  const { pageProps } = useDashPage()

  if (loading) {
    return (
      <div {...pageProps}>
        <DashLoading text="جاري تحميل الملف الشخصي..." />
      </div>
    )
  }

  return (
    <div {...pageProps} style={{ ...pageProps.style, maxWidth: 720 }}>
      <PageHero title="الملف الشخصي" subtitle="تحديث بيانات حسابك ومعلومات الشركة." />

      {message.text && (
        <DashAlert variant={message.type === 'success' ? 'success' : 'error'}>{message.text}</DashAlert>
      )}

      <DashCard>
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
            
            {formData.password && (() => {
              const pwValidation = passwordCriteria(formData.password);
              return (
                <div style={{ marginTop: '12px', fontSize: '.85rem', direction: 'rtl', textAlign: 'right', animation: 'fadeIn 0.3s ease' }}>
                  {/* Strength Meter Bar */}
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', height: '4px' }}>
                    {[1, 2, 3, 4, 5].map((level) => {
                      const active = pwValidation.strength >= level;
                      let color = 'var(--border)';
                      if (active) {
                        if (pwValidation.strength <= 2) color = 'var(--red)';
                        else if (pwValidation.strength <= 4) color = 'var(--amber)';
                        else color = 'var(--green)';
                      }
                      return (
                        <div 
                          key={level} 
                          style={{ 
                            flex: 1, 
                            background: color, 
                            borderRadius: '2px',
                            transition: 'background 0.3s ease'
                          }} 
                        />
                      );
                    })}
                  </div>
                  
                  {/* Strength Text Indicator */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>قوة كلمة المرور:</span>
                    <span style={{ 
                      fontWeight: 700,
                      color: pwValidation.strength <= 2 ? 'var(--red)' : pwValidation.strength <= 4 ? 'var(--amber)' : 'var(--green)'
                    }}>
                      {pwValidation.strength <= 2 ? 'ضعيفة' : pwValidation.strength <= 4 ? 'متوسطة' : 'قوية جداً'}
                    </span>
                  </div>
                  
                  {/* Checklist */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'var(--bg-elevated)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: pwValidation.length ? 'var(--green)' : 'var(--text-secondary)', transition: 'color 0.2s' }}>
                      <span style={{ fontWeight: 'bold' }}>{pwValidation.length ? '✓' : '○'}</span>
                      <span>8 رموز على الأقل</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: pwValidation.lowercase ? 'var(--green)' : 'var(--text-secondary)', transition: 'color 0.2s' }}>
                      <span style={{ fontWeight: 'bold' }}>{pwValidation.lowercase ? '✓' : '○'}</span>
                      <span>حروف صغيرة (a-z)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: pwValidation.uppercase ? 'var(--green)' : 'var(--text-secondary)', transition: 'color 0.2s' }}>
                      <span style={{ fontWeight: 'bold' }}>{pwValidation.uppercase ? '✓' : '○'}</span>
                      <span>حروف كبيرة (A-Z)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: pwValidation.number ? 'var(--green)' : 'var(--text-secondary)', transition: 'color 0.2s' }}>
                      <span style={{ fontWeight: 'bold' }}>{pwValidation.number ? '✓' : '○'}</span>
                      <span>أرقام (0-9)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: pwValidation.special ? 'var(--green)' : 'var(--text-secondary)', transition: 'color 0.2s' }}>
                      <span style={{ fontWeight: 'bold' }}>{pwValidation.special ? '✓' : '○'}</span>
                      <span>رموز خاصة (@، !، $)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: pwValidation.noSequence ? 'var(--green)' : 'var(--text-secondary)', transition: 'color 0.2s' }}>
                      <span style={{ fontWeight: 'bold' }}>{pwValidation.noSequence ? '✓' : '○'}</span>
                      <span>أرقام غير متسلسلة عادية</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className="dash-btn dash-btn-primary"
              disabled={saving}
              style={{ minWidth: 140, opacity: saving ? 0.7 : 1 }}
            >
              {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </div>
        </form>
      </DashCard>
    </div>
  )
}

export default Profile
