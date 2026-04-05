import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav style={{ padding: '16px 0', background: 'var(--bg-panel)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-blue)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg className="icon-md" style={{ color: 'var(--accent-blue)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                <img src="/logo.png" alt="Analytica Logo" style={{ height: '36px', borderRadius: '6px', objectFit: 'contain' }} />
            </Link>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <Link to="/pricing" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>الأسعار والتراخيص</Link>
                <div style={{display: 'flex', gap: '8px', borderRight: '1px solid var(--border-color)', paddingRight: '24px'}}>
                    <Link to="/auth" className="btn btn-secondary" style={{padding: '6px 16px', fontSize: '0.85rem'}}>الولوج للنظام</Link>
                    <Link to="/auth" className="btn btn-primary" style={{padding: '6px 16px', fontSize: '0.85rem'}}>الاشتراك المؤسسي</Link>
                </div>
            </div>
        </div>
    </nav>
  )
}
export default Navbar
