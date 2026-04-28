-- Tasks テーブルの作成
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  time TIMESTAMP,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックスの作成（パフォーマンス向上のため）
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);
