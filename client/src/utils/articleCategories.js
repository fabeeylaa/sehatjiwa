// Daftar kategori artikel yang dipakai di seluruh aplikasi:
// form admin, tab halaman Edukasi, dan rekomendasi hasil screening.
// Nilai (value) disimpan huruf kecil di database dan harus sama dengan
// kategori yang dipakai server (articleController dan assessmentController).
export const ARTICLE_CATEGORIES = [
  { value: 'mental health', label: 'Mental Health' },
  { value: 'tidur', label: 'Tidur' },
  { value: 'nutrisi', label: 'Nutrisi' },
  { value: 'olahraga', label: 'Olahraga' },
];

export const categoryLabel = (value) => {
  const key = String(value || '').trim().toLowerCase();
  return ARTICLE_CATEGORIES.find((c) => c.value === key)?.label || value || '';
};
