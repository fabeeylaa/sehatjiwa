import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, BookmarkCheck, BookOpen } from 'lucide-react';
import '../pages/Dashboard.css';

function UserArticles() {
  const [articles, setArticles] = useState([]);
  const [bookmarks, setBookmarks] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch('/api/articles?page=1&limit=50', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/bookmarks', { credentials: 'include' }).then(r => r.json())
    ])
      .then(([articlesData, bookmarksData]) => {
        setArticles(articlesData.items || []);
        setBookmarks(new Set((bookmarksData || []).map(b => b.id)));
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const toggleBookmark = async (articleId, isBookmarked) => {
    const prev = new Set(bookmarks);
    setBookmarks(s => {
      const n = new Set(s);
      isBookmarked ? n.delete(articleId) : n.add(articleId);
      return n;
    });

    try {
      if (isBookmarked) {
        await fetch(`/api/bookmarks/${articleId}`, { method: 'DELETE', credentials: 'include' });
      } else {
        await fetch('/api/bookmarks', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ article_id: articleId })
        });
      }
    } catch (err) {
      console.error(err);
      setBookmarks(prev);
    }
  };

  if (loading) return <div>Memuat artikel...</div>;

  return (
    <div className="tab-panel">
      {articles.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <BookOpen size={48} strokeWidth={1.5} style={{ margin: '0 auto 16px', color: 'var(--forest)' }} />
          <h3>Belum Ada Artikel</h3>
          <p className="hint">Konten edukasi akan segera tersedia.</p>
        </div>
      ) : (
        <div className="article-grid">
          {articles.map(article => {
            const isBookmarked = bookmarks.has(article.id);
            return (
              <div key={article.id} className="article-card">
                <div className="article-thumb" style={{ background: 'linear-gradient(135deg, var(--mint-200), var(--periwinkle-soft))' }}>
                  {article.cover_image && <img src={article.cover_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <button
                  className="bookmark-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(article.id, isBookmarked);
                  }}
                  title={isBookmarked ? 'Hapus bookmark' : 'Simpan artikel'}
                >
                  {isBookmarked ? <BookmarkCheck size={16} color="var(--forest)" /> : <Bookmark size={16} color="var(--ink-soft)" />}
                </button>
                <div className="article-body" onClick={() => navigate(`/dashboard/articles/${article.slug}`)} style={{ cursor: 'pointer' }}>
                  <span className="tag" style={{ color: 'var(--periwinkle)' }}>{article.category}</span>
                  <h3>{article.title}</h3>
                  {article.excerpt && <p style={{ fontSize: '13px', color: 'var(--ink-soft)', marginTop: '6px', lineHeight: 1.5 }}>{article.excerpt}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default UserArticles;
