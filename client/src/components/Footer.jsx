import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            SehatJiwa
          </div>
          <p className="footer-desc">
            Pendamping kesehatan mental untuk mahasiswa Indonesia. Mulai langkah kecilmu hari ini.
          </p>
        </div>

        <div className="footer-column">
          <h4>Layanan</h4>
          <a href="#features">Fitur</a>
          <a href="#screening">Screening</a>
          <a href="#habit-tracker">Habit Tracker</a>
          <a href="#education">Edukasi</a>
        </div>

        <div className="footer-column">
          <h4>Komunitas</h4>
          <a href="/auth">Daftar</a>
          <a href="/auth">Masuk</a>
          <a href="#">Testimoni</a>
        </div>

        <div className="footer-column">
          <h4>Bantuan</h4>
          <a href="#">FAQ</a>
          <a href="#">Kebijakan Privasi</a>
          <a href="#">Kontak Kami</a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-disclaimer">
          SehatJiwa tidak merupakan pengganti konsultasi kesehatan mental atau
          bantuan medis profesional. Segala kondisi kesehatan, hubungi
          ahli atau fasilitas kesehatan terdekat.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
