import { Link } from 'react-router-dom'
import { useLanguage } from '../LanguageContext'

const Pricing = () => {
  const { t, lang, toggleLang, isRTL } = useLanguage()

  const plans = [
    {
      name: t('pricingFreeName'),
      price: '0',
      period: t('pricingFreePeriod'),
      desc: t('pricingFreeDesc'),
      featured: false,
      features: [
        t('pricingFeatureFree1'),
        t('pricingFeatureFree6'),
        t('pricingFeatureFree7'),
        t('pricingFeatureFree8'),
        t('pricingFeatureFree5'),
      ],
      cta: t('navStartFree'),
    },
    {
      name: t('pricingProName'),
      price: '49',
      period: t('pricingProPeriod'),
      desc: t('pricingProDesc'),
      featured: true,
      features: [
        t('pricingFeaturePro1'),
        t('pricingFeaturePro2'),
        t('pricingFeaturePro3'),
        t('pricingFeaturePro4'),
        t('pricingFeaturePro5'),
        t('pricingFeaturePro6'),
        t('pricingFeaturePro7'),
      ],
      cta: t('pricingProName'),
    },
    {
      name: t('pricingEnterpriseName'),
      price: '199',
      period: t('pricingEnterprisePeriod'),
      desc: t('pricingEnterpriseDesc'),
      featured: false,
      features: [
        t('pricingFeatureEnterprise1'),
        t('pricingFeatureEnterprise2'),
        t('pricingFeatureEnterprise3'),
        t('pricingFeatureEnterprise4'),
        t('pricingFeatureEnterprise5'),
        t('pricingFeatureEnterprise6'),
        t('pricingFeatureEnterprise7'),
        t('pricingFeatureEnterprise8'),
      ],
      cta: t('pricingEnterpriseName'),
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: isRTL ? 'var(--font-ar)' : 'var(--font-en)' }}>
      {/* Nav */}
      <nav style={{ padding: '20px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', fontFamily: 'var(--font-en)' }}>{t('navBrand')}</span>
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Language Switcher */}
            <button onClick={toggleLang} className="btn" style={{ padding: '6px 12px', borderRadius: '100px', fontSize: '.8rem', fontWeight: 700, cursor: 'pointer', outline: 'none', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-primary)' }}>
              {lang === 'ar' ? 'English 🌐' : 'العربية 🌐'}
            </button>
            <Link to="/auth" className="btn btn-dark" style={{ padding: '8px 20px', fontSize: '.9rem' }}>{t('navLogin')}</Link>
          </div>
        </div>
      </nav>

      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <span className="badge badge-blue" style={{ marginBottom: '16px' }}>{t('pricingHeaderBadge')}</span>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '16px' }}>{t('pricingHeaderTitle')}</h1>
        <p style={{ fontSize: '1.1rem', maxWidth: '520px', marginInline: 'auto', marginBottom: '64px' }}>
          {t('pricingHeaderDesc')}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '1000px', marginInline: 'auto', alignItems: 'stretch' }}>
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
              textAlign: isRTL ? 'right' : 'left'
            }}>
              {plan.featured && (
                <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--blue)', color: '#fff', padding: '4px 16px', borderRadius: '100px', fontSize: '.8rem', fontWeight: 700 }}>{t('pricingPopular')}</span>
              )}
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{plan.name}</h3>
              <p style={{ fontSize: '.9rem', marginBottom: '24px', color: 'var(--text-secondary)' }}>{plan.desc}</p>
              <div style={{ marginBottom: '32px' }}>
                <span className="mono" style={{ fontSize: '3rem', fontWeight: 800 }}>${plan.price}</span>
                <span style={{ fontSize: '.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}> {plan.period}</span>
              </div>
              <ul className="pricing-list" style={{ listStyle: 'none', flex: 1, marginBottom: '32px' }}>
                {plan.features.map((f, j) => (
                  <li key={j} style={{ padding: '10px 0', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '.92rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                    <svg width="16" height="16" fill="none" stroke={plan.featured ? 'var(--blue)' : 'var(--green)'} strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/auth" className={`btn ${plan.featured ? 'btn-blue' : 'btn-outline'}`} style={{ width: '100%', padding: '14px', fontSize: '1rem', textAlign: 'center' }}>
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
