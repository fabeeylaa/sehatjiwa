import { useEffect, useState } from 'react';
import '../pages/Dashboard.css';

function UserArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/articles?page=1', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setArticles(data.items || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Memuat artikel...</div>;

  return (
    <div className="tab-panel">
      <div className="card">
        <h3>Edukasi & Artikel</h3>
        <p className="hint">Bacaan seputar kesehatan mental</p>
        
        {articles.length === 0 ? (
          <p style={{ marginTop: '16px', color: 'var(--on-surface-variant)' }}>
            Belum ada artikel tersedia.
          </p>
        ) : (
          <div style={{ marginTop: '16px' }}>
            {articles.slice(0, 5).map(article => (
              <div key={article.id} className="article-mini">
                <div style={{ flex: 1 }}>
                  <h4>{article.title}</h4>
                  <div className="tag">{article.category}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserArticles;
