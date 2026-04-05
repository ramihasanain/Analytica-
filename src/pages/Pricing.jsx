import { Link } from 'react-router-dom'

const plans = [
  {
    name: 'مجاني',
    price: '0',
    period: 'للأبد',
    desc: 'مثالي لتجربة المنصة قبل الالتزام',
    featured: false,
    features: [
      'صفحة واحدة (فيسبوك أو X)',
      'سحب تلقائي كل 24 ساعة',
      'تحليل مشاعر أساسي',
      'آخر 7 أيام فقط',
      '100 منشور شهرياً',
    ],
    cta: 'ابدأ مجاناً',
  },
  {
    name: 'احترافي',
    price: '49',
    period: '/ شهرياً',
    desc: 'للشركات الناشئة التي تريد فهم جمهورها',
    featured: true,
    features: [
      'حتى 5 صفحات متصلة',
      'سحب تلقائي كل 24 ساعة',
      'تحليل مشاعر متقدم + مواضيع',
      'أرشيف 90 يوماً',
      '5,000 منشور شهرياً',
      'تقارير PDF قابلة للتصدير',
      'تنبيهات المشاعر السلبية',
    ],
    cta: 'اختر الاحترافي',
  },
  {
    name: 'مؤسسات',
    price: '199',
    period: '/ شهرياً',
    desc: 'للشركات الكبيرة التي تدير عدة علامات تجارية',
    featured: false,
    features: [
      'صفحات غير محدودة',
      'سحب مستمر كل 24 ساعة',
      'تحليل عميق + كشف الأزمات',
      'أرشيف غير محدود',
      'منشورات غير محدودة',
      'API مفتوح للتكامل',
      'دعم فني مباشر',
      'مدير حساب مخصص',
    ],
    cta: 'تواصل مع المبيعات',
  },
]

const Pricing = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Nav */}
      <nav style={{ padding: '20px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', fontFamily: 'var(--font-en)' }}>Pulse</span>
          </Link>
          <Link to="/auth" className="btn btn-dark" style={{ padding: '8px 20px', fontSize: '.9rem' }}>تسجيل الدخول</Link>
        </div>
      </nav>

      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <span className="badge badge-blue" style={{ marginBottom: '16px' }}>الأسعار والباقات</span>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '16px' }}>خطة لكل حجم أعمال</h1>
        <p style={{ fontSize: '1.1rem', maxWidth: '520px', marginInline: 'auto', marginBottom: '64px' }}>
          ابدأ مجاناً وطوّر حسب نمو احتياجاتك. لا عقود ولا التزامات.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '1000px', marginInline: 'auto' }}>
          {plans.map((plan, i) => (
            <div key={i} className="animate-fade-up" style={{
              animationDelay: `${i * .12}s`,
              background: '#fff',
              border: plan.featured ? '2px solid var(--blue)' : '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '40px 32px',
              display: 'flex', flexDirection: 'column',
              position: 'relative',
              boxShadow: plan.featured ? '0 8px 32px rgba(37,99,235,.12)' : 'var(--shadow-sm)',
              transform: plan.featured ? 'scale(1.03)' : 'none',
            }}>
              {plan.featured && (
                <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--blue)', color: '#fff', padding: '4px 16px', borderRadius: '100px', fontSize: '.8rem', fontWeight: 700 }}>الأكثر شعبية</span>
              )}
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{plan.name}</h3>
              <p style={{ fontSize: '.9rem', marginBottom: '24px' }}>{plan.desc}</p>
              <div style={{ marginBottom: '32px' }}>
                <span className="mono" style={{ fontSize: '3rem', fontWeight: 800 }}>${plan.price}</span>
                <span style={{ fontSize: '.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}> {plan.period}</span>
              </div>
              <ul style={{ listStyle: 'none', textAlign: 'right', flex: 1, marginBottom: '32px' }}>
                {plan.features.map((f, j) => (
                  <li key={j} style={{ padding: '10px 0', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '.92rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                    <svg width="16" height="16" fill="none" stroke={plan.featured ? 'var(--blue)' : 'var(--green)'} strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/auth" className={`btn ${plan.featured ? 'btn-blue' : 'btn-outline'}`} style={{ width: '100%', padding: '14px', fontSize: '1rem' }}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Pricing
