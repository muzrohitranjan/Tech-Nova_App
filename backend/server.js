const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// --- DB Helpers ---
const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// --- AUTH ---
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });
  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword, token: `demo-token-${user.id}` });
});

app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body;
  const db = readDB();
  if (db.users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'User already exists' });
  }
  const newUser = { id: Date.now(), email, password, name, isAdmin: false };
  db.users.push(newUser);
  writeDB(db);
  const { password: _, ...userWithoutPassword } = newUser;
  res.json({ user: userWithoutPassword, token: `demo-token-${newUser.id}` });
});

// --- USERS ---
app.get('/api/users/me', (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const userId = parseInt(token.split('-').pop());
  const db = readDB();
  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

app.put('/api/users/me', (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const userId = parseInt(token.split('-').pop());
  const db = readDB();
  const index = db.users.findIndex(u => u.id === userId);
  if (index === -1) return res.status(404).json({ error: 'User not found' });
  db.users[index] = { ...db.users[index], ...req.body };
  writeDB(db);
  const { password: _, ...userWithoutPassword } = db.users[index];
  res.json(userWithoutPassword);
});

// --- RECIPES ---
app.get('/api/recipes', (req, res) => {
  const db = readDB();
  const { status } = req.query;
  let recipes = db.recipes;
  if (status) recipes = recipes.filter(r => r.status === status);
  res.json(recipes);
});

app.get('/api/recipes/:id', (req, res) => {
  const db = readDB();
  const recipe = db.recipes.find(r => r.id === parseInt(req.params.id));
  if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
  res.json(recipe);
});

app.post('/api/recipes', (req, res) => {
  const db = readDB();
  const newRecipe = { id: Date.now(), status: 'pending', ...req.body };
  db.recipes.push(newRecipe);
  writeDB(db);
  res.status(201).json(newRecipe);
});

app.patch('/api/recipes/:id', (req, res) => {
  const db = readDB();
  const index = db.recipes.findIndex(r => r.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Recipe not found' });
  db.recipes[index] = { ...db.recipes[index], ...req.body };
  writeDB(db);
  res.json(db.recipes[index]);
});

app.delete('/api/recipes/:id', (req, res) => {
  const db = readDB();
  db.recipes = db.recipes.filter(r => r.id !== parseInt(req.params.id));
  writeDB(db);
  res.json({ success: true });
});

// --- ADMIN STATS ---
app.get('/api/admin/stats', (req, res) => {
  const db = readDB();
  const total = db.recipes.length;
  const pending = db.recipes.filter(r => r.status === 'pending').length;
  const approved = db.recipes.filter(r => r.status === 'approved').length;
  const rejected = db.recipes.filter(r => r.status === 'rejected').length;
  res.json({ total, pending, approved, rejected });
});

app.get('/api/admin/pending', (req, res) => {
  const db = readDB();
  const pending = db.recipes.filter(r => r.status === 'pending');
  res.json(pending);
});

// --- Health Check ---
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

