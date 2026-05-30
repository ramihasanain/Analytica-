import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useLanguage } from '../../LanguageContext';

const OAuthCallback = () => {
  const { t, isRTL } = useLanguage();
  const [status, setStatus] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  
  const platform = 'facebook';

  useEffect(() => {
    setStatus(t('oauthConnecting'));
    const processCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        setStatus(`${t('oauthErrorPrefix')} ${error}`);
        setTimeout(() => navigate('/dashboard/accounts'), 3000);
        return;
      }

      if (!code) {
        setStatus(t('oauthNoCode'));
        setTimeout(() => navigate('/dashboard/accounts'), 3000);
        return;
      }

      try {
        await api.post(`/oauth/${platform}/callback/`, { code });
        setStatus(t('oauthSuccess'));
        setTimeout(() => navigate('/dashboard/accounts'), 2000);
      } catch (err) {
        console.error('Callback error:', err);
        setStatus(t('oauthFail'));
        setTimeout(() => navigate('/dashboard/accounts'), 3000);
      }
    };

    processCallback();
  }, [location, navigate, platform]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', fontFamily: isRTL ? 'var(--font-ar)' : 'var(--font-en)', direction: isRTL ? 'rtl' : 'ltr' }}>
      <div className="card-flat" style={{ padding: '40px', textAlign: 'center', maxWidth: '400px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔄</div>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>{status}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '.9rem' }}>{t('oauthWait')}</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
