import pool from "../config/db.js";

export const getBookmarks = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT articles.* FROM bookmarks
       JOIN articles ON bookmarks.article_id = articles.id
       WHERE bookmarks.user_id = $1
       ORDER BY bookmarks.created_at DESC`,
      [req.user.id],
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const addBookmark = async (req, res) => {
  const { article_id } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO bookmarks (user_id, article_id) VALUES ($1, $2) RETURNING *",
      [req.user.id, article_id],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ message: "Artikel sudah di-bookmark" });
    }
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const removeBookmark = async (req, res) => {
  const { articleId } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM bookmarks WHERE user_id = $1 AND article_id = $2 RETURNING id",
      [req.user.id, articleId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Bookmark tidak ditemukan" });
    }

    res.status(200).json({ message: "Bookmark berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
