import { useEffect, useState } from "react";
import "../pages/Dashboard.css";

const getJson = (url) =>
  fetch(url, { credentials: "include" })
    .then((r) => r.json())
    .catch(() => null);

function UserHome({ user }) {
  const [stats, setStats] = useState({
    habits: 0,
    screening: "-",
    bookmarks: 0,
  });

  useEffect(() => {
    const load = async () => {
      const [h, a, b] = await Promise.all([
        getJson("/api/habits"),
        getJson("/api/assessments/history"),
        getJson("/api/bookmarks"),
      ]);
      const latest = a?.history?.[0];
      setStats({
        habits: h?.habits?.length ?? 0,
        screening: latest ? latest.category_label : "-",
        bookmarks: Array.isArray(b) ? b.length : 0,
      });
    };
    load();
  }, []);

  return (
    <div className="tab-panel">
      <div className="welcome-banner">
        <div>
          <h2>Selamat datang kembali, {user?.name}!</h2>
          <p>Pantau kesehatan mentalmu dan kebiasaan harianmu di sini.</p>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="lbl">Habit Tracker</div>
          <div className="val">{stats.habits}</div>
          <div className="sub2">Kebiasaan aktif</div>
        </div>
        <div className="kpi-card">
          <div className="lbl">Screening</div>
          <div className="val">{stats.screening}</div>
          <div className="sub2">Hasil terbaru</div>
        </div>
        <div className="kpi-card">
          <div className="lbl">Artikel</div>
          <div className="val">{stats.bookmarks}</div>
          <div className="sub2">Tersimpan</div>
        </div>
      </div>
    </div>
  );
}

export default UserHome;
