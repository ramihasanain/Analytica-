import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const OAuthCallback = () => {
  const [status, setStatus] = useState('جاري معالجة الربط...');
  const location = useLocation();
  const navigate = useNavigate();
  
  const platform = location.pathname.includes('facebook') ? 'facebook' : 'x';

  useEffect(() => {
    const processCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        setStatus(`حدث خطأ أثناء الربط: ${error}`);
        setTimeout(() => navigate('/dashboard/accounts'), 3000);
        return;
      }

      if (!code) {
        setStatus('لم يتم العثور على رمز التفويض.');
        setTimeout(() => navigate('/dashboard/accounts'), 3000);
        return;
      }

      try {
        await api.post(`/oauth/${platform}/callback/`, { code });
        setStatus('تم الربط بنجاح! جاري التوجيه...');
        setTimeout(() => navigate('/dashboard/accounts'), 2000);
      } catch (err) {
        console.error('Callback error:', err);
        setStatus('فشل في إتمام عملية الربط. يرجى المحاولة لاحقاً.');
        setTimeout(() => navigate('/dashboard/accounts'), 3000);
      }
    };

    processCallback();
  }, [location, navigate, platform]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="card-flat" style={{ padding: '40px', textAlign: 'center', maxWidth: '400px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔄</div>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>{status}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '.9rem' }}>يرجى الانتظار، لا تقم بإغلاق هذه الصفحة.</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
