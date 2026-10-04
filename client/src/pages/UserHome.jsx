import './UserHomeNew.css';
import { useNavigate } from 'react-router-dom';
import ProgressRing from '../components/ProgressRing';

function UserHome({ user }) {
  const navigate = useNavigate();

  const weekData = [
    { day: 'Sen', value: 4 },
    { day: 'Sel', value: 6 },
    { day: 'Rab', value: 5 },
    { day: 'Kam', value: 7 },
    { day: 'Jum', value: 3 },
    { day: 'Sab', value: 8 },
    { day: 'Min', value: 6 },
  ];
  const todayIndex = weekData.length - 1;
  const maxWeek = Math.max(...weekData.map(d => d.value), 1);

  const quickLinks = [
    {
      label: 'Screening\nSederhana',
      path: '/dashboard/screening',
      iconClass: 'bg-green',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 12h6m-6 4h6M9 8h6M7 4a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2H7z" />
        </svg>
      ),
    },
    {
      label: 'Edukasi',
      path: '/dashboard/articles',
      iconClass: 'bg-gray',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16v16H4z" />
          <path d="M8 9h8M8 13h8M8 17h5" />
        </svg>
      ),
    },
    {
      label: 'Tracker',
      path: '/dashboard/habits',
      iconClass: 'bg-light-green',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19V9M12 19V5M20 19v-6" />
        </svg>
      ),
    },
  ];

  return (
    <div className="new-dashboard">
      <div className="dash-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input type="text" placeholder="Cari aktivitas atau artikel..." aria-label="Cari aktivitas atau artikel" />
      </div>

      <div className="dash-header">
        <h1>Halo, {user?.name || 'Budi'}!</h1>
        <p>Bagaimana perasaanmu hari ini?</p>
      </div>

      <div className="dash-grid">
        <div className="dash-main">
          <div className="health-card">
            <div className="health-info">
              <h2>Skor Kesehatan Hari Ini</h2>
              <p>Skor kesehatan mental dan fisikmu menunjukkan status Sangat Baik. Terus pertahankan pola hidup sehatmu!</p>
              <div className="trend-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 7L13.5 15.5 8.5 10.5 2 17"/><path d="M16 7h6v6"/></svg>
                +5 dari minggu lalu
              </div>
            </div>
            <div className="health-ring">
              <ProgressRing value={85} total={100} size={140} stroke={14} />
            </div>
          </div>
        </div>

        <div className="dash-side">
          <h3>Akses Cepat</h3>
          <div className="quick-links">
            {quickLinks.map(link => (
              <button key={link.path} className="q-link" onClick={() => navigate(link.path)}>
                <div className={`q-icon ${link.iconClass}`}>{link.icon}</div>
                <span>{link.label.split('\n').map((line, i, arr) => (
                  <span key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}</span>
                <svg className="q-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            ))}
          </div>
        </div>

        <div className="dash-bottom">
          <div className="bottom-head">
            <h3>Aktivitas Mingguan</h3>
            <button className="see-all" onClick={() => navigate('/dashboard/habits')}>
              Lihat Semua <span>&rarr;</span>
            </button>
          </div>
          <div className="activity-chart">
            {weekData.map((item, i) => {
              const isToday = i === todayIndex;
              return (
                <div key={item.day} className="chart-bar-wrap">
                  <div className="chart-bg">
                    <div
                      className={`chart-fill ${isToday ? 'is-today' : ''}`}
                      style={{ height: `${Math.round((item.value / maxWeek) * 100)}%` }}
                      title={`${item.day}: ${item.value} aktivitas`}
                    >
                      {isToday && <div className="chart-dot"></div>}
                    </div>
                  </div>
                  <span className={isToday ? 'active-day' : ''}>{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHome;
