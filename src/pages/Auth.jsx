import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/dashboard')
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

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">اسم الشركة</label>
              <input type="text" className="form-input" placeholder="مثال: شركة الأفق للتقنية" required />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">البريد الإلكتروني</label>
            <input type="email" className="form-input" dir="ltr" placeholder="admin@company.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">كلمة المرور</label>
            <input type="password" className="form-input" dir="ltr" placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn btn-dark" style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '8px' }}>
            {isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب'}
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
