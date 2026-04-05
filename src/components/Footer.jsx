const Footer = () => {
  return (
    <footer style={{ marginTop: '100px', borderTop: '1px solid var(--border)', padding: '60px 0', background: 'var(--bg-card)' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            <div className="logo" style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '8px' }}>
                <img src="/logo.png" alt="Analytica Logo" style={{ height: '40px', borderRadius: '8px', objectFit: 'contain' }} />
            </div>
            <div style={{ display: 'flex', gap: '32px', marginBottom: '16px' }}>
                <a href="#" style={{ color: 'var(--text-light)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>الشروط والأحكام</a>
                <a href="#" style={{ color: 'var(--text-light)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>الخصوصية</a>
                <a href="#" style={{ color: 'var(--text-light)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>تواصل معنا</a>
            </div>
            <p style={{ margin: 0, color: '#9CA3AF', fontSize: '0.95rem' }}>مبني بكل تفاني لتسهيل متابعتك لزباينك &copy; 2026</p>
        </div>
    </footer>
  )
}
export default Footer
