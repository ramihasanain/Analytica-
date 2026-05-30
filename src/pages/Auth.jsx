import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import api from '../services/api'
import { useLanguage } from '../LanguageContext'
import { applyAuthSuccess, handleAuthResponse } from '../utils/authFlow'

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
  const [flow, setFlow] = useState('form')
  const [challengeToken, setChallengeToken] = useState('')
  const [qrImage, setQrImage] = useState('')
  const [manualKey, setManualKey] = useState('')
  const [totpCode, setTotpCode] = useState('')
  const [formData, setFormData] = useState({ username: '', email: '', password: '', company_name: '', country: '', phone_number: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { t, lang, toggleLang, isRTL } = useLanguage()

  useEffect(() => {
    const state = location.state
    if (!state?.flow) return
    if (state.flow === 'totp-setup') {
      setFlow('totp-setup')
      setChallengeToken(state.challengeToken || '')
      setQrImage(state.qrImage || '')
      setManualKey(state.manualKey || '')
    } else if (state.flow === 'totp-verify') {
      setFlow('totp-verify')
      setChallengeToken(state.challengeToken || '')
    }
    window.history.replaceState({}, document.title, location.pathname)
  }, [location])

  const resetToForm = () => {
    setFlow('form')
    setChallengeToken('')
    setQrImage('')
    setManualKey('')
    setTotpCode('')
    setError('')
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!isLogin) {
      const val = passwordCriteria(formData.password)
      if (!val.isValid) {
        setError(t('authCriteriaError'))
        return
      }
    }

    setLoading(true)

    try {
      if (isLogin) {
        const res = await api.post('/auth/login/', {
          username: formData.username,
          password: formData.password
        })
        if (handleAuthResponse(res.data, navigate)) return
        setError(t('authError'))
      } else {
        await api.post('/users/', {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          company_name: formData.company_name,
          country: formData.country,
          phone_number: formData.phone_number
        })
        const loginRes = await api.post('/auth/login/', {
          username: formData.username,
          password: formData.password
        })
        if (handleAuthResponse(loginRes.data, navigate)) return
        setError(t('authError'))
      }
    } catch (err) {
      if (err.response?.data) {
        const data = err.response.data
        if (typeof data === 'string') {
          setError(data)
        } else if (data.error) {
          setError(data.error)
        } else if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
          setError(data.non_field_errors.join(' '))
        } else if (typeof data === 'object') {
          const msgs = Object.entries(data).map(([field, msgs]) => {
            const translationKey = 'auth' + field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')
            const fieldLabel = t(translationKey) !== translationKey ? t(translationKey) : field
            const msgStr = Array.isArray(msgs) ? msgs.join(' ') : String(msgs)
            return `${fieldLabel}: ${msgStr}`
          })
          setError(msgs.join(' | '))
        } else {
          setError(t('authError'))
        }
      } else {
        setError(err.message || t('authError'))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleTotpSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!totpCode.trim()) {
      setError(t('authTotpRequired'))
      return
    }
    setLoading(true)
    try {
      const endpoint = flow === 'totp-setup' ? '/auth/totp/confirm-setup/' : '/auth/totp/verify/'
      const res = await api.post(endpoint, {
        challenge_token: challengeToken,
        code: totpCode.trim(),
      })
      if (applyAuthSuccess(res.data, navigate)) return
      setError(t('authError'))
    } catch (err) {
      setError(err.response?.data?.error || t('authTotpInvalid'))
    } finally {
      setLoading(false)
    }
  }

  const formTitle = flow === 'totp-setup'
    ? t('authTotpSetupTitle')
    : flow === 'totp-verify'
      ? t('authTotpVerifyTitle')
      : (isLogin ? t('authTitleLogin') : t('authTitleRegister'))

  const formSub = flow === 'totp-setup'
    ? t('authTotpSetupSub')
    : flow === 'totp-verify'
      ? t('authTotpVerifySub')
      : (isLogin ? t('authSubLogin') : t('authSubRegister'))

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: isRTL ? 'row' : 'row-reverse', fontFamily: isRTL ? 'var(--font-ar)' : 'var(--font-en)' }}>
      {/* Visual panel */}
      <div style={{ flex: 1, background: 'var(--bg-hero)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', position: 'relative', overflow: 'hidden', textAlign: isRTL ? 'right' : 'left' }}>
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(96,165,250,.2), transparent 70%)', filter: 'blur(60px)' }}></div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '48px', justifyContent: isRTL ? 'flex-start' : 'flex-start' }}>
            <img src="/logo.png" alt="Logo" style={{ height: '36px', borderRadius: '6px', objectFit: 'contain' }} />
          </div>
          <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '16px', lineHeight: 1.4 }}>{t('authLeftHeading1')}<br />{t('authLeftHeading2')}</h2>
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '1rem', lineHeight: 1.8, maxWidth: '400px' }}>{t('authLeftSub')}</p>

          <div style={{ marginTop: '48px', display: 'flex', gap: '32px' }}>
            {[
              { val: '200+', label: t('authLeftStat1') },
              { val: '2M+', label: t('authLeftStat2') },
              { val: '99.9%', label: t('authLeftStat3') },
            ].map((s, i) => (
              <div key={i}>
                <div className="mono" style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800 }}>{s.val}</div>
                <div style={{ color: 'rgba(255,255,255,.4)', fontSize: '.85rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div style={{ width: '520px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', background: 'var(--bg-card)', position: 'relative', textAlign: isRTL ? 'right' : 'left' }}>
        {/* Floating Language Toggler inside Auth */}
        <div style={{ position: 'absolute', top: '24px', left: isRTL ? '24px' : 'auto', right: !isRTL ? '24px' : 'auto' }}>
          <button onClick={toggleLang} className="btn" style={{ padding: '6px 12px', borderRadius: '100px', fontSize: '.8rem', fontWeight: 700, cursor: 'pointer', outline: 'none', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-primary)' }}>
            {lang === 'ar' ? 'English 🌐' : 'العربية 🌐'}
          </button>
        </div>

        <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>{formTitle}</h2>
        <p style={{ fontSize: '.95rem', marginBottom: '32px', color: 'var(--text-secondary)' }}>{formSub}</p>

        {error && <div style={{ background: 'var(--red-light)', color: 'var(--red)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '.9rem' }}>{error}</div>}

        {flow === 'totp-setup' && (
          <form onSubmit={handleTotpSubmit}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              {qrImage ? (
                <img src={qrImage} alt="QR" style={{ width: '200px', height: '200px', borderRadius: '12px', border: '1px solid var(--border)', padding: '8px', background: '#fff' }} />
              ) : (
                <div style={{ padding: '24px', color: 'var(--text-secondary)' }}>{t('dbLoading')}</div>
              )}
              <p style={{ fontSize: '.85rem', color: 'var(--text-secondary)', marginTop: '12px' }}>{t('authTotpScanHint')}</p>
              {manualKey && (
                <div style={{ marginTop: '12px', padding: '10px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', fontSize: '.8rem', wordBreak: 'break-all', direction: 'ltr' }}>
                  <strong>{t('authTotpManualKey')}:</strong> {manualKey}
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">{t('authTotpCode')}</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="form-input"
                dir="ltr"
                placeholder="000000"
                autoComplete="one-time-code"
                required
              />
            </div>
            <button type="submit" className="btn btn-dark" disabled={loading} style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '8px', opacity: loading ? 0.7 : 1 }}>
              {loading ? t('dbLoading') : t('authTotpActivate')}
            </button>
            <button type="button" onClick={resetToForm} className="btn" style={{ width: '100%', padding: '12px', marginTop: '12px' }}>
              {t('authTotpBack')}
            </button>
          </form>
        )}

        {flow === 'totp-verify' && (
          <form onSubmit={handleTotpSubmit}>
            <div className="form-group">
              <label className="form-label">{t('authTotpCode')}</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="form-input"
                dir="ltr"
                placeholder="000000"
                autoComplete="one-time-code"
                required
                autoFocus
              />
            </div>
            <button type="submit" className="btn btn-dark" disabled={loading} style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '8px', opacity: loading ? 0.7 : 1 }}>
              {loading ? t('dbLoading') : t('authBtnLogin')}
            </button>
            <button type="button" onClick={resetToForm} className="btn" style={{ width: '100%', padding: '12px', marginTop: '12px' }}>
              {t('authTotpBack')}
            </button>
          </form>
        )}

        {flow === 'form' && (
        <>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">{t('authUsername')}</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} className="form-input" placeholder="e.g. admin123" required />
            </div>
          )}
          {isLogin && (
             <div className="form-group">
               <label className="form-label">{t('authUsername')}</label>
               <input type="text" name="username" value={formData.username} onChange={handleChange} className="form-input" dir="ltr" placeholder="admin123" required />
             </div>
          )}
          {!isLogin && (
            <>
              <div className="form-group">
                <label className="form-label">{t('authEmail')}</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" dir="ltr" placeholder="admin@company.com" required />
              </div>
              <div className="form-group">
                <label className="form-label">{t('authCompanyName')}</label>
                <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} className="form-input" placeholder={t('authCompanyName')} required />
              </div>
              <div className="form-group">
                <label className="form-label">{t('authCountry')}</label>
                <input type="text" name="country" value={formData.country} onChange={handleChange} className="form-input" placeholder={t('authCountry')} required />
              </div>
              <div className="form-group">
                <label className="form-label">{t('authPhoneNumber')}</label>
                <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} className="form-input" dir="ltr" placeholder={t('authPhoneNumber')} required />
              </div>
            </>
          )}
          <div className="form-group">
            <label className="form-label">{t('authPassword')}</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-input" dir="ltr" placeholder="••••••••" required />
            
            {!isLogin && formData.password && (() => {
              const pwValidation = passwordCriteria(formData.password);
              return (
                <div style={{ marginTop: '12px', fontSize: '.85rem', textAlign: isRTL ? 'right' : 'left', animation: 'fadeIn 0.3s ease' }}>
                  {/* Strength Meter Bar */}
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', height: '4px', flexDirection: 'row' }}>
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
                    <span style={{ color: 'var(--text-secondary)' }}>{t('authPasswordStrength')}</span>
                    <span style={{ 
                      fontWeight: 700,
                      color: pwValidation.strength <= 2 ? 'var(--red)' : pwValidation.strength <= 4 ? 'var(--amber)' : 'var(--green)'
                    }}>
                      {pwValidation.strength <= 2 ? t('authStrengthWeak') : pwValidation.strength <= 4 ? t('authStrengthMedium') : t('authStrengthStrong')}
                    </span>
                  </div>
                  
                  {/* Checklist */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'var(--bg-elevated)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', textAlign: isRTL ? 'right' : 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: pwValidation.length ? 'var(--green)' : 'var(--text-secondary)', transition: 'color 0.2s', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
                      <span>{t('authCriteriaLength')}</span>
                      <span style={{ fontWeight: 'bold' }}>{pwValidation.length ? '✓' : '○'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: pwValidation.lowercase ? 'var(--green)' : 'var(--text-secondary)', transition: 'color 0.2s', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
                      <span>{t('authCriteriaLowercase')}</span>
                      <span style={{ fontWeight: 'bold' }}>{pwValidation.lowercase ? '✓' : '○'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: pwValidation.uppercase ? 'var(--green)' : 'var(--text-secondary)', transition: 'color 0.2s', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
                      <span>{t('authCriteriaUppercase')}</span>
                      <span style={{ fontWeight: 'bold' }}>{pwValidation.uppercase ? '✓' : '○'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: pwValidation.number ? 'var(--green)' : 'var(--text-secondary)', transition: 'color 0.2s', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
                      <span>{t('authCriteriaNumber')}</span>
                      <span style={{ fontWeight: 'bold' }}>{pwValidation.number ? '✓' : '○'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: pwValidation.special ? 'var(--green)' : 'var(--text-secondary)', transition: 'color 0.2s', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
                      <span>{t('authCriteriaSpecial')}</span>
                      <span style={{ fontWeight: 'bold' }}>{pwValidation.special ? '✓' : '○'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: pwValidation.noSequence ? 'var(--green)' : 'var(--text-secondary)', transition: 'color 0.2s', flexDirection: isRTL ? 'row' : 'row-reverse' }}>
                      <span>{t('authCriteriaNoSeq')}</span>
                      <span style={{ fontWeight: 'bold' }}>{pwValidation.noSequence ? '✓' : '○'}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
          <button type="submit" className="btn btn-dark" disabled={loading} style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '8px', opacity: loading ? 0.7 : 1 }}>
            {loading ? t('dbLoading') : (isLogin ? t('authBtnLogin') : t('authBtnRegister'))}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '.9rem' }}>
            {isLogin ? (t('authSwitchToRegister').split(/[?؟]/)[0] + (isRTL ? '؟' : '?')) : (t('authSwitchToLogin').split(/[?؟]/)[0] + (isRTL ? '؟' : '?'))}
          </span>
          <span onClick={() => setIsLogin(!isLogin)} style={{ color: 'var(--blue)', fontWeight: 700, cursor: 'pointer', fontSize: '.9rem' }}>
            {' '}{isLogin ? t('authSwitchToRegister').split(/[?؟]/)[1] : t('authSwitchToLogin').split(/[?؟]/)[1]}
          </span>
        </div>
        </>
        )}

        {flow !== 'form' && (
        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '.85rem', lineHeight: 1.6 }}>{t('authTotpExistingNote')}</p>
        </div>
        )}
      </div>
    </div>
  )
}

export default Auth
