import pool from '../config/db.js';

export const getAdminStats = async (req, res) => {
  try {
    const usersCount = await pool.query('SELECT COUNT(*)::int FROM users');
    const articlesCount = await pool.query('SELECT COUNT(*)::int FROM articles');
    const assessmentsCount = await pool.query('SELECT COUNT(*)::int FROM assessment_results');
    const habitsCount = await pool.query('SELECT COUNT(*)::int FROM habits');

    res.status(200).json({
      stats: {
        users: usersCount.rows[0].count,
        articles: articlesCount.rows[0].count,
        assessments: assessmentsCount.rows[0].count,
        habits: habitsCount.rows[0].count,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil statistik admin' });
  }
};

export const getAllAssessmentResults = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.id, r.total_score, r.category_label, r.flagged, r.created_at,
             u.name AS user_name, u.email AS user_email,
             a.title AS assessment_title
      FROM assessment_results r
      JOIN users u ON u.id = r.user_id
      JOIN assessments a ON a.id = r.assessment_id
      ORDER BY r.created_at DESC
      LIMIT 100
    `);
    res.status(200).json({ results: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil semua hasil assessment' });
  }
};
