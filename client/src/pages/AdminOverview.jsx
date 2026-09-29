import { useEffect, useState } from 'react';
import '../pages/Dashboard.css';

function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data.stats);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Memuat statistik...</div>;
  if (!stats) return <div>Gagal memuat data</div>;

  return (
    <div className="tab-panel">
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="lbl">Total User</div>
          <div className="val">{stats.users}</div>
          <div className="sub2">Pengguna aktif</div>
        </div>
        <div className="kpi-card">
          <div className="lbl">Total Artikel</div>
          <div className="val">{stats.articles}</div>
          <div className="sub2">Konten edukasi</div>
        </div>
        <div className="kpi-card">
          <div className="lbl">Assessment</div>
          <div className="val">{stats.assessments}</div>
          <div className="sub2">Hasil screening</div>
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;
