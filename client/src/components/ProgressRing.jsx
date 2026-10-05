import './ProgressRing.css';

function ProgressRing({ value = 14, total = 24, size = 100, stroke = 12 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / total, 1);
  const offset = circumference * (1 - progress);

  return (
    <div className="screening-ring">
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--surface-container-high)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="screening-progress-label">
        {value}/{total}
      </span>
    </div>
  );
}

export default ProgressRing;
