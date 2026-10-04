import { useEffect, useState } from "react";
import "../pages/Dashboard.css";
import "./UserSocial.css";

function Leaderboard() {
  const [scope, setScope] = useState("global"); // 'global' | 'friends'
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    const url =
      scope === "friends"
        ? "/api/social/leaderboard?scope=friends"
        : "/api/social/leaderboard";

    fetch(url, { credentials: "include" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Gagal memuat leaderboard");
        setRows(Array.isArray(data) ? data : []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [scope]);

  return (
    <div className="card">
      <h3>Leaderboard</h3>
      <p className="hint">Diurutkan dari streak tertinggi</p>

      <div className="soc-tabs" style={{ marginTop: "12px" }}>
        <button
          type="button"
          className={`btn btn-sm ${scope === "global" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setScope("global")}
        >
          Global
        </button>
        <button
          type="button"
          className={`btn btn-sm ${scope === "friends" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setScope("friends")}
        >
          Teman
        </button>
      </div>

      {error && <div className="soc-error">{error}</div>}
      {loading && <p className="hint">Memuat...</p>}

      {!loading && !error && rows.length === 0 && (
        <p style={{ color: "var(--on-surface-variant)" }}>Belum ada data.</p>
      )}

      {!loading &&
        rows.map((r) => (
          <div
            key={r.user_id}
            className={`history-row ${r.is_me ? "soc-me" : ""}`}
          >
            <div className="soc-left">
              <div className="soc-rank">#{r.rank_position}</div>
              <div>
                <div className="soc-name">
                  {r.name}
                  {r.is_me ? " (Kamu)" : ""}
                </div>
                <div className="soc-sub">@{r.username}</div>
              </div>
            </div>
            <div className="history-score">
              Streak {r.current_streak} hari · {r.total_habits_completed}{" "}
              selesai
            </div>
          </div>
        ))}
    </div>
  );
}

function UserSocial() {
  const [tab, setTab] = useState("leaderboard");

  return (
    <div className="tab-panel">
      <div className="soc-tabs">
        <button
          type="button"
          className={`btn ${tab === "leaderboard" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setTab("leaderboard")}
        >
          Leaderboard
        </button>
        {/* Tab Teman dan Tantangan ditambah di langkah berikutnya */}
      </div>

      {tab === "leaderboard" && <Leaderboard />}
    </div>
  );
}

export default UserSocial;
