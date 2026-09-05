import pool from "../config/db.js";

export const createChallenge = async (req, res) => {
  const { title, description, habit_type, duration_days, max_participants } = req.body;
  const userId = req.user.id;

  if (!title || !habit_type || !duration_days) {
    return res.status(400).json({ message: 'Title, habit_type, dan duration_days wajib diisi' });
  }

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + parseInt(duration_days));

  try {
    const result = await pool.query(
      `INSERT INTO challenges (title, description, habit_type, duration_days, max_participants, end_date, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, description || null, habit_type, duration_days, max_participants || null, endDate, userId]
    );

    const challenge = result.rows[0];

    await pool.query(
      'INSERT INTO challenge_participants (challenge_id, user_id) VALUES ($1, $2)',
      [challenge.id, userId]
    );

    res.status(201).json(challenge);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getChallenges = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT
        c.*,
        COUNT(cp.id)::INT AS participant_count,
        BOOL_OR(cp.user_id = $1) AS is_joined
      FROM challenges c
      LEFT JOIN challenge_participants cp ON cp.challenge_id = c.id
      GROUP BY c.id
      ORDER BY c.created_at DESC`,
      [userId],
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const joinChallenge = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const challenge = await pool.query('SELECT * FROM challenges WHERE id = $1', [id]);

    if (challenge.rows.length === 0) {
      return res.status(404).json({ message: 'Challenge tidak ditemukan' });
    }

    if (challenge.rows[0].max_participants) {
      const countResult = await pool.query(
        'SELECT COUNT(*)::INT AS count FROM challenge_participants WHERE challenge_id = $1',
        [id]
      );
      if (countResult.rows[0].count >= challenge.rows[0].max_participants) {
        return res.status(400).json({ message: 'Challenge sudah penuh' });
      }
    }

    const result = await pool.query(
      'INSERT INTO challenge_participants (challenge_id, user_id) VALUES ($1, $2) RETURNING *',
      [id, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ message: 'Kamu sudah join challenge ini' });
    }
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};