import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryLabel } from "../utils/articleCategories";
import "../pages/Dashboard.css";
import "./UserScreening.css";
import "./UserScreeningPolish.css";
import { Brain, HeartPulse, ClipboardCheck, ShieldCheck } from "lucide-react";

const scrIcons = [
  <Brain size={22} />,
  <HeartPulse size={22} />,
  <ClipboardCheck size={22} />,
];

const scrBadge = (label = "") => {
  const l = label.toLowerCase();
  if (l.includes("berat") || l.includes("perhatian")) return "scrx-badge-berat";
  if (l.includes("sedang")) return "scrx-badge-sedang";
  if (["ringan", "minimal", "baik", "normal"].some((k) => l.includes(k)))
    return "scrx-badge-ringan";
  return "";
};

const formatDateTime = (value) =>
  new Date(value).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatDate = (value) =>
  new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

function UserScreening() {
  // mode: 'home' (daftar + riwayat) | 'quiz' | 'result'
  const [mode, setMode] = useState("home");

  const [results, setResults] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [quiz, setQuiz] = useState(null); // { assessment, questions }
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({}); // { [question_id]: option_id }
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [outcome, setOutcome] = useState(null);

  const loadHome = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/assessments/history", { credentials: "include" }).then((r) =>
        r.json(),
      ),
      fetch("/api/assessments", { credentials: "include" }).then((r) =>
        r.json(),
      ),
    ])
      .then(([hist, list]) => {
        setResults(hist.history || []);
        setAssessments(list.assessments || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadHome();
  }, []);

  const startQuiz = async (id) => {
    setError("");
    try {
      const res = await fetch(`/api/assessments/${id}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal memuat soal");
      setQuiz(data);
      setCurrent(0);
      setAnswers({});
      setMode("quiz");
    } catch (err) {
      setError(err.message);
    }
  };

  const submitQuiz = async () => {
    setSubmitting(true);
    setError("");
    try {
      const payload = quiz.questions.map((q) => ({
        question_id: q.id,
        option_id: answers[q.id],
      }));
      const res = await fetch(`/api/assessments/${quiz.assessment.id}/submit`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal mengirim jawaban");
      setOutcome(data);
      setMode("result");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const backToHome = () => {
    setMode("home");
    setQuiz(null);
    setOutcome(null);
    setError("");
    loadHome();
  };

  if (loading) return <div>Memuat screening...</div>;

  // ===== TAMPILAN SOAL =====
  if (mode === "quiz" && quiz) {
    const total = quiz.questions.length;
    const q = quiz.questions[current];
    const isLast = current === total - 1;
    const percent = Math.round(((current + 1) / total) * 100);

    return (
      <div className="tab-panel">
        <div className="card">
          <h3>{quiz.assessment.title}</h3>
          {quiz.assessment.instruction && (
            <p className="hint">{quiz.assessment.instruction}</p>
          )}

          <div className="scr-progress">
            <div
              className="scr-progress-bar"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="scr-step">
            Pertanyaan {current + 1} dari {total}
          </div>

          <div className="scr-question" style={{ marginTop: "12px" }}>
            {q.question_text}
          </div>

          <div className="scr-options">
            {q.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`scr-option ${answers[q.id] === opt.id ? "selected" : ""}`}
                onClick={() => setAnswers({ ...answers, [q.id]: opt.id })}
              >
                {opt.option_text}
              </button>
            ))}
          </div>

          {error && <div className="scr-error">{error}</div>}

          <div className="scr-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() =>
                current === 0 ? backToHome() : setCurrent(current - 1)
              }
            >
              {current === 0 ? "Batal" : "Kembali"}
            </button>

            {isLast ? (
              <button
                type="button"
                className="btn btn-primary"
                disabled={!answers[q.id] || submitting}
                onClick={submitQuiz}
              >
                {submitting ? "Mengirim..." : "Kirim"}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                disabled={!answers[q.id]}
                onClick={() => setCurrent(current + 1)}
              >
                Lanjut
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== TAMPILAN HASIL =====
  if (mode === "result" && outcome) {
    const r = outcome.result;
    return (
      <div className="tab-panel">
        <div className="card">
          <h3>Hasil Screening</h3>
          <p className="hint">{quiz?.assessment?.title}</p>

          <div className="scrx-result-box"><div className="scr-result-score">{r.category_label}</div>
          <div className="history-score">Skor: {r.total_score}</div></div>

          {r.result_message && (
            <p className="scr-result-msg" style={{ marginTop: "12px" }}>
              {r.result_message}
            </p>
          )}

          {outcome.needs_immediate_attention && (
            <div className="scr-alert">
              Jawabanmu menunjukkan hal yang perlu perhatian segera. Kamu tidak
              sendirian. Jika kamu merasa ingin menyakiti diri sendiri, segera
              hubungi orang terdekat atau tenaga profesional, dan jika dalam
              keadaan darurat hubungi layanan darurat setempat.
            </div>
          )}

          {outcome.recommended_articles?.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <div className="history-date">Artikel yang disarankan</div>
              {outcome.recommended_articles.map((a) => (
                <Link
                  key={a.id}
                  to={`/dashboard/articles/${a.slug}`}
                  className="history-row scrx-rec-link"
                >
                  <div className="history-score">{a.title}</div>
                  <div className="history-score">{categoryLabel(a.category)}</div>
                </Link>
              ))}
            </div>
          )}

          <div className="scr-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={backToHome}
            >
              Selesai
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== TAMPILAN AWAL: DAFTAR KUESIONER + RIWAYAT =====
  return (
    <div className="tab-panel">
      <div className="scrx-hero">
        <h2>Kenali kondisimu, satu langkah kecil</h2>
        <p>Pilih kuesioner di bawah dan jawab sesuai yang kamu rasakan akhir-akhir ini. Tidak ada jawaban benar atau salah.</p>
        <span className="scrx-note"><ShieldCheck size={14} /> Hasil screening bukan diagnosis</span>
      </div>
      <div className="card">
        <h3>Mulai Screening</h3>
        <p className="hint">Pilih kuesioner yang ingin kamu isi</p>

        {error && <div className="scr-error">{error}</div>}

        {assessments.some((a) => a.is_starter) && (
          <p className="scrx-guide">
            Bingung mau pilih yang mana? Mulai dari yang bertanda{" "}
            <strong>Mulai dari sini</strong>, lalu lanjut ke yang lain bila perlu.
          </p>
        )}

        <div className="scr-list">
          {assessments.map((a, i) => (
            <div
              key={a.id}
              className={`scr-item ${a.is_starter ? "scrx-starter" : ""}`}
            >
              <div className="scrx-item-main"><span className={`scrx-icon scrx-tone-${i % 3}`}>{scrIcons[i % 3]}</span><div>
                <div className="scr-item-title">
                  {a.title}
                  {a.is_starter && (
                    <span className="scrx-starter-tag">Mulai dari sini</span>
                  )}
                </div>
                {(a.description || a.source) && (
                  <div className="scr-item-desc">{a.description || a.source}</div>
                )}
                <div className="scrx-item-meta">
                  {a.question_count > 0 && (
                    <span>
                      {a.question_count} pertanyaan · ±
                      {Math.max(1, Math.ceil(a.question_count / 5))} menit
                    </span>
                  )}
                  <span className={a.last_taken_at ? "scrx-done" : ""}>
                    {a.last_taken_at
                      ? `Terakhir diisi ${formatDate(a.last_taken_at)} · ${a.last_category}`
                      : "Belum pernah diisi"}
                  </span>
                </div>
              </div></div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => startQuiz(a.id)}
              >
                {a.last_taken_at ? "Ulangi" : "Mulai"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: "16px" }}>
        <h3>Riwayat Screening</h3>
        <p className="hint">Hasil screening terbaru kamu</p>

        {results.length === 0 ? (
          <p style={{ marginTop: "16px", color: "var(--on-surface-variant)" }}>
            Belum ada hasil screening. Mulai screening sekarang!
          </p>
        ) : (
          <div style={{ marginTop: "16px" }}>
            {results.map((result) => (
              <div key={result.id} className="history-row">
                <div>
                  <div className="scrx-hist-title">{result.assessment_title}</div>
                  <div className="history-date">
                    {formatDateTime(result.created_at)}
                  </div>
                  <span className={`scrx-badge ${scrBadge(result.category_label)}`}>{result.category_label}</span>
                </div>
                <div className="history-score scrx-score">
                  Skor: {result.total_score}
                  {result.max_score ? `/${result.max_score}` : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserScreening;
