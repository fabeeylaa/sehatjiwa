import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  ShieldCheck,
  LogOut,
  Heart,
  Activity,
  Leaf,
  Sparkles,
  Flame,
} from 'lucide-react';
import './UserProfile.css';

const getJson = (url) =>
  fetch(url, { credentials: 'include' })
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);

function UserProfile({ user }) {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [habits, setHabits] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [latest, setLatest] = useState(null);
  const [streak, setStreak] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const isAdmin = user.role === 'admin';

  useEffect(() => {
    if (isAdmin) return;
    let alive = true;
    Promise.all([
      getJson('/api/habits'),
      getJson('/api/habits/weekly'),
      getJson('/api/assessments/history'),
      getJson('/api/social/leaderboard'),
    ]).then(([h, w, a, l]) => {
      if (!alive) return;
      setHabits(h?.habits || []);
      setWeekly(w?.weekly || []);
      setLatest(a?.history?.[0] || null);
      const me = Array.isArray(l) ? l.find((x) => x.is_me) : null;
      setStreak(me?.current_streak || 0);
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, [isAdmin]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } finally {
      navigate('/auth');
    }
  };

  const initial = (user.name || '?').charAt(0).toUpperCase();
  const roleLabel = isAdmin ? 'Admin' : 'Pengguna';

  const items = [
    { icon: <User size={20} />, label: 'Nama', value: user.name },
    { icon: <Mail size={20} />, label: 'Email', value: user.email },
    { icon: <ShieldCheck size={20} />, label: 'Peran', value: roleLabel },
  ];

  const total = habits.length;
  const done = habits.filter((h) => h.logged_today).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const R = 44;
  const C = 2 * Math.PI * R;
  const offset = C * (1 - pct / 100);

  const maxBar = Math.max(total, ...weekly.map((d) => d.value), 1);

  return (
    <div className="card prof-card">
      <div className="prof-cover">
        <span className="prof-circle prof-circle-a"></span>
        <span className="prof-circle prof-circle-b"></span>
        <Heart className="prof-deco d1" size={38} />
        <Activity className="prof-deco d2" size={44} />
        <Leaf className="prof-deco d3" size={34} />
        <Heart className="prof-deco d4" size={26} />
        <Sparkles className="prof-deco d5" size={30} />
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

        {!isAdmin && (
          <section className="prof-stats">
            <h3>Statistik &amp; Ringkasan</h3>

            {!loaded ? (
              <p className="prof-muted">Memuat statistik...</p>
            ) : (
              <div className="prof-stats-grid">
                <div className="prof-stat">
                  <div className="prof-ring">
                    <svg viewBox="0 0 100 100" width="104" height="104">
                      <circle cx="50" cy="50" r={R} className="ring-bg" />
                      <circle
                        cx="50"
                        cy="50"
                        r={R}
                        className="ring-fg"
                        strokeDasharray={C}
                        strokeDashoffset={offset}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <span className="prof-ring-val">{pct}%</span>
                  </div>
                  <div>
                    <div className="prof-stat-label">Progress</div>
                    <div className="prof-stat-title">Habit Tracker</div>
                    <div className="prof-stat-sub">
                      {total === 0 ? 'Belum ada habit' : `${done} dari ${total} selesai hari ini`}
                    </div>
                    <div className="prof-streak">
                      <Flame size={14} /> Streak {streak} hari
                    </div>
                  </div>
                </div>

                <div className="prof-stat prof-stat-score">
                  {latest ? (
                    <>
                      <div className="prof-score-num">{latest.total_score}</div>
                      <div>
                        <div className="prof-stat-label">Skor terakhir</div>
                        <div className="prof-stat-title">{latest.category_label}</div>
                        <div className="prof-stat-sub">{latest.assessment_title}</div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <div className="prof-stat-label">Skor Kesehatan Mental</div>
                      <div className="prof-stat-title">Belum ada skor</div>
                      <button
                        className="btn btn-primary btn-sm prof-cta"
                        onClick={() => navigate('/dashboard/screening')}
                      >
                        Mulai Screening
                      </button>
                    </div>
                  )}
                </div>

                <div className="prof-stat prof-stat-bars">
                  <div className="prof-bars">
                    {weekly.map((d, i) => {
                      const h = Math.max((d.value / maxBar) * 100, 6);
                      const isToday = i === weekly.length - 1;
                      return (
                        <div className="prof-bar-col" key={d.date || i} title={`${d.value} habit`}>
                          <div className="prof-bar-track">
                            <div
                              className={`prof-bar ${d.value > 0 ? 'on' : ''} ${isToday ? 'today' : ''}`}
                              style={{ height: `${h}%` }}
                            ></div>
                          </div>
                          <span className="prof-bar-day">{d.day}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="prof-stat-sub">Habit dicentang, 7 hari terakhir</div>
                </div>
              </div>
            )}
          </section>
        )}

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