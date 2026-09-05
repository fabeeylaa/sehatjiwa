CREATE TABLE friendships (
  id SERIAL PRIMARY KEY,
  requester_id INT REFERENCES users(id) ON DELETE CASCADE,
  addressee_id INT REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(requester_id, addressee_id),
  CHECK (requester_id != addressee_id)
);