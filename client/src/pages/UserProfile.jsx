import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, ShieldCheck, LogOut } from 'lucide-react';
import './UserProfile.css';

function UserProfile({ user }) {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      navigate('/auth');
    }
  };

  const initial = (user.name || '?').charAt(0).toUpperCase();
  const roleLabel = user.role === 'admin' ? 'Admin' : 'Pengguna';

  const items = [
    { icon: <User size={20} />, label: 'Nama', value: user.name },
    { icon: <Mail size={20} />, label: 'Email', value: user.email },
    { icon: <ShieldCheck size={20} />, label: 'Peran', value: roleLabel },
  ];

  return (
    <div className="card prof-card">
      <div className="prof-cover">
        <span className="prof-circle prof-circle-a"></span>
        <span className="prof-circle prof-circle-b"></span>
      </div>

      <div className="prof-body">
        <div className="prof-avatar">{initial}</div>
        <h2 className="prof-name">{user.name}</h2>
        <span className="prof-badge">{roleLabel}</span>

        <div className="prof-grid">
          {items.map((it) => (
            <div className="prof-tile" key={it.label}>
              <div className="prof-tile-icon">{it.icon}</div>
              <div className="prof-tile-text">
                <span className="prof-tile-label">{it.label}</span>
                <span className="prof-tile-value">{it.value}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          className="btn btn-ghost prof-logout"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          <LogOut size={18} />
          <span>{loggingOut ? 'Logout...' : 'Logout'}</span>
        </button>
      </div>
    </div>
  );
}

export default UserProfile;