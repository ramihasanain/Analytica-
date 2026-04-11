import { Link, NavLink, Outlet } from 'react-router-dom'

const DashboardLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', background: 'var(--bg-card)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 50 }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.png" alt="Analytica Logo" style={{ height: '32px', borderRadius: '6px', objectFit: 'contain' }} />
          </div>
        </div>

        <div style={{ padding: '20px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ padding: '0 16px', marginBottom: '8px' }}>
            <span style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>الرئيسية</span>
          </div>

          <NavLink to="/dashboard" end className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <svg className="icon-md" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" /></svg>
            نظرة عامة
          </NavLink>

          <NavLink to="/dashboard/posts" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <svg className="icon-md" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
            المنشورات والتعليقات
          </NavLink>

          <NavLink to="/dashboard/sentiment" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <svg className="icon-md" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
            تحليل المشاعر
          </NavLink>

          <NavLink to="/dashboard/accounts" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <svg className="icon-md" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-3.09a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.34" /></svg>
            الحسابات المربوطة
          </NavLink>

          <div style={{ padding: '0 16px', marginTop: '24px', marginBottom: '8px' }}>
            <span style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>النظام</span>
          </div>

          <NavLink to="/dashboard/reports" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <svg className="icon-md" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
            التقارير
          </NavLink>
        </div>

        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--blue-light)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '.85rem' }}>م</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '.88rem', fontWeight: 700 }}>محمد أحمد</div>
              <div style={{ fontSize: '.75rem', color: 'var(--text-tertiary)' }}>الخطة الاحترافية</div>
            </div>
            <Link to="/" style={{ color: 'var(--text-tertiary)' }}>
              <svg className="icon-sm" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginRight: '260px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ flex: 1, padding: '32px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout
