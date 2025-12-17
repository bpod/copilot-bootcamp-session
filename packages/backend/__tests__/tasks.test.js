const request = require('supertest');
const { app, db } = require('../src/app');

describe('Tasks API', () => {
  beforeEach(() => {
    // Clean up database before each test
    db.exec('DELETE FROM tasks');
  });

  afterAll(() => {
    // Close database connection
    db.close();
  });

  describe('GET /api/tasks', () => {
    test('returns empty array when no tasks exist', async () => {
      const response = await request(app).get('/api/tasks');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    test('returns all tasks sorted by due date', async () => {
      // Create tasks with different due dates
      const insertStmt = db.prepare('INSERT INTO tasks (title, due_date, status) VALUES (?, ?, ?)');
      insertStmt.run('Task 3', '2025-12-25', 'OPEN');
      insertStmt.run('Task 1', '2025-12-20', 'OPEN');
      insertStmt.run('Task 2', null, 'OPEN');
      
      const response = await request(app).get('/api/tasks');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);
      expect(response.body[0].title).toBe('Task 1'); // Earliest date first
      expect(response.body[1].title).toBe('Task 3');
      expect(response.body[2].title).toBe('Task 2'); // Null date last
    });

    test('filters tasks by status', async () => {
      const insertStmt = db.prepare('INSERT INTO tasks (title, status) VALUES (?, ?)');
      insertStmt.run('Open Task', 'OPEN');
      insertStmt.run('In Progress Task', 'IN_PROGRESS');
      insertStmt.run('Complete Task', 'COMPLETE');
      
      const response = await request(app).get('/api/tasks?status=OPEN');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Open Task');
    });

    test('searches tasks by title and description', async () => {
      const insertStmt = db.prepare('INSERT INTO tasks (title, description) VALUES (?, ?)');
      insertStmt.run('Buy groceries', 'Get milk and bread');
      insertStmt.run('Call dentist', 'Schedule appointment');
      insertStmt.run('Buy tickets', 'Concert on Friday');
      
      const response = await request(app).get('/api/tasks?search=buy');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body.map(t => t.title)).toContain('Buy groceries');
      expect(response.body.map(t => t.title)).toContain('Buy tickets');
    });
  });

  describe('GET /api/tasks/:id', () => {
    test('returns task by id', async () => {
      const insertStmt = db.prepare('INSERT INTO tasks (title) VALUES (?)');
      const result = insertStmt.run('Test Task');
      const taskId = result.lastInsertRowid;
      
      const response = await request(app).get(`/api/tasks/${taskId}`);
      
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Test Task');
    });

    test('returns 404 when task not found', async () => {
      const response = await request(app).get('/api/tasks/999');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Task not found');
    });

    test('returns 400 for invalid id', async () => {
      const response = await request(app).get('/api/tasks/invalid');
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Valid task ID is required');
    });
  });

  describe('POST /api/tasks', () => {
    test('creates task with required fields only', async () => {
      const taskData = { title: 'New Task' };
      
      const response = await request(app)
        .post('/api/tasks')
        .send(taskData);
      
      expect(response.status).toBe(201);
      expect(response.body.title).toBe('New Task');
      expect(response.body.status).toBe('OPEN');
      expect(response.body.id).toBeDefined();
    });

    test('creates task with all fields', async () => {
      const taskData = {
        title: 'Complete Task',
        description: 'Task description',
        due_date: '2025-12-31',
        status: 'IN_PROGRESS',
      };
      
      const response = await request(app)
        .post('/api/tasks')
        .send(taskData);
      
      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Complete Task');
      expect(response.body.description).toBe('Task description');
      expect(response.body.due_date).toBe('2025-12-31');
      expect(response.body.status).toBe('IN_PROGRESS');
    });

    test('returns 400 when title is missing', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ description: 'No title' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Task title is required');
    });

    test('returns 400 for invalid status', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task', status: 'INVALID' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid status');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    test('updates task with new values', async () => {
      const insertStmt = db.prepare('INSERT INTO tasks (title, status) VALUES (?, ?)');
      const result = insertStmt.run('Original Title', 'OPEN');
      const taskId = result.lastInsertRowid;
      
      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({ title: 'Updated Title', status: 'COMPLETE' });
      
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Title');
      expect(response.body.status).toBe('COMPLETE');
    });

    test('returns 404 when task not found', async () => {
      const response = await request(app)
        .put('/api/tasks/999')
        .send({ title: 'Updated' });
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Task not found');
    });

    test('returns 400 for empty title', async () => {
      const insertStmt = db.prepare('INSERT INTO tasks (title) VALUES (?)');
      const result = insertStmt.run('Test Task');
      const taskId = result.lastInsertRowid;
      
      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({ title: '' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('title cannot be empty');
    });
  });

  describe('PATCH /api/tasks/:id/status', () => {
    test('updates task status', async () => {
      const insertStmt = db.prepare('INSERT INTO tasks (title, status) VALUES (?, ?)');
      const result = insertStmt.run('Test Task', 'OPEN');
      const taskId = result.lastInsertRowid;
      
      const response = await request(app)
        .patch(`/api/tasks/${taskId}/status`)
        .send({ status: 'IN_PROGRESS' });
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('IN_PROGRESS');
      expect(response.body.title).toBe('Test Task'); // Other fields unchanged
    });

    test('returns 400 for invalid status', async () => {
      const insertStmt = db.prepare('INSERT INTO tasks (title) VALUES (?)');
      const result = insertStmt.run('Test Task');
      const taskId = result.lastInsertRowid;
      
      const response = await request(app)
        .patch(`/api/tasks/${taskId}/status`)
        .send({ status: 'INVALID' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Valid status is required');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    test('deletes task successfully', async () => {
      const insertStmt = db.prepare('INSERT INTO tasks (title) VALUES (?)');
      const result = insertStmt.run('Task to Delete');
      const taskId = result.lastInsertRowid;
      
      const response = await request(app).delete(`/api/tasks/${taskId}`);
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task deleted successfully');
      
      // Verify task is actually deleted
      const checkResponse = await request(app).get(`/api/tasks/${taskId}`);
      expect(checkResponse.status).toBe(404);
    });

    test('returns 404 when task not found', async () => {
      const response = await request(app).delete('/api/tasks/999');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Task not found');
    });
  });
});
