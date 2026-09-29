import { useEffect, useState, useCallback } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Plus, Flame, Check, Trash2, X, Target, CalendarCheck } from 'lucide-react';
import '../pages/Dashboard.css';

const WEEK_DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function UserHabits() {
  const [habits, setHabits] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newFreq, setNewFreq] = useState('daily');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [habitsRes, weeklyRes] = await Promise.all([
        fetch('/api/habits', { credentials: 'include' }),
        fetch('/api/habits/weekly', { credentials: 'include' }),
      ]);
      const habitsData = await habitsRes.json();
      const weeklyData = await weeklyRes.json();
      setHabits(habitsData.habits || []);
      setWeekly(weeklyData.weekly || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleHabit = async (id, currentlyLogged) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, logged_today: !currentlyLogged } : h));
    try {
      const method = currentlyLogged ? 'DELETE' : 'POST';
      await fetch(`/api/habits/${id}/log`, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const weeklyRes = await fetch('/api/habits/weekly', { credentials: 'include' });
      const weeklyData = await weeklyRes.json();
      setWeekly(weeklyData.weekly || []);
    } catch (err) {
      console.error(err);
      setHabits(prev => prev.map(h => h.id === id ? { ...h, logged_today: currentlyLogged } : h));
    }
  };

  const deleteHabit = async (id) => {
    if (!window.confirm('Hapus habit ini?')) return;
    try {
      await fetch(`/api/habits/${id}`, { method: 'DELETE', credentials: 'include' });
      setHabits(prev => prev.filter(h => h.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const addHabit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/habits', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim(), frequency: newFreq }),
      });
      const data = await res.json();
      if (data.habit) setHabits(prev => [data.habit, ...prev]);
      setNewTitle('');
      setShowModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Memuat habit tracker...</div>;

  const doneCount = habits.filter(h => h.logged_today).length;
  const totalHabits = habits.length;
  const progressPct = totalHabits > 0 ? Math.round((doneCount / totalHabits) * 100) : 0;
  const maxWeek = Math.max(...weekly.map(d => d.value), 1);

  return (
    <div className="tab-panel">
      {/* Stats */}
      <div className="habit-stats">
        <div className="habit-stat-card">
          <Target size={18} />
          <div>
            <div className="habit-stat-val">{totalHabits}</div>
            <div className="habit-stat-lbl">Habit Aktif</div>
          </div>
        </div>
        <div className="habit-stat-card">
          <CalendarCheck size={18} />
          <div>
            <div className="habit-stat-val">{progressPct}%</div>
            <div className="habit-stat-lbl">Progress Hari Ini</div>
          </div>
        </div>
        <div className="habit-stat-card">
          <Flame size={18} />
          <div>
            <div className="habit-stat-val">{doneCount}/{totalHabits}</div>
            <div className="habit-stat-lbl">Selesai</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      {weekly.length > 0 && (
        <div className="card habit-chart-card">
          <h3>Tren 7 Hari Terakhir</h3>
          <p className="habit-chart-sub">Jumlah habit yang dicatat per hari</p>
          <div className="habit-chart-wrap">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weekly} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--ink-soft)' }} />
                <Tooltip cursor={{ fill: 'rgba(47,75,60,0.06)' }} formatter={(v) => [`${v} habit`, 'Dicatat']} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={36}>
                  {weekly.map((entry, i) => (
                    <Cell key={i} fill={entry.value > 0 ? '#2F4B3C' : '#e5e7eb'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Daily Checklist */}
      <div className="card habit-list-card">
        <div className="habit-list-header">
          <div>
            <h3>Daftar Hari Ini</h3>
            <p className="hint">{doneCount} dari {totalHabits} selesai</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Tambah
          </button>
        </div>

        {habits.length === 0 ? (
          <div className="habit-empty">
            <Flame size={40} strokeWidth={1.2} />
            <p>Belum ada habit.</p>
            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
              <Plus size={14} /> Mulai Sekarang
            </button>
          </div>
        ) : (
          <div className="habit-items">
            {habits.map(habit => {
              const weekLogs = parseInt(habit.week_count) || 0;
              return (
                <div key={habit.id} className={`habit-item ${habit.logged_today ? 'done' : ''}`}>
                  <button
                    className={`habit-check ${habit.logged_today ? 'done' : ''}`}
                    onClick={() => toggleHabit(habit.id, habit.logged_today)}
                  >
                    {habit.logged_today && <Check size={16} />}
                  </button>
                  <div className="habit-info">
                    <div className="habit-title">{habit.title}</div>
                    <div className="habit-meta">
                      <span className="habit-freq">{habit.frequency === 'daily' ? 'Harian' : habit.frequency}</span>
                      <span className="habit-sep">·</span>
                      <span className="habit-streak-mini">
                        <Flame size={11} /> {weekLogs}/7 hari
                      </span>
                    </div>
                  </div>
                  <button className="habit-delete" onClick={() => deleteHabit(habit.id)} title="Hapus">
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Tambah */}
      {showModal && (
        <div className="habit-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="habit-modal" onClick={e => e.stopPropagation()}>
            <div className="habit-modal-head">
              <h3>Tambah Habit Baru</h3>
              <button className="habit-modal-close" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={addHabit}>
              <label className="habit-form-label">
                Nama Habit
                <input
                  type="text"
                  placeholder="Contoh: Minum 8 gelas air"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  autoFocus
                />
              </label>
              <label className="habit-form-label">
                Frekuensi
                <select value={newFreq} onChange={e => setNewFreq(e.target.value)}>
                  <option value="daily">Harian</option>
                  <option value="weekly">Mingguan</option>
                </select>
              </label>
              <button type="submit" className="btn btn-primary" disabled={submitting || !newTitle.trim()}>
                {submitting ? 'Menambahkan...' : 'Tambah Habit'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserHabits;
