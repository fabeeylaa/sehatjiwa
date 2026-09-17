import './ArticlesPreview.css';

function ArticlesPreview() {
  const articles = [
    {
      category: 'Tips Kuliah',
      title: '5 Cara Mudah Kurangi Stres Saat UTS',
      readTime: '4 menit baca',
      thumbClass: 'article-thumb--1',
    },
    {
      category: 'Pola Makan',
      title: 'Makanan yang Baik untuk Kesehatan Mental',
      readTime: '5 menit baca',
      thumbClass: 'article-thumb--2',
    },
    {
      category: 'Aktivitas',
      title: 'Gerak Tubuh, Tenangkan Pikiran',
      readTime: '3 menit baca',
      thumbClass: 'article-thumb--3',
    },
  ];

  return (
    <section className="articles-preview" id="education">
      <div className="articles-inner">
        <div className="articles-text">
          <span className="preview-label">Artikel & Edukasi</span>
          <h2 className="preview-title">
            Artikel yang nggak bikin<br />
            pusing bacanya.
          </h2>
          <p className="preview-desc">
            Ditulis buat kehidupan mahasiswa — soal deadline, ujian, sosial,
            dan pola hidup. Ringan, relatable, dan actionable.
          </p>
          <a href="/auth" className="btn btn-primary">
            Jelajahi Artikel
          </a>
        </div>

        <div className="articles-visual">
          <div className="articles-grid">
            {articles.map((article, idx) => (
              <article className="article-card" key={idx}>
                <div className={`article-thumb ${article.thumbClass}`}>
                  <span>{article.category}</span>
                </div>
                <div className="article-body">
                  <span className="article-category">{article.category}</span>
                  <h3 className="article-title">{article.title}</h3>
                  <span className="article-readtime">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {article.readTime}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ArticlesPreview;