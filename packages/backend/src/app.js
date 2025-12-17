const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Database = require('better-sqlite3');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize in-memory SQLite database
const db = new Database(':memory:');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    due_date TEXT,
    status TEXT DEFAULT 'OPEN' CHECK(status IN ('OPEN', 'IN_PROGRESS', 'COMPLETE')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert some initial sample tasks
const initialTasks = [
  { title: 'Complete project documentation', description: 'Write comprehensive docs for the TODO app', due_date: '2025-12-20', status: 'IN_PROGRESS' },
  { title: 'Review pull requests', description: 'Review and merge pending PRs', due_date: '2025-12-18', status: 'OPEN' },
  { title: 'Setup CI/CD pipeline', description: null, due_date: '2025-12-25', status: 'OPEN' },
  { title: 'Update dependencies', description: 'Update npm packages to latest versions', due_date: null, status: 'COMPLETE' },
];

const insertStmt = db.prepare('INSERT INTO tasks (title, description, due_date, status) VALUES (?, ?, ?, ?)');

initialTasks.forEach(task => {
  insertStmt.run(task.title, task.description, task.due_date, task.status);
});

console.log('In-memory database initialized with sample tasks');

// API Routes

/**
 * GET /api/tasks
 * Fetch all tasks with optional filtering and sorting
 * Query params: status (OPEN|IN_PROGRESS|COMPLETE), search (search in title/description)
 */
app.get('/api/tasks', (req, res) => {
  try {
    const { status, search } = req.query;
    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];

    // Filter by status
    if (status && ['OPEN', 'IN_PROGRESS', 'COMPLETE'].includes(status)) {
      query += ' AND status = ?';
      params.push(status);
    }

    // Search in title and description
    if (search && search.trim() !== '') {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search.trim()}%`;
      params.push(searchTerm, searchTerm);
    }

    // Sort by due_date (earliest first, NULL dates last), then by created_at
    query += ' ORDER BY CASE WHEN due_date IS NULL THEN 1 ELSE 0 END, due_date ASC, created_at DESC';

    const tasks = db.prepare(query).all(...params);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

/**
 * GET /api/tasks/:id
 * Fetch a single task by ID
 */
app.get('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

/**
 * POST /api/tasks
 * Create a new task
 * Body: { title, description?, due_date?, status? }
 */
app.post('/api/tasks', (req, res) => {
  try {
    const { title, description, due_date, status } = req.body;

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required' });
    }

    // Validate status if provided
    if (status && !['OPEN', 'IN_PROGRESS', 'COMPLETE'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be OPEN, IN_PROGRESS, or COMPLETE' });
    }

    const insertTaskStmt = db.prepare(
      'INSERT INTO tasks (title, description, due_date, status) VALUES (?, ?, ?, ?)'
    );
    
    const result = insertTaskStmt.run(
      title.trim(),
      description || null,
      due_date || null,
      status || 'OPEN'
    );
    
    const id = result.lastInsertRowid;
    const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

/**
 * PUT /api/tasks/:id
 * Update a task
 * Body: { title?, description?, due_date?, status? }
 */
app.put('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, due_date, status } = req.body;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }

    // Check if task exists
    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Validate title if provided
    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
      return res.status(400).json({ error: 'Task title cannot be empty' });
    }

    // Validate status if provided
    if (status && !['OPEN', 'IN_PROGRESS', 'COMPLETE'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be OPEN, IN_PROGRESS, or COMPLETE' });
    }

    // Update only provided fields
    const updateTaskStmt = db.prepare(`
      UPDATE tasks 
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          due_date = COALESCE(?, due_date),
          status = COALESCE(?, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    updateTaskStmt.run(
      title ? title.trim() : null,
      description !== undefined ? description : null,
      due_date !== undefined ? due_date : null,
      status || null,
      id
    );

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

/**
 * PATCH /api/tasks/:id/status
 * Update only the status of a task
 * Body: { status }
 */
app.patch('/api/tasks/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }

    if (!status || !['OPEN', 'IN_PROGRESS', 'COMPLETE'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required (OPEN, IN_PROGRESS, or COMPLETE)' });
    }

    // Check if task exists
    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updateStatusStmt = db.prepare(
      'UPDATE tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    );
    
    updateStatusStmt.run(status, id);

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ error: 'Failed to update task status' });
  }
});

/**
 * DELETE /api/tasks/:id
 * Delete a task
 */
app.delete('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }

    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const deleteStmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    const result = deleteStmt.run(id);

    if (result.changes > 0) {
      res.json({ message: 'Task deleted successfully', id: parseInt(id) });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = { app, db };