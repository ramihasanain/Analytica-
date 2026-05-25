import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useLanguage } from '../../LanguageContext'

const Plans = () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [receipt, setReceipt] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [payments, setPayments] = useState([])
  const { t, lang, isRTL } = useLanguage()

  const plans = [
    { 
      name: t('plBasicName'), 
      price: t('plBasicPrice'), 
      features: [t('plBasicFeature1'), t('plBasicFeature2'), t('plBasicFeature3')], 
      color: 'var(--blue)' 
    },
    { 
      name: t('plProName'), 
      price: t('plProPrice'), 
      features: [t('plProFeature1'), t('plProFeature2'), t('plProFeature3'), t('plProFeature4')], 
      color: 'var(--green)' 
    },
    { 
      name: t('plEntName'), 
      price: t('plEntPrice'), 
      features: [t('plEntFeature1'), t('plEntFeature2'), t('plEntFeature3'), t('plEntFeature4')], 
      color: 'var(--purple)' 
    }
  ]

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const res = await api.get('/payments/')
      setPayments(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubscribe = (plan) => {
    setSelectedPlan(plan)
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!receipt) return alert(lang === 'ar' ? 'الرجاء إرفاق صورة الإيصال' : 'Please attach receipt image')

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('plan_selected', selectedPlan.name)
    formData.append('method', 'bank_transfer')
    formData.append('amount', selectedPlan.price.replace(/[^0-9]/g, '') || 0)
    formData.append('receipt_image', receipt)

    try {
      await api.post('/payments/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      alert(lang === 'ar' ? 'تم إرسال الطلب بنجاح، بانتظار موافقة الإدارة.' : 'Request sent successfully, pending admin approval.')
      setShowModal(false)
      setReceipt(null)
      fetchPayments()
    } catch (err) {
      console.error(err)
      alert(lang === 'ar' ? 'حدث خطأ أثناء الإرسال' : 'An error occurred during submission')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ fontFamily: isRTL ? 'var(--font-ar)' : 'var(--font-en)', direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }}>
      <h1 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>{t('plTitle')}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>{t('plSubtitle')}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {plans.map((plan, i) => (
          <div key={i} className="card-flat animate-fade-up" style={{ animationDelay: `${i * .08}s`, padding: '32px', display: 'flex', flexDirection: 'column', borderTop: `4px solid ${plan.color}`, textAlign: isRTL ? 'right' : 'left' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>{plan.name}</h3>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '24px', color: plan.color }}>{plan.price}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', flex: 1 }}>
              {plan.features.map((f, j) => (
                <li key={j} style={{ padding: '8px 0', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '8px', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
                  <svg width="16" height="16" fill="var(--green)" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', background: plan.color, borderColor: plan.color, color: '#fff' }}
              onClick={() => handleSubscribe(plan)}
            >
              {t('plSubscribeNow')}
            </button>
          </div>
        ))}
      </div>

      <div className="card-flat animate-fade-up" style={{ padding: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>{t('plHistoryTitle')}</h3>
        <div className="table-wrap">
          <table className="data-table" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <thead>
              <tr style={{ flexDirection: isRTL ? 'row' : 'row-reverse' }}>
                <th style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('plTablePlan')}</th>
                <th style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('plTableAmount')}</th>
                <th style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('plTableMethod')}</th>
                <th style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('plTableStatus')}</th>
                <th style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('plTableDate')}</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 700 }}>{p.plan_selected || '—'}</td>
                  <td className="mono">${p.amount}</td>
                  <td>{p.method === 'bank_transfer' ? t('plBankTransfer') : p.method}</td>
                  <td>
                    <span className={`badge ${p.status === 'approved' ? 'badge-green' : p.status === 'rejected' ? 'badge-red' : 'badge-amber'}`}>
                      {p.status === 'approved' ? t('plStatusApproved') : p.status === 'rejected' ? t('plStatusRejected') : t('plStatusPending')}
                    </span>
                  </td>
                  <td className="mono">{new Date(p.paid_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-tertiary)' }}>{t('plNoPayments')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={() => setShowModal(false)}>
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '40px', width: '480px', boxShadow: 'var(--shadow-xl)', textAlign: isRTL ? 'right' : 'left' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px' }}>{t('plModalTitle')}{selectedPlan?.name}</h3>
            <p style={{ fontSize: '.9rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
              {t('plModalDesc')}
            </p>

            <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid var(--border)', direction: isRTL ? 'rtl' : 'ltr' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>{t('plBankLabel')}</span>
                <strong>{t('plBankVal')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>{t('plNameLabel')}</span>
                <strong>{t('plNameVal')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>{t('plIbanLabel')}</span>
                <strong className="mono" style={{ direction: 'ltr' }}>SA00 0000 0000 0000 0000 0000</strong>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>{t('plUploadLabel')}</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setReceipt(e.target.files[0])}
                  style={{ width: '100%', padding: '10px', border: '1px dashed var(--border)', borderRadius: '6px', background: 'var(--bg)' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isSubmitting}>
                  {isSubmitting ? t('plSyncing') : t('plConfirmBtn')}
                </button>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)} disabled={isSubmitting}>
                  {t('caCancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Plans
