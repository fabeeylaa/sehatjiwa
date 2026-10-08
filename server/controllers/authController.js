import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const register = async (req, res) => {
  const { name, email, password, username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username wajib diisi' });
  }

  try {
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email atau username sudah dipakai' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      'INSERT INTO users (name, email, username, password) VALUES ($1, $2, $3, $4) RETURNING id, name, email, username, role',
      [name, email, username, hashedPassword]
    );

    res.status(201).json({ message: 'Registrasi berhasil', user: newUser.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: "Email atau password salah" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email atau password salah" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // nanti diganti true kalau udah production (HTTPS)
      maxAge: 24 * 60 * 60 * 1000, // 1 hari
    });

    res.status(200).json({
      message: "Login berhasil",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar_url: user.avatar_url,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, username, avatar_url, role FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    res.status(200).json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout berhasil' });
};

export const updateProfile = async (req, res) => {
  const { username } = req.body;
  const avatarUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const userResult = await pool.query(
      'SELECT username, avatar_url FROM users WHERE id = $1',
      [req.user.id]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    const newUsername = username?.trim() || userResult.rows[0].username;
    if (newUsername !== userResult.rows[0].username) {
      if (!/^[a-zA-Z0-9_]{3,20}$/.test(newUsername)) {
        return res.status(400).json({
          message: 'Username harus 3-20 karakter (huruf, angka, underscore)',
        });
      }
      const duplicate = await pool.query(
        'SELECT id FROM users WHERE username = $1 AND id != $2',
        [newUsername, req.user.id]
      );
      if (duplicate.rows.length > 0) {
        return res.status(400).json({ message: 'Username sudah dipakai' });
      }
    }

    const newAvatarUrl = avatarUrl || userResult.rows[0].avatar_url;
    const result = await pool.query(
      'UPDATE users SET username = $1, avatar_url = $2 WHERE id = $3 RETURNING id, name, email, username, avatar_url, role',
      [newUsername, newAvatarUrl, req.user.id]
    );

    res.status(200).json({ message: 'Profil berhasil diupdate', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};