const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL接続設定
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'user',
  password: process.env.POSTGRES_PASSWORD || 'password',
  host: process.env.POSTGRES_HOST || 'db',
  port: process.env.POSTGRES_PORT || 5432,
  database: process.env.POSTGRES_DB || 'task_db'
});

// ヘルスチェック
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// すべてのタスクを取得
app.get('/api/tasks', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, time, note, created_at FROM tasks ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// 新しいタスクを作成
app.post('/api/tasks', async (req, res) => {
  const { title, time, note } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO tasks (title, time, note) VALUES ($1, $2, $3) RETURNING id, title, time, note, created_at',
      [title, time || null, note || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// タスクを削除
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// エラーハンドリング
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
