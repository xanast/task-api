const express = require('express');
const app = express();

app.use(express.json());

let tasks = [];
let idCounter = 1;

// GET all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// CREATE a task
app.post('/tasks', (req, res) => {
  const title = req.body.title;

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ message: 'title is required (string)' });
  }

  const task = { id: idCounter++, title, completed: false };
  tasks.push(task);
  res.status(201).json(task);
});

// UPDATE a task
app.put('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find(t => t.id === id);

  if (!task) return res.status(404).json({ message: 'Task not found' });

  const { title, completed } = req.body;

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ message: 'title must be a non-empty string' });
    }
    task.title = title;
  }

  if (completed !== undefined) {
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ message: 'completed must be boolean' });
    }
    task.completed = completed;
  }

  res.json(task);
});

// DELETE a task
app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const exists = tasks.some(t => t.id === id);

  if (!exists) return res.status(404).json({ message: 'Task not found' });

  tasks = tasks.filter(t => t.id !== id);
  res.status(204).send();
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
