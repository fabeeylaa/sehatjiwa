-- 010_ensure_schema.sql
-- Aman dijalankan berulang kali. Melengkapi tabel/kolom yang mungkin belum ada
-- kalau migrasi 001-009 dulu dijalankan tidak berurutan (mis. 003 dijalankan
-- sebelum tabel users ada, sehingga assessment_results gagal dibuat).
-- Jalankan di Query Tool pgAdmin pada database sehatjiwa.

-- dari 009
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE;

-- dari 005
ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE,
  ADD COLUMN IF NOT EXISTS excerpt VARCHAR(500),
  ADD COLUMN IF NOT EXISTS cover_image VARCHAR(500),
  ADD COLUMN IF NOT EXISTS author_id INT REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- dari 003 (bagian yang bergantung ke users)
CREATE TABLE IF NOT EXISTS assessment_results (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_id INTEGER NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  total_score INTEGER NOT NULL,
  category_label VARCHAR(50) NOT NULL,
  result_message TEXT,
  flagged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assessment_answers (
  id SERIAL PRIMARY KEY,
  result_id INTEGER NOT NULL REFERENCES assessment_results(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES assessment_questions(id),
  option_id INTEGER NOT NULL REFERENCES assessment_options(id)
);

-- dari 006, 007, 008
CREATE TABLE IF NOT EXISTS bookmarks (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  article_id INT REFERENCES articles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, article_id)
);

CREATE TABLE IF NOT EXISTS friendships (
  id SERIAL PRIMARY KEY,
  requester_id INT REFERENCES users(id) ON DELETE CASCADE,
  addressee_id INT REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(requester_id, addressee_id),
  CHECK (requester_id != addressee_id)
);

CREATE TABLE IF NOT EXISTS challenges (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  habit_type VARCHAR(30) NOT NULL,
  duration_days INT NOT NULL,
  max_participants INT,
  end_date TIMESTAMP,
  created_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS challenge_participants (
  id SERIAL PRIMARY KEY,
  challenge_id INT REFERENCES challenges(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(challenge_id, user_id)
);
