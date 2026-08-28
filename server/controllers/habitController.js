import pool from "../config/db.js";

export const createHabit = async (req, res) => {
  const { title, description, frequency, target_count } = req.body;

  try {
    const newHabit = await pool.query(
      `INSERT INTO habits (user_id, title, description, frequency, target_count)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.user.id, title, description, frequency || "daily", target_count || 1],
    );

    res.status(201).json({ message: "Habit berhasil dibuat", habit: newHabit.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const getHabits = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM habits WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id],
    );
    res.status(200).json({ habits: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const getHabitById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM habits WHERE id = $1 AND user_id = $2",
      [id, req.user.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Habit tidak ditemukan" });
    }

    res.status(200).json({ habit: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const updateHabit = async (req, res) => {
  const { id } = req.params;
  const { title, description, frequency, target_count } = req.body;

  try {
    const result = await pool.query(
      `UPDATE habits SET title = $1, description = $2, frequency = $3, target_count = $4
       WHERE id = $5 AND user_id = $6 RETURNING *`,
      [title, description, frequency, target_count, id, req.user.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Habit tidak ditemukan" });
    }

    res.status(200).json({ message: "Habit berhasil diupdate", habit: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const deleteHabit = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM habits WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Habit tidak ditemukan" });
    }

    res.status(200).json({ message: "Habit berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Tandai habit selesai untuk tanggal tertentu (default: hari ini)
export const logHabit = async (req, res) => {
  const { id } = req.params; // habit_id
  const { log_date, note } = req.body;

  try {
    const habit = await pool.query(
      "SELECT * FROM habits WHERE id = $1 AND user_id = $2",
      [id, req.user.id],
    );

    if (habit.rows.length === 0) {
      return res.status(404).json({ message: "Habit tidak ditemukan" });
    }

    const result = await pool.query(
      `INSERT INTO habit_logs (habit_id, user_id, log_date, note)
       VALUES ($1, $2, COALESCE($3, CURRENT_DATE), $4)
       ON CONFLICT (habit_id, log_date) DO UPDATE SET note = $4
       RETURNING *`,
      [id, req.user.id, log_date, note],
    );

    res.status(201).json({ message: "Habit berhasil dicatat", log: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const getHabitLogs = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM habit_logs WHERE habit_id = $1 AND user_id = $2 ORDER BY log_date DESC",
      [id, req.user.id],
    );
    res.status(200).json({ logs: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};