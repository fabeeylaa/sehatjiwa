import { useEffect, useState } from 'react';
import '../pages/Dashboard.css';

function UserScreening() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/assessments/history', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setResults(data.history || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Memuat riwayat screening...</div>;

  return (
    <div className="tab-panel">
      <div className="card">
        <h3>Riwayat Screening</h3>
        <p className="hint">Hasil assessment terbaru Anda</p>
        
        {results.length === 0 ? (
          <p style={{ marginTop: '16px', color: 'var(--on-surface-variant)' }}>
            Belum ada hasil screening. Mulai screening sekarang!
          </p>
        ) : (
          <div style={{ marginTop: '16px' }}>
            {results.map((result, idx) => (
              <div key={idx} className="history-row">
                <div>
                  <div className="history-date">
                    {new Date(result.created_at).toLocaleDateString('id-ID')}
                  </div>
                  <div className="history-score">{result.category_label}</div>
                </div>
                <div className="history-score">Skor: {result.total_score}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserScreening;
