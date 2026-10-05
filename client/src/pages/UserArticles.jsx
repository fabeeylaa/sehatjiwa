import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, AlertCircle, Apple, Brain, Activity, Heart, BookmarkCheck } from 'lucide-react';
import '../pages/Dashboard.css';
import './UserArticlesPolish.css';

function UserArticles() {
  const [articles, setArticles] = useState([]);
  const [bookmarks, setBookmarks] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Semua', 'Nutrisi', 'Mental', 'Kebugaran', 'Kesehatan Umum', 'Tersimpan'];

  const getCategoryConfig = (cat) => {
    switch(cat) {
      case 'Nutrisi': return { class: 'ph-a', icon: <Apple size={48} className="ph-illustration" /> };
      case 'Kebugaran': return { class: 'ph-d', icon: <Activity size={48} className="ph-illustration" /> };
      case 'Kesehatan Umum': return { class: 'ph-c', icon: <Heart size={48} className="ph-illustration" /> };
      default: return { class: 'ph-b', icon: <Brain size={48} className="ph-illustration" /> };
    }
  };

  const renderMedia = (article, extraClass = '') => {
    const config = getCategoryConfig(article.category);
    return (
      <div className={`edu-media ${extraClass}`}>
        {article.cover_image ? (
          <img src={article.cover_image} alt="" loading="lazy" />
        ) : (
          <div className={`ph ${config.class}`}>
            {config.icon}
            <span className="ph-chip">{article.category}</span>
          </div>
        )}
      </div>
    );
  };

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

  const dummyArticles = useMemo(() => [
    { id: 'dummy-featured', title: 'Panduan Lengkap Memulai Pola Makan Sehat Harian', category: 'Nutrisi', read_time: '5 menit baca', excerpt: 'Pelajari langkah-langkah praktis dan sederhana untuk mengubah kebiasaan makan Anda menjadi lebih bernutrisi tanpa mengorbankan rasa. Dari persiapan bahan hingga penyajian.', slug: 'pola-makan-sehat', cover_image: null, featured: true },
    { id: 'dummy-1', title: '5 Teknik Relaksasi Cepat di Tengah Jam Kerja', category: 'Mental', read_time: '3 menit baca', excerpt: 'Metode pernapasan dan peregangan singkat yang terbukti mengurangi tingkat stres saat beban kerja meningkat.', slug: 'teknik-relaksasi-cepat', cover_image: null },
    { id: 'dummy-2', title: 'Latihan Ringan di Rumah Tanpa Alat Khusus', category: 'Kebugaran', read_time: '7 menit baca', excerpt: 'Panduan gerakan fungsional sehari-hari menggunakan berat badan sendiri untuk menjaga kebugaran.', slug: 'latihan-ringan-rumah', cover_image: null },
    { id: 'dummy-3', title: 'Pentingnya Menjaga Kesehatan Mental di Tengah Kesibukan Modern', category: 'Kesehatan Umum', read_time: '4 menit baca', excerpt: 'Kesehatan mental sama pentingnya dengan kesehatan fisik dalam menjalani aktivitas sehari-hari.', slug: 'kesehatan-mental-kesibukan', cover_image: null },
  ], []);

  const displayArticles = useMemo(() => {
    let source = articles.length > 0 ? articles : dummyArticles;
    return source.filter(a => {
      const mCat = selectedCategory === 'Semua' 
        ? true 
        : selectedCategory === 'Tersimpan' 
          ? bookmarks.has(a.id) 
          : a.category === selectedCategory;
      const mSearch = searchQuery.trim() === '' || a.title.toLowerCase().includes(searchQuery.toLowerCase()) || (a.excerpt && a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
      return mCat && mSearch;
    });
  }, [articles, bookmarks, selectedCategory, searchQuery, dummyArticles]);

  if (loading) return <div className="tab-panel" style={{ padding: '24px' }}>Memuat...</div>;

  const featured = displayArticles.find(a => a.featured) || displayArticles[0];
  const rest = displayArticles.filter(a => a.id !== featured?.id);

  return (
    <div className="tab-panel" style={{ paddingBottom: '80px' }}>
      <header className="edu-head">
        <div>
          <h1>Artikel Kesehatan</h1>
          <p>Temukan panduan, tips, dan wawasan terbaru untuk menjaga kesehatan fisik dan mental Anda setiap hari.</p>
        </div>
        <div className="edu-search">
          <Search size={20} />
          <input type="text" placeholder="Cari artikel kesehatan..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} aria-label="Cari artikel kesehatan" />
          {searchQuery && <button onClick={() => setSearchQuery('')} aria-label="Bersihkan pencarian"><X size={16}/></button>}
        </div>
      </header>

      <nav className="edu-tabs" role="tablist">
        {categories.map(cat => (
          <button key={cat} role="tab" aria-selected={selectedCategory===cat} onClick={() => setSelectedCategory(cat)} className={`edu-tab ${selectedCategory===cat ? 'active' : ''}`}>
            {cat}
          </button>
        ))}
      </nav>

      {displayArticles.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          {selectedCategory === 'Tersimpan' ? (
            <>
              <BookmarkCheck size={48} style={{ margin: '0 auto 16px', color: 'var(--primary)' }} />
              <h3>Belum ada artikel tersimpan</h3>
              <button className="btn btn-ghost" onClick={() => setSelectedCategory('Semua')}>Jelajahi Artikel</button>
            </>
          ) : (
            <>
              <AlertCircle size={48} style={{ margin: '0 auto 16px', color: 'var(--gold)' }} />
              <h3>Tidak ada artikel cocok</h3>
              <button className="btn btn-ghost" onClick={() => { setSearchQuery(''); setSelectedCategory('Semua'); }}>Reset Filter</button>
            </>
          )}
        </div>
      ) : (
        <>
          {featured && (
            <section>
              <article className="edu-hero" style={{ marginTop: 0 }}>
                <div className="hero-text">
                  <p className="edu-meta">{featured.category}{featured.read_time && <i> · {featured.read_time}</i>}</p>
                  <h2>{featured.title}</h2>
                  <p>{featured.excerpt}</p>
                  <Link className="btn btn-primary" to={`/dashboard/articles/${featured.slug}`}>Baca Selengkapnya</Link>
                </div>
                {renderMedia(featured)}
              </article>
            </section>
          )}

           {rest.length > 0 && (
             <section>
               <div className="edu-sec-title">
                 <h2>Artikel Terbaru</h2>
                 <button className="edu-more" onClick={() => { setSearchQuery(''); setSelectedCategory('Semua'); }}>Lihat Semua</button>
               </div>
               <div className="edu-latest">
                 {rest[0] && (
                   <Link to={`/dashboard/articles/${rest[0].slug}`} className="edu-card-v2 big">
                     {renderMedia(rest[0])}
                     <p className="edu-meta">{rest[0].category}{rest[0].read_time && <i> · {rest[0].read_time}</i>}</p>
                     <h3>{rest[0].title}</h3>
                     <p className="edu-ex">{rest[0].excerpt}</p>
                   </Link>
                 )}
                 <div className="edu-stack">
                   {rest.slice(1, 4).map(article => (
                     <Link key={article.id} to={`/dashboard/articles/${article.slug}`} className="edu-card-v2 row">
                       {renderMedia(article)}
                       <div>
                         <p className="edu-meta">{article.category}{article.read_time && <i> · {article.read_time}</i>}</p>
                         <h3>{article.title}</h3>
                         <p className="edu-ex">{article.excerpt}</p>
                       </div>
                     </Link>
                   ))}
                 </div>
               </div>
             </section>
           )}
        </>
      )}
    </div>
  );
}

export default UserArticles;
