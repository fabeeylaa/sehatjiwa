-- Deskripsi singkat yang mudah dipahami + penanda kuesioner "mulai dari sini".
-- Aman dijalankan berulang.
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS is_starter BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE assessments SET
  description = 'Cek suasana hati: apakah kamu akhir-akhir ini sering sedih, kehilangan minat, atau sulit tidur?'
WHERE code = 'phq9' AND description IS NULL;

UPDATE assessments SET
  description = 'Cek kecemasan: apakah kamu sering merasa khawatir berlebihan atau sulit untuk rileks?'
WHERE code = 'gad7' AND description IS NULL;

UPDATE assessments SET
  description = 'Cek kondisi umum sebagai mahasiswa: stres kuliah, kualitas tidur, dan dukungan di sekitarmu.',
  is_starter = TRUE
WHERE code = 'wellness_check' AND description IS NULL;
