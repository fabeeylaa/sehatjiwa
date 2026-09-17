import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        if (isLogin) {
          navigate('/dashboard');
        } else {
          setIsLogin(true);
          setError('Registrasi berhasil, silakan login');
        }
      } else {
        setError(data.message || 'Terjadi kesalahan');
      }
    } catch (err) {
      setError('Gagal menghubungi server');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="navbar-logo" onClick={() => navigate('/')} style={{cursor: 'pointer', marginBottom: '1.5rem'}}>
            <svg viewBox="0 0 24 24" aria-hidden="true" style={{width: '32px', height: '32px', fill: 'var(--primary)'}}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            SehatJiwa
          </div>
          <h1>{isLogin ? 'Selamat Datang' : 'Mulai Perjalanan Anda'}</h1>
          <p>{isLogin ? 'Masuk untuk memantau kesehatan jiwa Anda' : 'Buat akun untuk fitur lengkap'}</p>
        </div>

        <div className="auth-tabs">
          <button 
            className={`auth-tab ${isLogin ? 'active' : ''}`} 
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`auth-tab ${!isLogin ? 'active' : ''}`} 
            onClick={() => setIsLogin(false)}
          >
            Daftar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className={`auth-error ${error.includes('berhasil') ? 'success' : ''}`}>{error}</div>}
          
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Nama Lengkap</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Masukan nama lengkap" 
                  required 
                  onChange={handleChange} 
                />
              </div>
              <div className="form-group">
                <label>Username</label>
                <input 
                  type="text" 
                  name="username" 
                  placeholder="Masukan username" 
                  required 
                  onChange={handleChange} 
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              placeholder="name@example.com" 
              required 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              placeholder="••••••••" 
              required 
              onChange={handleChange} 
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full">
            {isLogin ? 'Masuk' : 'Daftar Sekarang'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;