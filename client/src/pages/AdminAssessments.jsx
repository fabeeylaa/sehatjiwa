import { useEffect, useState } from 'react';
import '../pages/Dashboard.css';

function AdminAssessments() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await fetch('/api/admin/assessment-results');
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Memuat hasil assessment...</div>;

  return (
    <div className="tab-panel">
      <div className="card">
        <h3>Semua Hasil Assessment Pengguna</h3>
        <p className="hint">Daftar riwayat screening seluruh user</p>
        
        {results.length === 0 ? (
          <p style={{ marginTop: '16px', color: 'var(--on-surface-variant)' }}>
            Belum ada hasil screening dari pengguna.
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--outline-variant)' }}>
                <th style={{ textAlign: 'left', padding: '12px', fontWeight: 600 }}>Tanggal</th>
                <th style={{ textAlign: 'left', padding: '12px', fontWeight: 600 }}>User</th>
                <th style={{ textAlign: 'left', padding: '12px', fontWeight: 600 }}>Assessment</th>
                <th style={{ textAlign: 'left', padding: '12px', fontWeight: 600 }}>Skor</th>
                <th style={{ textAlign: 'left', padding: '12px', fontWeight: 600 }}>Kategori</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--outline-variant)' }}>
                  <td style={{ padding: '12px' }}>
                    {new Date(result.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td style={{ padding: '12px' }}>{result.user_name} ({result.user_email})</td>
                  <td style={{ padding: '12px' }}>{result.assessment_title}</td>
                  <td style={{ padding: '12px' }}>{result.total_score}</td>
                  <td style={{ padding: '12px' }}>{result.category_label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminAssessments;
