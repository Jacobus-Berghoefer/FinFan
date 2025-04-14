import { Router } from 'express';
import bcrypt from 'bcrypt';
import sequelize from '../config/connection.js';
import { initModels } from '../models/index.js';
import type { IUserInstance } from '../models/user.js';

const router = Router();
const models = initModels(sequelize);

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  console.log('Request body:', req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }

  try {
    const existingUser = await models.User.findOne({ where: { username } }) as IUserInstance | null;
    if (existingUser) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await models.User.create({
      username,
      password: hashedPassword,
      display_name: username, // default match until sleeper is linked
      sleeper_linked: false,
      sleeper_id: null,
    }) as IUserInstance;

    return res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      display_name: newUser.display_name,
      sleeper_linked: newUser.sleeper_linked,
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing credentials' });
  }

  try {
    const user = await models.User.findOne({ where: { username } }) as IUserInstance | null;

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Later you'll add JWT/token logic here

    return res.json({
      id: user.id,
      username: user.username,
      display_name: user.display_name,
      sleeper_id: user.sleeper_id,
      avatar: user.avatar,
      sleeper_linked: user.sleeper_linked,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
