CREATE TABLE assessments (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,   -- 'phq9' | 'gad7' | 'wellness_check'
  title VARCHAR(150) NOT NULL,
  instruction TEXT,
  source TEXT,                        -- referensi ilmiah, kosong utk custom
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assessment_questions (
  id SERIAL PRIMARY KEY,
  assessment_id INTEGER NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  order_number INTEGER NOT NULL,
  is_sensitive BOOLEAN DEFAULT FALSE   -- true utk item risiko (mis. PHQ-9 no.9)
);

CREATE TABLE assessment_options (
  id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL REFERENCES assessment_questions(id) ON DELETE CASCADE,
  option_text VARCHAR(150) NOT NULL,
  score_value INTEGER NOT NULL,
  order_number INTEGER NOT NULL
);

CREATE TABLE assessment_score_ranges (
  id SERIAL PRIMARY KEY,
  assessment_id INTEGER NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  min_score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  category_label VARCHAR(50) NOT NULL,
  result_message TEXT
);

CREATE TABLE assessment_results (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_id INTEGER NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  total_score INTEGER NOT NULL,
  category_label VARCHAR(50) NOT NULL,
  result_message TEXT,
  flagged BOOLEAN DEFAULT FALSE,       -- true kalau jawab item is_sensitive > 0
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assessment_answers (
  id SERIAL PRIMARY KEY,
  result_id INTEGER NOT NULL REFERENCES assessment_results(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES assessment_questions(id),
  option_id INTEGER NOT NULL REFERENCES assessment_options(id)
);

CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,       -- cocokkan dgn category_label
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);