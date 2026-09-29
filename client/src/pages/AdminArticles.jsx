import { useEffect, useState } from 'react';
import '../pages/Dashboard.css';

function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles?page=1&limit=20');
      const data = await res.json();
      setArticles(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus artikel ini?')) return;
    try {
      const res = await fetch(`/api/articles/admin/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setArticles(articles.filter(a => a.id !== id));
      } else {
        const data = await res.json();
        alert(data.message || 'Gagal menghapus artikel');
      }
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus artikel');
    }
  };

  const navigateToArticle = (slug) => {
    window.open(`/articles/${slug}`, '_blank');
  };

  if (loading) return <div>Memuat artikel...</div>;

  return (
    <div className="tab-panel">
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>Manajemen Artikel</h3>
        <p className="hint">Kelola konten edukasi untuk pengguna</p>
        <p style={{ marginTop: '16px' }}>Total artikel: <strong>{articles.length}</strong></p>
      </div>

      <div className="card">
        <h4>Daftar Artikel</h4>
        
        {articles.length === 0 ? (
          <p style={{ marginTop: '16px', color: 'var(--on-surface-variant)' }}>
            Belum ada artikel. Tambahkan konten edukasi baru.
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--outline-variant)' }}>
                <th style={{ textAlign: 'left', padding: '12px', fontWeight: 600 }}>Judul</th>
                <th style={{ textAlign: 'left', padding: '12px', fontWeight: 600 }}>Kategori</th>
                <th style={{ textAlign: 'center', padding: '12px', fontWeight: 600 }}>Tanggal</th>
                <th style={{ textAlign: 'center', padding: '12px', fontWeight: 600 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(article => (
                <tr key={article.id} style={{ borderBottom: '1px solid var(--outline-variant)' }}>
                  <td style={{ padding: '12px', fontWeight: 500 }}>{article.title}</td>
                  <td style={{ padding: '12px' }}>
                    <span className="tag">{article.category}</span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {new Date(article.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={() => navigateToArticle(article.slug)}
                      style={{ marginRight: '4px' }}
                    >
                      Lihat
                    </button>
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={() => handleDelete(article.id)}
                      style={{ color: 'var(--error)' }}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminArticles;
