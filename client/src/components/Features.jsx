function Features() {
  const features = [
    {
      title: "Screening Sederhana",
      desc: "8 pertanyaan singkat tentang tidur, stres, dan energi. Hasilnya berupa rekomendasi umum, bukan diagnosis.",
    },
    {
      title: "Edukasi Kesehatan",
      desc: "Artikel singkat soal pola makan, olahraga, dan kesehatan mental — ditulis buat kehidupan kuliah, bukan jurnal medis.",
    },
    {
      title: "Habits Tracker",
      desc: "Catat air minum, tidur, dan olahraga harian. Lihat streak-mu tumbuh, literally tiap hari konsisten nambah satu daun.",
    },
  ];

  return (
    <section className="features" id="features">
      <div className="container">
        <h2 className="section-title">Fitur Kami</h2>
        <div className="features-grid">
          {features.map((item, i) => (
            <div className="feature-card" key={i}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
