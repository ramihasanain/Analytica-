import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import api from '../../services/api'
import { useLanguage } from '../../LanguageContext'

const navIcon = (d) => (
  <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">{d}</svg>
)

const DashboardLayout = () => {
  const [user, setUser] = useState(null)
  const { t, lang, toggleLang, isRTL } = useLanguage()

  useEffect(() => {
    api.get('/users/me/').then(res => setUser(res.data)).catch(console.error)
  }, [])

  const navItems = [
    { section: t('dbHome'), links: [
      { to: '/dashboard', end: true, label: t('dbOverview'), icon: navIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" />) },
      { to: '/dashboard/posts', label: t('dbPosts'), icon: navIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />) },
      { to: '/dashboard/sentiment', label: t('dbSentiment'), icon: navIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />) },
      { to: '/dashboard/accounts', label: t('dbAccounts'), icon: navIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-3.09a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.34" />) },
    ]},
    { section: t('dbSystem'), links: [
      { to: '/dashboard/plans', label: t('dbPlans'), icon: navIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />) },
      { to: '/dashboard/reports', label: t('dbReports'), icon: navIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />) },
      { to: '/dashboard/operations', label: t('dbOperations'), icon: navIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />) },
      { to: '/dashboard/profile', label: t('dbProfile'), icon: navIcon(<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />) },
    ]},
  ]

  const initial = user?.company_name?.[0] || user?.username?.[0]?.toUpperCase() || 'A'

  return (
    <div className="dash-layout" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: isRTL ? 'var(--font-ar)' : 'var(--font-en)' }}>
      <aside className="dash-sidebar">
        <div className="dash-sidebar-brand">
          <img src="/logo.png" alt="Analytica" />
        </div>

        <nav className="dash-sidebar-nav">
          {navItems.map((group, gi) => (
            <div key={gi}>
              <div className="dash-nav-section">{group.section}</div>
              {group.links.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => `dash-nav-link${isActive ? ' active' : ''}`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="dash-sidebar-foot">
          <button type="button" className="dash-lang-btn" onClick={toggleLang}>
            {lang === 'ar' ? 'English 🌐' : 'العربية 🌐'}
          </button>
          <div className="dash-user-card">
            <div className="dash-user-avatar">{initial}</div>
            <div className="dash-user-info">
              <div className="dash-user-name">{user ? (user.company_name || user.username) : t('dbLoading')}</div>
              <div className="dash-user-plan">{user ? (user.plan_type || t('dbPlanBasic')) : '...'}</div>
            </div>
            <Link to="/" className="dash-logout" title={lang === 'ar' ? 'الخروج' : 'Exit'}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" style={{ transform: isRTL ? 'none' : 'rotate(180deg)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
            </Link>
          </div>
        </div>
      </aside>

      <div className="dash-main">
        <div className="dash-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
