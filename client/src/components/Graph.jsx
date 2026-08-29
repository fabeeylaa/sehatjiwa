import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const waterData = [
  { day: 'Sen', value: 8, level: 'default' },
  { day: 'Sel', value: 4, level: 'low' },
  { day: 'Rab', value: 10, level: 'high' },
  { day: 'Kam', value: 7, level: 'default' },
  { day: 'Jum', value: 9, level: 'default' },
  { day: 'Sab', value: 6, level: 'default' },
  { day: 'Min', value: 11, level: 'high' },
];

const BAR_COLORS = {
  default: '#aee571',
  low: '#f6e58d',
  high: '#2e7d32',
};

function CircularProgress({ value, total, size = 90, stroke = 9 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / total, 1);
  const offset = circumference * (1 - progress);

  return (
    <div className="progress-ring">
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f0f0f0"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f6c453"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="progress-ring__label">
        {value}/{total}
      </span>
    </div>
  );
}

function Graph() {
  return (
    <section className="graph" id="graph">
      <div className="container">
        <h2 className="section-title">Statistik Kesehatan Mental</h2>

        <div className="dashboard">
          <div className="screening-card">
            <CircularProgress value={14} total={24} />
            <span className="eyebrow">Cek Kondisi Harian</span>
            <h3 className="screening-card__title">
              Screening 2 menit, tanpa drama.
            </h3>
          </div>

          <div className="habit-heading">
            <span className="eyebrow eyebrow--green">Habit Tracker</span>
            <h3 className="habit-heading__title">Progres kecil, terlihat jelas.</h3>
            <p className="habit-heading__sub">
              Nggak perlu spreadsheet ribet. Cukup centang tiap hari, SehatJiwa
              yang hitungin streak dan progresnya.
            </p>
          </div>

          <div className="chart-card">
            <div className="chart-card__header">
              <span className="chart-card__title">Air minum - 7 hari terakhir</span>
              <span className="chart-card__meta">8 Gelas/hari</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={waterData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={48}>
                  {waterData.map((entry, i) => (
                    <Cell key={i} fill={BAR_COLORS[entry.level]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Graph;
