import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './DashboardLayout.css';

function DashboardLayout({ user, children, menuItems }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const activeSection = menuItems.find(item => location.pathname === item.path || location.pathname.startsWith(item.path + '/')) || menuItems[0];

  return (
    <div className="shell">
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)}></div>
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sb-logo">
          <svg viewBox="0 0 24 24" fill="none"><path d="M12 2C8 5 5 9 5 13a7 7 0 0014 0c0-4-3-8-7-11z" fill="#2F4B3C"/></svg>
          <span>SehatJiwa</span>
        </div>
        <nav className="sb-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`sb-link ${activeSection.id === item.id ? 'active' : ''}`}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sb-foot">
          <div className="sb-user" onClick={async () => {
            await fetch('/api/auth/logout', { method: 'POST' });
            navigate('/auth');
          }} title="Klik untuk keluar">
            <div className="sb-avatar">{user?.name?.substring(0, 2).toUpperCase() || 'SJ'}</div>
            <div className="sb-user-info">
              <div className="sb-user-name">{user?.name || 'User'}</div>
              <div className="sb-user-role">Keluar</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div className="topbar-left">
            <button className="burger-btn" onClick={() => setSidebarOpen(true)}>
              <span></span><span></span><span></span>
            </button>
            <div>
              <h1 id="pageTitle">{activeSection?.label}</h1>
              <div className="sub" id="pageSub">{activeSection?.sub}</div>
            </div>
          </div>
          <div className="topbar-right">
            <div className="sb-avatar">{user?.name?.substring(0, 2).toUpperCase() || 'SJ'}</div>
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
