-- 011_seed_articles.sql
-- Aman dijalankan berulang kali.
-- 1) Menyeragamkan kategori artikel ke 4 nilai yang dipakai seluruh aplikasi:
--    mental health, tidur, nutrisi, olahraga (huruf kecil).
-- 2) Menambahkan artikel awal supaya halaman Edukasi dan rekomendasi hasil
--    screening langsung berisi. Isinya contoh singkat, boleh diganti lewat
--    halaman admin. Teks sengaja memakai karakter ASCII biasa supaya aman
--    dijalankan dari pgAdmin tanpa masalah encoding.

-- Artikel lama (kalau ada) dipindah ke kategori baru
UPDATE articles SET category = 'mental health'
WHERE LOWER(category) IN ('stres', 'kecemasan', 'depresi', 'mental');

UPDATE articles SET category = LOWER(category)
WHERE category <> LOWER(category);

INSERT INTO articles (title, slug, excerpt, content, category) VALUES
(
  'Mengenali Tanda Stres dan Cara Meresponsnya',
  'mengenali-tanda-stres',
  'Stres itu wajar, tapi penting tahu kapan tubuh dan pikiranmu sudah meminta jeda.',
  $$Stres adalah respons alami tubuh terhadap tekanan, misalnya tugas yang menumpuk atau jadwal yang padat. Dalam kadar ringan, stres bisa membuatmu lebih fokus. Masalah muncul ketika stres berlangsung lama tanpa jeda.
Tanda yang sering muncul antara lain sulit tidur, mudah marah atau cemas, sulit berkonsentrasi, sakit kepala atau otot tegang, serta kehilangan minat pada hal yang biasanya kamu suka.
Beberapa langkah kecil yang bisa dicoba: pecah tugas besar menjadi bagian-bagian kecil, beri jeda singkat setiap 45 sampai 60 menit, bergerak sebentar, dan ceritakan bebanmu kepada orang yang kamu percaya.
Artikel ini bukan pengganti konsultasi profesional. Kalau kamu merasa kewalahan atau keadaan tidak membaik, bicaralah dengan konselor atau tenaga kesehatan mental.$$,
  'mental health'
),
(
  'Latihan Napas Dalam untuk Menenangkan Diri',
  'latihan-napas-dalam',
  'Cara sederhana menenangkan tubuh saat cemas atau tegang, bisa dilakukan di mana saja.',
  $$Saat cemas, napas biasanya jadi pendek dan cepat. Napas yang lambat dan dalam memberi sinyal ke tubuh bahwa situasinya aman, sehingga detak jantung dan ketegangan otot perlahan turun.
Cobalah langkah ini. Duduk dengan nyaman dan letakkan satu tangan di perut. Tarik napas lewat hidung selama 4 hitungan sampai perutmu mengembang. Hembuskan perlahan lewat mulut selama 6 hitungan. Ulangi selama 3 sampai 5 menit.
Lakukan latihan ini saat merasa tegang, sebelum presentasi atau ujian, atau menjelang tidur. Semakin sering dilatih di waktu tenang, semakin mudah dipakai saat dibutuhkan.
Kalau kamu merasa pusing, kembalilah bernapas seperti biasa. Latihan ini membantu rasa tenang sehari-hari, tetapi bukan pengganti bantuan profesional bila kecemasanmu mengganggu aktivitas.$$,
  'mental health'
),
(
  'Kebiasaan Sederhana untuk Tidur Lebih Nyenyak',
  'kebiasaan-tidur-nyenyak',
  'Tidur berkualitas dimulai dari kebiasaan kecil yang konsisten setiap hari.',
  $$Kebanyakan orang dewasa membutuhkan sekitar 7 sampai 9 jam tidur setiap malam. Tidur yang cukup membantu otak mengolah emosi dan menyimpan memori, sehingga mood dan konsentrasi esok hari lebih baik.
Coba biasakan tidur dan bangun di jam yang sama, termasuk akhir pekan. Kurangi kafein sore hari dan hindari makan berat tepat sebelum tidur. Buat kamar senyap, gelap, dan sejuk.
Satu jam sebelum tidur, jauhi layar ponsel dan media sosial. Ganti dengan aktivitas yang menenangkan seperti membaca, menulis jurnal singkat, atau peregangan ringan.
Kalau kamu sulit tidur selama berminggu-minggu meski sudah mencoba kebiasaan di atas, pertimbangkan berkonsultasi dengan tenaga kesehatan.$$,
  'tidur'
),
(
  'Kenapa Begadang Memengaruhi Mood dan Konsentrasi',
  'begadang-dan-mood',
  'Mengorbankan tidur demi tugas sering membuat hasil belajar justru menurun.',
  $$Saat kurang tidur, bagian otak yang mengatur emosi menjadi lebih reaktif, sedangkan kemampuan berpikir jernih dan mengingat menurun. Itu sebabnya setelah begadang kamu lebih mudah kesal dan sulit fokus.
Belajar sampai larut malam sering terasa produktif, tetapi informasi yang dipelajari lebih sulit tersimpan karena otak butuh tidur untuk merapikan memori.
Sebagai gantinya, mulai belajar lebih awal dengan sesi pendek, tetapkan jam berhenti, dan prioritaskan materi yang paling penting. Kalau terpaksa begadang sesekali, usahakan tidur lebih cukup di malam berikutnya.
Tidur bukan waktu yang terbuang. Itu bagian dari proses belajar dan menjaga kesehatan mentalmu.$$,
  'tidur'
),
(
  'Pola Makan Seimbang untuk Mendukung Energi dan Mood',
  'pola-makan-seimbang',
  'Apa yang kamu makan memengaruhi tenaga, fokus, dan suasana hatimu.',
  $$Tubuh dan otak membutuhkan energi yang stabil sepanjang hari. Pola makan seimbang membantu menjaga energi, konsentrasi, dan mood.
Usahakan setiap kali makan terdiri dari karbohidrat kompleks seperti nasi, ubi, atau roti gandum, protein seperti telur, ikan, tempe, atau tahu, serta sayur dan buah. Jangan lupa lemak sehat dari kacang-kacangan atau ikan.
Hindari melewatkan sarapan terlalu sering dan batasi makanan sangat manis atau gorengan berlebihan, karena lonjakan gula darah bisa diikuti rasa lemas.
Mulai dari satu perubahan kecil, misalnya menambah satu porsi sayur sehari atau mengganti minuman manis dengan air putih. Kalau punya kondisi kesehatan khusus, konsultasikan pola makan dengan ahli gizi.$$,
  'nutrisi'
),
(
  'Pentingnya Minum Air Putih Setiap Hari',
  'minum-air-putih',
  'Kurang cairan bisa membuat kamu lemas, sulit fokus, dan mudah sakit kepala.',
  $$Tubuh kita sebagian besar terdiri dari air. Saat kurang cairan, tubuh bisa terasa lemas, kepala pusing, dan sulit berkonsentrasi.
Patokan umum yang sering dipakai adalah sekitar 8 gelas sehari, tetapi kebutuhan tiap orang berbeda tergantung aktivitas, cuaca, dan kondisi tubuh. Warna urine kuning pucat biasanya tanda cairanmu cukup.
Agar lebih mudah, bawa botol minum sendiri, minum segelas setelah bangun tidur, dan pasang pengingat di sela jadwal. Kamu juga bisa memakai fitur Habit Tracker untuk mencatat kebiasaan ini.
Batasi minuman manis dan berkafein tinggi sebagai pengganti air putih.$$,
  'nutrisi'
),
(
  'Jalan Kaki 15 Menit: Olahraga Ringan yang Berdampak',
  'jalan-kaki-15-menit',
  'Tidak perlu alat atau gym. Jalan kaki singkat setiap hari sudah membantu tubuh dan pikiran.',
  $$Aktivitas fisik membantu tubuh melepaskan ketegangan dan banyak orang merasa lebih segar setelahnya. Jalan kaki adalah cara paling mudah untuk memulai.
WHO menyarankan orang dewasa melakukan aktivitas fisik intensitas sedang sekitar 150 menit per minggu. Jalan kaki 15 menit setiap hari sudah menjadi langkah awal yang baik menuju target itu.
Coba jalan setelah makan siang, ke kampus atau tempat kerja, atau saat istirahat belajar. Pilih tempat yang nyaman, dan kalau bisa ajak teman supaya lebih semangat.
Mulai dari yang ringan dan tingkatkan perlahan. Kalau punya kondisi kesehatan tertentu, sesuaikan dengan saran tenaga kesehatan.$$,
  'olahraga'
),
(
  'Peregangan Singkat di Sela Belajar atau Bekerja',
  'peregangan-singkat',
  'Duduk lama membuat badan kaku. Peregangan 3 menit bisa membantu.',
  $$Duduk berjam-jam di depan laptop membuat leher, bahu, dan punggung tegang, dan ketegangan fisik sering ikut memengaruhi suasana hati.
Setiap satu jam, berdirilah dan lakukan beberapa gerakan: putar bahu ke belakang 10 kali, miringkan kepala perlahan ke kiri dan kanan masing-masing 15 detik, rentangkan kedua tangan ke atas sambil menarik napas, lalu tekuk badan ke depan dengan lutut sedikit ditekuk.
Gerakan harus terasa meregang, bukan sakit. Hentikan kalau ada nyeri tajam.
Jadikan peregangan bagian dari jeda belajarmu, misalnya setiap kali satu sesi fokus selesai.$$,
  'olahraga'
)
ON CONFLICT (slug) DO NOTHING;
