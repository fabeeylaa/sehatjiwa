import './Articles.css';

function Articles() {
  const articles = [
    {
      tag: 'Tips Kesehatan',
      title: '5 Cara Mudah Kurangi Stres Saat UTS',
      excerpt: 'Ditulis buat kamu yang lagi stress menghadapi ujian. Dijamin nggak pake ribet.',
    },
    {
      tag: 'Pola Makan',
      title: 'Makanan yang Baik untuk Kesehatan Mental',
      excerpt: 'Apa yang kamu makan bisa mempengaruhi mood dan energi. Simak rekomendasinya.',
    },
    {
      tag: 'Aktivitas',
      title: 'Gerak Tubuh, Tenangkan Pikiran',
      excerpt: 'Kaitan antara olahraga ringan dan kesehatan mental yang sering diabaikan.',
    },
  ];

  return (
    <section className="articles" id="articles">
      <div className="container">
        <div className="articles-header">
          <h2>Artikel & Edukasi</h2>
          <p>Insight seputar kesehatan mental dan kebiasaan sehat untuk kehidupan mahasiswa</p>
        </div>

        <div className="articles-grid">
          {articles.map((article, i) => (
            <article className="article-card" key={i}>
              <div className="article-thumbnail">
                <span>{article.tag}</span>
              </div>
              <div className="article-content">
                <span className="article-tag">{article.tag}</span>
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
                <a href="#" className="article-link">
                  Baca Selengkapnya
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="articles-cta">
          <a href="#" className="btn btn-outline">Lihat Semua Artikel</a>
        </div>
      </div>
    </section>
  );
}

export default Articles;
