import pool from "../config/db.js";

export const addFriend = async (req, res) => {
  const { identifier } = req.body; // bisa email atau username
  const requesterId = req.user.id;

  try {
    const targetUser = await pool.query(
      "SELECT id FROM users WHERE email = $1 OR username = $1",
      [identifier],
    );

    if (targetUser.rows.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const addresseeId = targetUser.rows[0].id;

    if (addresseeId === requesterId) {
      return res
        .status(400)
        .json({ message: "Tidak bisa menambahkan diri sendiri" });
    }

    const result = await pool.query(
      "INSERT INTO friendships (requester_id, addressee_id) VALUES ($1, $2) RETURNING *",
      [requesterId, addresseeId],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res
        .status(400)
        .json({ message: "Request pertemanan sudah pernah dikirim" });
    }
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const getFriends = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT
        f.id,
        f.status,
        f.requester_id,
        f.addressee_id,
        CASE WHEN f.requester_id = $1 THEN 'outgoing' ELSE 'incoming' END AS direction,
        u.id AS friend_id,
        u.name,
        u.username
      FROM friendships f
      JOIN users u ON u.id = CASE WHEN f.requester_id = $1 THEN f.addressee_id ELSE f.requester_id END
      WHERE f.requester_id = $1 OR f.addressee_id = $1
      ORDER BY f.created_at DESC`,
      [userId],
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const respondFriend = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'accept' atau 'reject'
  const userId = req.user.id;

  if (!["accept", "reject"].includes(action)) {
    return res.status(400).json({ message: "Action harus accept atau reject" });
  }

  try {
    const friendship = await pool.query(
      "SELECT * FROM friendships WHERE id = $1",
      [id],
    );

    if (friendship.rows.length === 0) {
      return res.status(404).json({ message: "Request tidak ditemukan" });
    }

    if (friendship.rows[0].addressee_id !== userId) {
      return res
        .status(403)
        .json({ message: "Kamu tidak berhak merespon request ini" });
    }

    const newStatus = action === "accept" ? "accepted" : "rejected";

    const result = await pool.query(
      "UPDATE friendships SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [newStatus, id],
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
