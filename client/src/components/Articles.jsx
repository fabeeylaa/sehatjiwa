import { BookOpen } from 'lucide-react';
import './Articles.css';

function Articles() {
  const heroArticle = {
    tag: 'Nutrisi',
    title: 'Panduan Lengkap Memulai Pola Makan Sehat Harian',
    excerpt: 'Pelajari langkah-langkah praktis dan sederhana untuk mengubah kebiasaan makan Anda menjadi lebih bernutrisi tanpa mengorbankan rasa. Dari persiapan bahan hingga penyajian.',
    readTime: '5 menit baca',
    pattern: 'bg-pattern-hero'
  };

  const latestArticles = [
    {
      tag: 'Mental',
      title: '5 Teknik Relaksasi Cepat di Tengah Jam Kerja',
      excerpt: 'Metode pernapasan dan peregangan singkat yang terbukti mengurangi tingkat stres saat menghadapi tekanan tinggi.',
      readTime: '3 menit baca',
      pattern: 'bg-pattern-1'
    },
    {
      tag: 'Kebugaran',
      title: 'Latihan Ringan di Rumah Tanpa Alat Khusus',
      excerpt: 'Panduan gerakan fungsional sehari-hari menggunakan berat badan sendiri untuk menjaga kebugaran.',
      readTime: '7 menit baca',
      pattern: 'bg-pattern-3'
    },
    {
      tag: 'Kesehatan Umum',
      title: 'Menjaga Kesehatan Mental di Tengah Kesibukan',
      excerpt: 'Kesehatan mental sama pentingnya dengan kesehatan fisik. Temukan cara menjaga keseimbangannya.',
      readTime: '4 menit baca',
      pattern: 'bg-pattern-2'
    }
  ];

  return (
    <section className="articles-page" id="articles">
      <div className="container">
        
        <div className="articles-page-header">
          <div className="header-badge">
            <BookOpen size={14} className="badge-icon" />
            <span className="preview-label">Koleksi Artikel</span>
          </div>
          <h2>Insight & Edukasi</h2>
          <p>Temukan panduan, tips, dan wawasan terbaru untuk menjaga kesehatan fisik dan mental Anda setiap hari.</p>
        </div>

        <nav className="articles-tabs" role="tablist">
          <button className="tab-btn active" role="tab">Semua</button>
          <button className="tab-btn" role="tab">Nutrisi</button>
          <button className="tab-btn" role="tab">Mental</button>
          <button className="tab-btn" role="tab">Kebugaran</button>
        </nav>

        <div className="sec-title">
          <h3>Pilihan Editor</h3>
        </div>
        
        <article className="hero-article-card">
          <div className="hero-article-text">
            <p className="article-meta">{heroArticle.tag} <i>· {heroArticle.readTime}</i></p>
            <h3>{heroArticle.title}</h3>
            <p className="hero-excerpt">{heroArticle.excerpt}</p>
            <a className="btn-read-more" href="#">Baca Selengkapnya</a>
          </div>
          <div className={`hero-article-thumb ${heroArticle.pattern}`}></div>
        </article>

        <div className="sec-title flex-between">
          <h3>Artikel Terbaru</h3>
          <a className="more-link" href="#">Lihat Semua</a>
        </div>

        <div className="latest-articles-grid">
          <a className="latest-card-big pro-card" href="#">
            <div className={`latest-thumb ${latestArticles[0].pattern}`}></div>
            <p className="article-meta">{latestArticles[0].tag} <i>· {latestArticles[0].readTime}</i></p>
            <h4>{latestArticles[0].title}</h4>
            <p className="article-excerpt">{latestArticles[0].excerpt}</p>
          </a>
          
          <div className="latest-articles-stack">
            {latestArticles.slice(1).map((article, idx) => (
              <a className="latest-card-row pro-card" href="#" key={idx}>
                <div className={`latest-thumb-small ${article.pattern}`}></div>
                <div className="latest-card-content">
                  <p className="article-meta">{article.tag} <i>· {article.readTime}</i></p>
                  <h4>{article.title}</h4>
                  <p className="article-excerpt">{article.excerpt}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default Articles;
