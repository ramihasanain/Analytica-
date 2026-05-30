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
  const { t, isRTL, pageProps } = useDashPage()

  useEffect(() => {
    fetchProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        password: ''
      })
    } catch (err) {
      console.error(err)
      setMessage({ text: t('profLoadError'), type: 'error' })
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
        setMessage({ text: t('profPasswordError'), type: 'error' })
        return
      }
    }

    setSaving(true)
    setMessage({ text: '', type: '' })

    try {
      const payload = { ...formData }
      if (!payload.password) {
        delete payload.password
      }

      await api.patch('/users/me/', payload)
      setMessage({ text: t('profSaveSuccess'), type: 'success' })
      setFormData(prev => ({ ...prev, password: '' }))
    } catch (err) {
      console.error(err)
      setMessage({ text: err.response?.data?.error || t('profSaveError'), type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div {...pageProps}>
        <DashLoading text={t('profLoading')} />
      </div>
    )
  }

  const pwCheckDir = isRTL ? 'rtl' : 'ltr'
  const pwCheckAlign = isRTL ? 'right' : 'left'

  return (
    <div {...pageProps} style={{ ...pageProps.style, maxWidth: 720 }}>
      <PageHero title={t('dbProfile')} subtitle={t('profSubtitle')} />

      {message.text && (
        <DashAlert variant={message.type === 'success' ? 'success' : 'error'}>{message.text}</DashAlert>
      )}

      <DashCard>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">{t('authUsername')}</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} className="form-input" dir="ltr" required />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">{t('authEmail')}</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" dir="ltr" required />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">{t('authCompanyName')}</label>
            <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} className="form-input" />
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
              <label className="form-label">{t('authCountry')}</label>
              <input type="text" name="country" value={formData.country} onChange={handleChange} className="form-input" />
            </div>

            <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
              <label className="form-label">{t('authPhoneNumber')}</label>
              <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} className="form-input" dir="ltr" />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0, marginTop: '12px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
            <label className="form-label">{t('profPasswordOptional')}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              dir="ltr"
              placeholder={t('profPasswordPlaceholder')}
            />

            {formData.password && (() => {
              const pwValidation = passwordCriteria(formData.password)
              return (
                <div style={{ marginTop: '12px', fontSize: '.85rem', direction: pwCheckDir, textAlign: pwCheckAlign, animation: 'fadeIn 0.3s ease' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', height: '4px' }}>
                    {[1, 2, 3, 4, 5].map((level) => {
                      const active = pwValidation.strength >= level
                      let color = 'var(--border)'
                      if (active) {
                        if (pwValidation.strength <= 2) color = 'var(--red)'
                        else if (pwValidation.strength <= 4) color = 'var(--amber)'
                        else color = 'var(--green)'
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
                      )
                    })}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{t('authPasswordStrength')}</span>
                    <span style={{
                      fontWeight: 700,
                      color: pwValidation.strength <= 2 ? 'var(--red)' : pwValidation.strength <= 4 ? 'var(--amber)' : 'var(--green)'
                    }}>
                      {pwValidation.strength <= 2 ? t('authStrengthWeak') : pwValidation.strength <= 4 ? t('authStrengthMedium') : t('authStrengthStrong')}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'var(--bg-elevated)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', textAlign: pwCheckAlign }}>
                    {[
                      { ok: pwValidation.length, label: t('authCriteriaLength') },
                      { ok: pwValidation.lowercase, label: t('authCriteriaLowercase') },
                      { ok: pwValidation.uppercase, label: t('authCriteriaUppercase') },
                      { ok: pwValidation.number, label: t('authCriteriaNumber') },
                      { ok: pwValidation.special, label: t('authCriteriaSpecial') },
                      { ok: pwValidation.noSequence, label: t('authCriteriaNoSeq') },
                    ].map(({ ok, label }) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: ok ? 'var(--green)' : 'var(--text-secondary)', transition: 'color 0.2s', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
                        <span>{label}</span>
                        <span style={{ fontWeight: 'bold' }}>{ok ? '✓' : '○'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}
          </div>

          <div style={{ marginTop: '12px', display: 'flex', justifyContent: isRTL ? 'flex-start' : 'flex-end' }}>
            <button
              type="submit"
              className="dash-btn dash-btn-primary"
              disabled={saving}
              style={{ minWidth: 140, opacity: saving ? 0.7 : 1 }}
            >
              {saving ? t('profSaving') : t('profSaveBtn')}
            </button>
          </div>
        </form>
      </DashCard>
    </div>
  )
}

export default Profile
