import './ScreeningPreview.css';

function ScreeningPreview() {
  return (
    <section className="screening-preview" id="screening">
      <div className="screening-inner">
        <div className="preview-text">
          <span className="preview-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12h6m-6 4h6M9 8h6M7 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H7z" /></svg> CEK KONDISI HARIAN
          </span>
          <h2 className="preview-title">
            Screening 2 menit,<br />
            tanpa drama.
          </h2>
          <p className="preview-desc">
            Kenali kondisi kesehatan mentalmu melalui tes validasi ilmiah yang mudah diakses kapan saja. Cukup 2 menit untuk mendapatkan insight awal tentang kondisi mood, stres, dan energimu hari ini secara privat.
          </p>
          <a href="/auth" className="btn btn-primary">
            Coba Screening Sekarang
          </a>
        </div>

        <div className="screening-visual">
          <div className="assessment-card">
            <div className="progress-ring">
              <svg width="200" height="200">
                <circle cx="100" cy="100" r="85" fill="none" stroke="var(--mint-100)" strokeWidth="16" />
                <circle
                  cx="100" cy="100" r="85" fill="none"
                  stroke="var(--primary)"
                  strokeWidth="16"
                  strokeDasharray="534"
                  strokeDashoffset="220"
                  strokeLinecap="round"
                />
              </svg>
              <div className="ring-label">
                <span style={{fontSize: '32px'}}>14/24</span>
                <small>Progres Program:<br/>Hari 14 dari 24</small>
              </div>
            </div>

            <p className="assessment-tip">
              Saran : Jaga konsistensi, Anda di jalur yang benar!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ScreeningPreview;
