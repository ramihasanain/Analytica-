import { useState, useEffect } from 'react'
import api from '../../services/api'

const Plans = () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [receipt, setReceipt] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [payments, setPayments] = useState([])

  const plans = [
    { name: 'الخطة الأساسية', price: 'مجاناً', features: ['ربط حساب واحد', '100 عملية سحب/يوم', 'دعم فني أساسي'], color: 'var(--blue)' },
    { name: 'الخطة الاحترافية', price: '$49/شهر', features: ['ربط 5 حسابات', 'تحليل مشاعر غير محدود', 'تقارير متقدمة', 'دعم فني 24/7'], color: 'var(--green)' },
    { name: 'خطة المؤسسات', price: '$199/شهر', features: ['حسابات غير محدودة', 'تخصيص كامل', 'مدير حساب مخصص', 'API Access'], color: 'var(--purple)' }
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
    if (!receipt) return alert('الرجاء إرفاق صورة الإيصال')

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
      alert('تم إرسال الطلب بنجاح، بانتظار موافقة الإدارة.')
      setShowModal(false)
      setReceipt(null)
      fetchPayments()
    } catch (err) {
      console.error(err)
      alert('حدث خطأ أثناء الإرسال')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>الاشتراكات والفوترة</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>قم بترقية خطتك للحصول على ميزات إضافية وتقارير متقدمة.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
        {plans.map((plan, i) => (
          <div key={i} className="card-flat" style={{ padding: '32px', display: 'flex', flexDirection: 'column', borderTop: `4px solid ${plan.color}` }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>{plan.name}</h3>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '24px', color: plan.color }}>{plan.price}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', flex: 1 }}>
              {plan.features.map((f, j) => (
                <li key={j} style={{ padding: '8px 0', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" fill="var(--green)" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  {f}
                </li>
              ))}
            </ul>
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', background: plan.color, borderColor: plan.color }}
              onClick={() => handleSubscribe(plan)}
            >
              الاشتراك الآن
            </button>
          </div>
        ))}
      </div>

      <div className="card-flat" style={{ padding: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>سجل المدفوعات والاشتراكات</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>الخطة المطلوبة</th>
              <th>المبلغ</th>
              <th>طريقة الدفع</th>
              <th>الحالة</th>
              <th>التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 700 }}>{p.plan_selected || 'غير محدد'}</td>
                <td className="mono">${p.amount}</td>
                <td>{p.method === 'bank_transfer' ? 'حوالة بنكية' : p.method}</td>
                <td>
                  <span className={`badge ${p.status === 'approved' ? 'badge-green' : p.status === 'rejected' ? 'badge-red' : 'badge-amber'}`}>
                    {p.status === 'approved' ? 'مقبول' : p.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                  </span>
                </td>
                <td className="mono">{new Date(p.paid_at).toLocaleDateString('ar-EG')}</td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-tertiary)' }}>لا يوجد مدفوعات سابقة</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="card-flat animate-fade-up" style={{ width: '450px', padding: '32px' }}>
            <h3 style={{ marginBottom: '16px' }}>تأكيد الاشتراك: {selectedPlan?.name}</h3>
            <p style={{ fontSize: '.9rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
              لإتمام عملية الاشتراك، يرجى تحويل مبلغ <strong style={{ color: 'var(--text)' }}>{selectedPlan?.price}</strong> إلى الحساب البنكي التالي، ثم إرفاق صورة الإيصال ليتم تفعيل الخطة فوراً بعد المراجعة.
            </p>

            <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>البنك:</span>
                <strong>بنك الراجحي</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>الاسم:</span>
                <strong>شركة منصة أناليتيكا</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>الآيبان:</span>
                <strong className="mono" style={{ direction: 'ltr' }}>SA00 0000 0000 0000 0000 0000</strong>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>إرفاق صورة الإيصال (PNG, JPG)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setReceipt(e.target.files[0])}
                  style={{ width: '100%', padding: '10px', border: '1px dashed var(--border-light)', borderRadius: '6px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isSubmitting}>
                  {isSubmitting ? 'جاري الإرسال...' : 'تأكيد الطلب'}
                </button>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)} disabled={isSubmitting}>
                  إلغاء
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
