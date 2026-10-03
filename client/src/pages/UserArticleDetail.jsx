import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Bookmark, BookmarkCheck, ChevronLeft, BookOpen } from 'lucide-react';
import '../pages/Dashboard.css';

function UserArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch(`/api/articles/${slug}`, { credentials: 'include' }).then(r => r.json()),
      fetch('/api/bookmarks', { credentials: 'include' }).then(r => r.json())
    ])
      .then(([articleData, bookmarksData]) => {
        if (articleData.id) {
          setArticle(articleData);
          setIsBookmarked((bookmarksData || []).some(b => b.id === articleData.id));
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  const toggleBookmark = async () => {
    const prev = isBookmarked;
    setIsBookmarked(!isBookmarked);

    try {
      if (isBookmarked) {
        await fetch(`/api/bookmarks/${article.id}`, { method: 'DELETE', credentials: 'include' });
      } else {
        await fetch('/api/bookmarks', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ article_id: article.id })
        });
      }
    } catch (err) {
      console.error(err);
      setIsBookmarked(prev);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Memuat artikel...</div>;
  if (!article) return (
    <div className="tab-panel">
      <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <BookOpen size={48} strokeWidth={1.5} style={{ margin: '0 auto 16px', color: 'var(--forest)' }} />
        <h3>Artikel Tidak Ditemukan</h3>
        <p className="hint">Artikel yang Anda cari tidak tersedia.</p>
      </div>
    </div>
  );

  return (
    <div className="tab-panel">
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <button className="btn btn-sm btn-ghost" onClick={() => navigate('/dashboard/articles')}>
            <ChevronLeft size={18} /> Kembali
          </button>
          <button
            className="btn btn-sm btn-ghost"
            style={{ marginLeft: 'auto', color: isBookmarked ? 'var(--forest)' : 'var(--ink-soft)' }}
            onClick={toggleBookmark}
          >
            {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            <span style={{ marginLeft: '6px' }}>{isBookmarked ? 'Disimpan' : 'Simpan'}</span>
          </button>
        </div>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '26px', color: 'var(--forest-deep)', marginBottom: '8px' }}>{article.title}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className="tag" style={{ color: 'var(--periwinkle)' }}>{article.category}</span>
          <span className="hint">
            {new Date(article.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
        {article.excerpt && <p className="hint" style={{ marginTop: '12px', fontStyle: 'italic' }}>{article.excerpt}</p>}
      </div>

      <div className="card">
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, color: 'var(--on-surface)' }}>
          {article.content}
        </div>
      </div>
    </div>
  );
}

export default UserArticleDetail;
