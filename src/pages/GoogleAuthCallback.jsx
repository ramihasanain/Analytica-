import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useLanguage } from '../LanguageContext'
import { handleAuthResponse } from '../utils/authFlow'

const GoogleAuthCallback = () => {
  const { t, isRTL } = useLanguage()
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setStatus(t('authGoogleConnecting'))

    const processCallback = async () => {
      const searchParams = new URLSearchParams(location.search)
      const code = searchParams.get('code')
      const oauthError = searchParams.get('error')

      if (oauthError) {
        setError(`${t('authGoogleError')}: ${oauthError}`)
        setTimeout(() => navigate('/auth', { replace: true }), 3000)
        return
      }

      if (!code) {
        setError(t('authGoogleNoCode'))
        setTimeout(() => navigate('/auth', { replace: true }), 3000)
        return
      }

      try {
        const res = await api.post('/auth/google/callback/', { code })
        if (handleAuthResponse(res.data, navigate)) return
        setError(t('authError'))
        setTimeout(() => navigate('/auth', { replace: true }), 3000)
      } catch (err) {
        const msg = err.response?.data?.error || t('authGoogleFail')
        setError(msg)
        setTimeout(() => navigate('/auth', { replace: true }), 3500)
      }
    }

    processCallback()
  }, [location.search, navigate, t])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: isRTL ? 'var(--font-ar)' : 'var(--font-en)', direction: isRTL ? 'rtl' : 'ltr' }}>
      <div className="card-flat" style={{ padding: '40px', textAlign: 'center', maxWidth: '420px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{error ? '⚠️' : '🔄'}</div>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>{error || status}</h2>
        {!error && <p style={{ color: 'var(--text-secondary)', fontSize: '.9rem' }}>{t('authGoogleWait')}</p>}
      </div>
    </div>
  )
}

export default GoogleAuthCallback
