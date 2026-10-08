import { useEffect, useState } from 'react';
import { ARTICLE_CATEGORIES, categoryLabel } from '../utils/articleCategories';
import '../pages/Dashboard.css';

const DEFAULT_CATEGORY = ARTICLE_CATEGORIES[0].value;

function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: DEFAULT_CATEGORY,
    excerpt: '',
    cover_image: ''
  });
  const [formError, setFormError] = useState('');
  const [viewingArticle, setViewingArticle] = useState(null);

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
    if (!window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) return;
    try {
      const res = await fetch(`/api/articles/admin/${id}`, { method: 'DELETE', credentials: 'include' });
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

  const openEditModal = (article) => {
    setEditingId(article.id);
    const currentCategory = String(article.category || '').toLowerCase();
    setFormData({
      title: article.title,
      content: article.content,
      category: ARTICLE_CATEGORIES.some((c) => c.value === currentCategory)
        ? currentCategory
        : DEFAULT_CATEGORY,
      excerpt: article.excerpt || '',
      cover_image: article.cover_image || ''
    });
    setFormError('');
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ title: '', content: '', category: DEFAULT_CATEGORY, excerpt: '', cover_image: '' });
    setFormError('');
    setShowModal(true);
  };

  const navigateToArticle = (article) => {
    setViewingArticle(article);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim() || !formData.content.trim()) {
      setFormError('Judul dan konten wajib diisi');
      return;
    }

    try {
      const url = editingId ? `/api/articles/admin/${editingId}` : '/api/articles/admin';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.message || `Gagal ${editingId ? 'mengubah' : 'menambah'} artikel`);
        return;
      }

      setShowModal(false);
      fetchArticles();
    } catch (err) {
      console.error(err);
      setFormError(`Gagal ${editingId ? 'mengubah' : 'menambah'} artikel`);
    }
  };

  const closeModal = () => {
    setViewingArticle(null);
  };

  if (loading) return <div>Memuat artikel...</div>;

  return (
    <div className="tab-panel">
      <div className="card" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h3>Manajemen Artikel</h3>
          <p className="hint">Kelola konten edukasi untuk pengguna</p>
          <p style={{ marginTop: '16px' }}>Total artikel: <strong>{articles.length}</strong></p>
        </div>
        <button
          className="btn btn-primary"
          onClick={openAddModal}
        >
          + Tambah Artikel
        </button>
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
                    <span className="tag">{categoryLabel(article.category)}</span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {new Date(article.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', display: 'flex', gap: '4px', justifyContent: 'center' }}>
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={() => navigateToArticle(article)}
                    >
                      Lihat
                    </button>
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={() => openEditModal(article)}
                    >
                      Edit
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

      {showModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="card"
            style={{ width: '90%', maxWidth: '560px', maxHeight: '85vh', overflowY: 'auto', padding: '24px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: '16px' }}>{editingId ? 'Edit Artikel' : 'Tambah Artikel'}</h3>

            {formError && (
              <div style={{ marginBottom: '12px', padding: '10px', background: 'rgba(239,68,68,0.1)', color: 'var(--error)', borderRadius: '8px', fontSize: '14px' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '14px' }}>Judul *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Judul artikel"
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--outline-variant)', borderRadius: '8px', fontSize: '14px' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '14px' }}>Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--outline-variant)', borderRadius: '8px', fontSize: '14px' }}
                >
                  {ARTICLE_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '14px' }}>Ringkasan</label>
                <input
                  type="text"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Ringkasan singkat artikel"
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--outline-variant)', borderRadius: '8px', fontSize: '14px' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '14px' }}>URL Cover Image</label>
                <input
                  type="url"
                  value={formData.cover_image}
                  onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--outline-variant)', borderRadius: '8px', fontSize: '14px' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '14px' }}>Konten *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Tulis konten artikel di sini"
                  rows={8}
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--outline-variant)', borderRadius: '8px', fontSize: '14px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Perbarui' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingArticle && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={closeModal}
        >
          <div
            className="card"
            style={{ width: '90%', maxWidth: '640px', maxHeight: '85vh', overflowY: 'auto', padding: '24px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ marginBottom: '8px' }}>{viewingArticle.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="tag">{categoryLabel(viewingArticle.category)}</span>
                  <span className="hint">
                    {new Date(viewingArticle.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </div>
              <button className="btn btn-sm btn-ghost" onClick={closeModal} style={{ flexShrink: 0 }}>Tutup</button>
            </div>
            {viewingArticle.excerpt && (
              <p className="hint" style={{ marginBottom: '12px', fontStyle: 'italic' }}>{viewingArticle.excerpt}</p>
            )}
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, color: 'var(--on-surface)' }}>
              {viewingArticle.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminArticles;
