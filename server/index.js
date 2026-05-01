const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data', 'tasks.json');

// Middleware
app.use(express.json());
app.use(cors());

// Helper: Load tasks from JSON file
function loadTasks() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading tasks:', err.message);
    return [];
  }
}

// Helper: Save tasks to JSON file (atomic write)
function saveTasks(tasks) {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const tmpFile = DATA_FILE + '.tmp';
  fs.writeFileSync(tmpFile, JSON.stringify(tasks, null, 2), 'utf8');
  fs.renameSync(tmpFile, DATA_FILE);
}

// GET /api/tasks - Returns all tasks
app.get('/api/tasks', (req, res) => {
  try {
    const tasks = loadTasks();
    res.json({ success: true, data: tasks });
  } catch (err) {
    console.error('GET /api/tasks error:', err.message);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to retrieve tasks' }
    });
  }
});

// POST /api/tasks - Creates a new task
app.post('/api/tasks', (req, res) => {
  try {
    const { text } = req.body;

    // Validation
    if (text === undefined || text === null || text === '') {
      return res.status(400).json({
        success: false,
        error: { code: 'EMPTY_TASK_TEXT', message: 'Task cannot be empty' }
      });
    }

    if (typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_TASK_TEXT', message: 'Task text must be a string' }
      });
    }

    const trimmedText = text.trim();

    if (trimmedText.length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_TASK_TEXT', message: 'Task cannot be only whitespace' }
      });
    }

    if (trimmedText.length > 500) {
      return res.status(400).json({
        success: false,
        error: { code: 'TASK_TOO_LONG', message: 'Task must be 500 characters or less' }
      });
    }

    const now = new Date().toISOString();
    const newTask = {
      id: uuidv4(),
      text: trimmedText,
      completed: false,
      createdAt: now,
      updatedAt: now
    };

    const tasks = loadTasks();
    tasks.push(newTask);
    saveTasks(tasks);

    res.status(201).json({ success: true, data: newTask });
  } catch (err) {
    console.error('POST /api/tasks error:', err.message);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to create task' }
    });
  }
});

// PATCH /api/tasks/:id - Toggle task completion
app.patch('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const tasks = loadTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: { code: 'TASK_NOT_FOUND', message: 'Task not found' }
      });
    }

    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    tasks[taskIndex].updatedAt = new Date().toISOString();

    saveTasks(tasks);

    res.json({ success: true, data: tasks[taskIndex] });
  } catch (err) {
    console.error('PATCH /api/tasks/:id error:', err.message);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to update task' }
    });
  }
});

// DELETE /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const tasks = loadTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: { code: 'TASK_NOT_FOUND', message: 'Task not found' }
      });
    }

    const deletedTask = tasks[taskIndex];
    tasks.splice(taskIndex, 1);
    saveTasks(tasks);

    res.json({ success: true, data: deletedTask });
  } catch (err) {
    console.error('DELETE /api/tasks/:id error:', err.message);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to delete task' }
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Todo API server running on port ${PORT}`);
});

module.exports = app;
