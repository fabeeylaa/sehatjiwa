import pool from "../config/db.js";

export const getArticles = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query(
      "SELECT * FROM articles ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [limit, offset],
    );

    const countResult = await pool.query("SELECT COUNT(*) FROM articles");
    const total = parseInt(countResult.rows[0].count);

    res.status(200).json({
      items: result.rows,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const getArticleBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const result = await pool.query("SELECT * FROM articles WHERE slug = $1", [
      slug,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Artikel tidak ditemukan" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const createArticle = async (req, res) => {
  const { title, content, category, excerpt, cover_image } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({ message: 'Title, content, dan category wajib diisi' });
  }

  const slug = slugify(title);

  try {
    const result = await pool.query(
      `INSERT INTO articles (title, slug, content, category, excerpt, cover_image, author_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, slug, content, category, excerpt || null, cover_image || null, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ message: 'Judul artikel sudah dipakai (slug bentrok)' });
    }
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const updateArticle = async (req, res) => {
  const { id } = req.params;
  const { title, content, category, excerpt, cover_image } = req.body;

  try {
    const result = await pool.query(
      `UPDATE articles
       SET title = $1, content = $2, category = $3, excerpt = $4, cover_image = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 RETURNING *`,
      [title, content, category, excerpt || null, cover_image || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Artikel tidak ditemukan' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const deleteArticle = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM articles WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Artikel tidak ditemukan' });
    }

    res.status(200).json({ message: 'Artikel berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
