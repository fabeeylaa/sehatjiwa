import '../pages/Dashboard.css';

function UserHome({ user }) {
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
          <div className="val">0</div>
          <div className="sub2">Kebiasaan aktif</div>
        </div>
        <div className="kpi-card">
          <div className="lbl">Screening</div>
          <div className="val">0</div>
          <div className="sub2">Hasil terbaru</div>
        </div>
        <div className="kpi-card">
          <div className="lbl">Artikel</div>
          <div className="val">0</div>
          <div className="sub2">Tersimpan</div>
        </div>
      </div>
    </div>
  );
}

export default UserHome;
