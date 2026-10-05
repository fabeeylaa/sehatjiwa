import ProgressRing from './ProgressRing';
import './Screening.css';

function Screening() {
  return (
    <section className="screening" id="screening">
      <div className="container">
        <div className="screening-card">
          <div className="screening-streak">14 hari berturut-turut</div>
          
          <ProgressRing value={14} total={24} size={100} stroke={12} />
          
          <div className="screening-text">
            <span className="eyebrow">CEK KONDISI HARIAN</span>
            <h2>Screening 2 menit, tanpa drama.</h2>
            <p>
              Kenali kondisi kesehatan mentalmu melalui tes validasi singkat yang mudah dijawab. Dalam 2 menit kamu mendapatkan insight langsung tentang kondisi mood, stres, dan energi harianmu secara privat.
            </p>
            <button className="btn btn-primary">
              Coba Screening Sekarang
            </button>
          </div>

          <div className="screening-tip">
            <strong>Saran:</strong> Jaga konsistensi. Anda di jalur yang benar!
          </div>
        </div>
      </div>
    </section>
  );
}

export default Screening;
