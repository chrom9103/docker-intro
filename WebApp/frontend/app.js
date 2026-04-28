const API_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  document.getElementById('taskForm').addEventListener('submit', addTask);
});

async function loadTasks() {
  const tasksList = document.getElementById('tasksList');
  
  try {
    const response = await fetch(`${API_URL}/tasks`);
    const tasks = await response.json();

    if (tasks.length === 0) {
      tasksList.innerHTML = '<p>タスクはありません</p>';
      return;
    }

    tasksList.innerHTML = tasks.map(task => {
      let html = `<div class="task-item">
        <div class="task-title">${escapeHtml(task.title)}</div>`;
      
      if (task.time) {
        const date = new Date(task.time).toLocaleString('ja-JP');
        html += `<div class="task-time">期限: ${date}</div>`;
      }
      
      if (task.note) {
        html += `<div class="task-note">${escapeHtml(task.note)}</div>`;
      }
      
      html += `<div class="task-date">作成: ${new Date(task.created_at).toLocaleString('ja-JP')}</div>
        <button onclick="deleteTask(${task.id})">削除</button>
      </div>`;
      
      return html;
    }).join('');
  } catch (error) {
    tasksList.innerHTML = `<p style="color: red;">エラー: ${error.message}</p>`;
  }
}

async function addTask(e) {
  e.preventDefault();
  
  const title = document.getElementById('taskTitle').value;
  const time = document.getElementById('taskTime').value;
  const note = document.getElementById('taskNote').value;

  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        time: time || null,
        note: note.trim() || null
      })
    });

    if (response.ok) {
      document.getElementById('taskForm').reset();
      loadTasks();
    }
  } catch (error) {
    alert(`エラー: ${error.message}`);
  }
}

async function deleteTask(id) {
  if (!confirm('削除してよろしいですか？')) return;

  try {
    await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
    loadTasks();
  } catch (error) {
    alert(`エラー: ${error.message}`);
  }
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
