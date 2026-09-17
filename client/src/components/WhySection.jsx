import './WhySection.css';

function WhySection() {
  return (
    <section className="why" id="features">
      <div className="why-header">
        <span className="section-label">Fitur Unggulan</span>
        <h2 className="why-title">
          Semua yang kamu butuhkan untuk kesehatan mental yang lebih baik
        </h2>
        <p>
          Temukan berbagai cara untuk menjaga kesehatan mentalmu setiap hari.
        </p>
      </div>

      <div className="why-grid">
        <div className="why-card">
          <div className="why-card-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 12h6m-6 4h6M9 8h6M7 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H7z" />
            </svg>
          </div>
          <h3>Self-Assessment</h3>
          <p>
            Cek kondisi mentalmu secara cepat dan privat.
          </p>
        </div>

        <div className="why-card">
          <div className="why-card-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 6.253v13m0-13C6.477 5.2 2 9.46 2 16c0 2.37.933 4.52 2.44 6l8.557-8.557c-.008-2.19.234-4.3.556-6.235.825-.37 1.67-.6 2.5-.65zm-6.5 6.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5z" />
            </svg>
          </div>
          <h3>Edukasi Relevan</h3>
          <p>
            Baca artikel yang relate dengan kehidupan kampusmu.
          </p>
        </div>

        <div className="why-card">
          <div className="why-card-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3>Habit Tracker</h3>
          <p>
            Bentuk kebiasaan sehat harian dengan mudah.
          </p>
        </div>
      </div>
    </section>
  );
}

export default WhySection;
