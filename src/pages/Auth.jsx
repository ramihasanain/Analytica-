import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

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

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ username: '', email: '', password: '', company_name: '', country: '', phone_number: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!isLogin) {
      const val = passwordCriteria(formData.password)
      if (!val.isValid) {
        setError('يرجى التأكد من استيفاء جميع شروط كلمة المرور المعقدة قبل المتابعة.')
        return
      }
    }

    setLoading(true)

    try {
      if (isLogin) {
        // Login
        const res = await api.post('/token-auth/', {
          username: formData.username,
          password: formData.password
        })
        localStorage.setItem('token', res.data.access)
        localStorage.setItem('refresh', res.data.refresh)
        navigate('/dashboard')
      } else {
        // Signup (assuming user-list supports POST for registration)
        // Adjust fields based on the CustomUserSerializer
        const res = await api.post('/users/', {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          company_name: formData.company_name,
          country: formData.country,
          phone_number: formData.phone_number
        })
        // Automatically login after signup (optional)
        const loginRes = await api.post('/token-auth/', {
          username: formData.username,
          password: formData.password
        })
        localStorage.setItem('token', loginRes.data.access)
        localStorage.setItem('refresh', loginRes.data.refresh)
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.non_field_errors?.[0] || 'حدث خطأ يرجى المحاولة مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left visual panel */}
      <div style={{ flex: 1, background: 'var(--bg-hero)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(96,165,250,.2), transparent 70%)', filter: 'blur(60px)' }}></div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '48px' }}>
            <img src="/logo.png" alt="Analytica Logo" style={{ height: '36px', borderRadius: '6px', objectFit: 'contain' }} />
          </div>
          <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '16px', lineHeight: 1.4 }}>حلّل مشاعر جمهورك<br />واتخذ قرارات أذكى</h2>
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '1rem', lineHeight: 1.8, maxWidth: '400px' }}>اربط صفحاتك على فيسبوك و X واحصل على تحليلات يومية تلقائية للمنشورات والتعليقات.</p>

          <div style={{ marginTop: '48px', display: 'flex', gap: '32px' }}>
            {[
              { val: '200+', label: 'شركة' },
              { val: '2M+', label: 'منشور محلّل' },
              { val: '99.9%', label: 'وقت تشغيل' },
            ].map((s, i) => (
              <div key={i}>
                <div className="mono" style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800 }}>{s.val}</div>
                <div style={{ color: 'rgba(255,255,255,.4)', fontSize: '.85rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ width: '520px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', background: 'var(--bg-card)' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>{isLogin ? 'مرحباً بعودتك' : 'إنشاء حساب جديد'}</h2>
        <p style={{ fontSize: '.95rem', marginBottom: '32px' }}>{isLogin ? 'سجّل دخولك للوصول إلى لوحة التحليلات' : 'ابدأ رحلتك في فهم جمهورك الآن'}</p>

        {error && <div style={{ background: 'var(--red-light)', color: 'var(--red)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">اسم المستخدم</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} className="form-input" placeholder="مثال: admin123" required />
            </div>
          )}
          {isLogin && (
             <div className="form-group">
               <label className="form-label">اسم المستخدم</label>
               <input type="text" name="username" value={formData.username} onChange={handleChange} className="form-input" dir="ltr" placeholder="admin123" required />
             </div>
          )}
          {!isLogin && (
            <>
              <div className="form-group">
                <label className="form-label">البريد الإلكتروني</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" dir="ltr" placeholder="admin@company.com" required />
              </div>
              <div className="form-group">
                <label className="form-label">اسم الشركة</label>
                <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} className="form-input" placeholder="اسم الشركة" required />
              </div>
              <div className="form-group">
                <label className="form-label">الدولة</label>
                <input type="text" name="country" value={formData.country} onChange={handleChange} className="form-input" placeholder="الدولة" required />
              </div>
              <div className="form-group">
                <label className="form-label">رقم الهاتف</label>
                <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} className="form-input" dir="ltr" placeholder="رقم الهاتف" required />
              </div>
            </>
          )}
          <div className="form-group">
            <label className="form-label">كلمة المرور</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-input" dir="ltr" placeholder="••••••••" required />
            
            {!isLogin && formData.password && (() => {
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
          <button type="submit" className="btn btn-dark" disabled={loading} style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '8px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'جاري التحميل...' : (isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '.9rem' }}>
            {isLogin ? 'ليس لديك حساب؟ ' : 'لديك حساب بالفعل؟ '}
          </span>
          <span onClick={() => setIsLogin(!isLogin)} style={{ color: 'var(--blue)', fontWeight: 700, cursor: 'pointer', fontSize: '.9rem' }}>
            {isLogin ? 'إنشاء حساب' : 'تسجيل الدخول'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Auth
