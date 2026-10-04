import { useEffect, useState } from 'react';
import '../pages/Dashboard.css';
import './UserSocial.css';

function Leaderboard() {
  const [scope, setScope] = useState('global'); // 'global' | 'friends'
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    const url =
      scope === 'friends'
        ? '/api/social/leaderboard?scope=friends'
        : '/api/social/leaderboard';

    fetch(url, { credentials: 'include' })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Gagal memuat leaderboard');
        setRows(Array.isArray(data) ? data : []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [scope]);

  return (
    <div className="card">
      <h3>Leaderboard</h3>
      <p className="hint">Diurutkan dari streak tertinggi</p>

      <div className="soc-tabs" style={{ marginTop: '12px' }}>
        <button
          type="button"
          className={`btn btn-sm ${scope === 'global' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setScope('global')}
        >
          Global
        </button>
        <button
          type="button"
          className={`btn btn-sm ${scope === 'friends' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setScope('friends')}
        >
          Teman
        </button>
      </div>

      {error && <div className="soc-error">{error}</div>}
      {loading && <p className="hint">Memuat...</p>}

      {!loading && !error && rows.length === 0 && (
        <p style={{ color: 'var(--on-surface-variant)' }}>Belum ada data.</p>
      )}

      {!loading &&
        rows.map((r) => (
          <div
            key={r.user_id}
            className={`history-row ${r.is_me ? 'soc-me' : ''}`}
          >
            <div className="soc-left">
              <div className="soc-rank">#{r.rank_position}</div>
              <div>
                <div className="soc-name">
                  {r.name}
                  {r.is_me ? ' (Kamu)' : ''}
                </div>
                <div className="soc-sub">@{r.username}</div>
              </div>
            </div>
            <div className="history-score">
              Streak {r.current_streak} hari · {r.total_habits_completed} selesai
            </div>
          </div>
        ))}
    </div>
  );
}

function Friends() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [sending, setSending] = useState(false);

  const load = () => {
    fetch('/api/social/friends', { credentials: 'include' })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Gagal memuat teman');
        setFriends(Array.isArray(data) ? data : []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const sendRequest = async (e) => {
    e.preventDefault();
    const value = identifier.trim();
    if (!value) return;
    setSending(true);
    setError('');
    setInfo('');
    try {
      const res = await fetch('/api/social/friends/add', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal mengirim permintaan');
      setInfo('Permintaan pertemanan terkirim.');
      setIdentifier('');
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const respond = async (id, action) => {
    setError('');
    setInfo('');
    try {
      const res = await fetch(`/api/social/friends/${id}/respond`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal merespon permintaan');
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const incoming = friends.filter((f) => f.status === 'pending' && f.direction === 'incoming');
  const outgoing = friends.filter((f) => f.status === 'pending' && f.direction === 'outgoing');
  const accepted = friends.filter((f) => f.status === 'accepted');

  return (
    <>
      <div className="card">
        <h3>Tambah Teman</h3>
        <p className="hint">Masukkan username atau email temanmu</p>
        <form onSubmit={sendRequest} className="soc-form">
          <input
            className="soc-input"
            type="text"
            placeholder="Username atau email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={sending || !identifier.trim()}>
            {sending ? 'Mengirim...' : 'Kirim'}
          </button>
        </form>
        {error && <div className="soc-error">{error}</div>}
        {info && <div className="soc-info">{info}</div>}
      </div>

      {incoming.length > 0 && (
        <div className="card" style={{ marginTop: '16px' }}>
          <h3>Permintaan Masuk</h3>
          {incoming.map((f) => (
            <div key={f.id} className="history-row">
              <div>
                <div className="soc-name">{f.name}</div>
                <div className="soc-sub">@{f.username}</div>
              </div>
              <div className="soc-btns">
                <button type="button" className="btn btn-primary btn-sm" onClick={() => respond(f.id, 'accept')}>
                  Terima
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => respond(f.id, 'reject')}>
                  Tolak
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card" style={{ marginTop: '16px' }}>
        <h3>Teman Kamu</h3>
        {loading && <p className="hint">Memuat...</p>}
        {!loading && accepted.length === 0 && (
          <p style={{ color: 'var(--on-surface-variant)' }}>Belum ada teman.</p>
        )}
        {accepted.map((f) => (
          <div key={f.id} className="history-row">
            <div>
              <div className="soc-name">{f.name}</div>
              <div className="soc-sub">@{f.username}</div>
            </div>
            <div className="history-score">Streak bersama: {f.mutual_streak ?? 0} hari</div>
          </div>
        ))}
      </div>

      {outgoing.length > 0 && (
        <div className="card" style={{ marginTop: '16px' }}>
          <h3>Menunggu Konfirmasi</h3>
          {outgoing.map((f) => (
            <div key={f.id} className="history-row">
              <div>
                <div className="soc-name">{f.name}</div>
                <div className="soc-sub">@{f.username}</div>
              </div>
              <div className="history-score">Menunggu</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function UserSocial() {
  const [tab, setTab] = useState('leaderboard');

  return (
    <div className="tab-panel">
      <div className="soc-tabs">
        <button
          type="button"
          className={`btn ${tab === 'leaderboard' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setTab('leaderboard')}
        >
          Leaderboard
        </button>
        <button
          type="button"
          className={`btn ${tab === 'friends' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setTab('friends')}
        >
          Teman
        </button>
        {/* Tab Tantangan ditambah di langkah berikutnya */}
      </div>

      {tab === 'leaderboard' && <Leaderboard />}
      {tab === 'friends' && <Friends />}
    </div>
  );
}

export default UserSocial;
