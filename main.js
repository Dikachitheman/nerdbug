const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { connectDB } = require('./conn');
const {
  createUser,
  getUserById,
  getAllUsers,
  deleteUser,
} = require('./userDB.js');

const app = express();
app.use(helmet());
app.use(bodyParser.json());

function validateUserInput(name, email) {
  if (!name || !email) {
    return { valid: false, message: 'Name and email are required.' };
  }
  return { valid: true };
}

app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  const validation = validateUserInput(name, email);

  if (!validation.valid) {
    return res.status(400).json({ error: validation.message });
  }

  try {
    const users = await getAllUsers();
    const newId = users.length + 1;

    const id = await createUser(name, email, newId);
    res.status(201).json({ id: newId, message: 'User created successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch {
    res.status(404).json({ error: 'User not found' });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const success = await deleteUser(req.params.id);
    if (!success) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = 3000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
