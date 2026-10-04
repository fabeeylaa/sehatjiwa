import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './DashboardLayout.css';
import logoSehatJiwa from '../assets/Logoosehatjiwa.jpeg';

function DashboardLayout({ user, children, menuItems }) {
  const navigate = useNavigate();
  const location = useLocation();
  const overlayRef = useRef(null);

  const activeSection = menuItems.filter(item => location.pathname === item.path || location.pathname.startsWith(item.path + '/')).sort((a, b) => b.path.length - a.path.length)[0] || menuItems[0];
  const profilePath = user?.role === 'admin' ? '/admin/profile' : '/dashboard/profile';
  const isProfile = location.pathname === profilePath;

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const onOverlayClick = () => navigate(location.pathname, { state: { closeSidebar: true } });
    // simpler: toggle via class on click handled inline; keep focus behavior minimal
  }, [navigate, location]);

  return (
    <div className="shell">
      <div
        className="sidebar-overlay"
        onClick={() => document.querySelector('.sidebar')?.classList.remove('open')}
      ></div>
      <aside className="sidebar">
        <div className="sb-logo">
          <img src={logoSehatJiwa} alt="Logo SehatJiwa" style={{ width: '40px', height: '40px', objectFit: 'contain', flexShrink: 0 }} />
          <span>SehatJiwa</span>
        </div>
        <nav className="sb-nav" aria-label="Navigasi dashboard">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`sb-link ${!isProfile && activeSection.id === item.id ? 'active' : ''}`}
              aria-current={!isProfile && activeSection.id === item.id ? 'page' : undefined}
              onClick={() => {
                navigate(item.path);
                document.querySelector('.sidebar')?.classList.remove('open');
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
          <button className={`sb-link ${isProfile ? 'active' : ''}`} aria-current={isProfile ? 'page' : undefined} onClick={() => {
              navigate(profilePath);
              document.querySelector('.sidebar')?.classList.remove('open');
            }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>Profil</span>
          </button>
        </nav>
        <div className="sb-foot">
          <div className="healthy-mind-pill">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l-1-8z"/></svg>
            <span>Healthy Mind</span>
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="mobile-topbar">
          <button
            className="burger-btn"
            aria-label="Buka menu navigasi"
            onClick={() => document.querySelector('.sidebar')?.classList.add('open')}
          >
            <span></span><span></span><span></span>
          </button>
          <div className="mobile-brand">
            <svg viewBox="0 0 24 24" fill="none" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="var(--primary)"/>
            </svg>
            <span>{isProfile ? 'Profil' : activeSection.label}</span>
          </div>
        </div>
        <div className="content">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
