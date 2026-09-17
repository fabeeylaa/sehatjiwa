import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
        else navigate('/auth');
      })
      .catch(() => navigate('/auth'));
  }, [navigate]);

  if (!user) return <div style={{padding: '2rem'}}>Memuat...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Halo, {user.name}!</h1>
        <button 
          className="btn btn-secondary"
          onClick={async () => {
            await fetch('/api/auth/logout', { method: 'POST' });
            navigate('/auth');
          }}
        >
          Keluar
        </button>
      </header>
      
      <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: 'var(--shadow-card)' }}>
        <p>Selamat datang di Dashboard SehatJiwa.</p>
        <p style={{ marginTop: '1rem', color: 'var(--on-surface-variant)' }}>
          Ini adalah halaman utama setelah Anda masuk. Modul admin dan fitur pengguna lainnya akan ditambahkan di sini.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;