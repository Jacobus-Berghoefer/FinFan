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

    // 👇 Set cookie for persistent session
    res.cookie('session', {
      id: newUser.id,
      username: newUser.username,
      display_name: newUser.display_name,
    }, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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

    // ✅ Set secure HTTP-only cookie
    res.cookie('session', {
      id: user.id,
      username: user.username,
      display_name: user.display_name,
    }, {
      httpOnly: true,
      secure: false, // Set to true in production (requires HTTPS)
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    });

    return res.json({
      id: user.id,
      username: user.username,
      display_name: user.display_name,
      sleeper_id: user.sleeper_id,
      avatar: user.avatar,
      sleeper_linked: user.sleeper_linked,
      sleeper_display_name: user.sleeper_display_name,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// server/src/routes/auth-routes.ts
router.get('/session', async (req, res) => {
  const session = req.cookies.session;
  if (!session || !session.id) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const user = await models.User.findByPk(session.id) as IUserInstance | null;

    if (!user) {
      return res.status(401).json({ authenticated: false });
    }

      return res.json({
        id: user.id,
        username: user.username,
        display_name: user.display_name,
        sleeper_id: user.sleeper_id,
        avatar: user.avatar,
        sleeper_linked: user.sleeper_linked,
        sleeper_display_name: user.sleeper_display_name,
      });
      
  } catch (err) {
    console.error("Session fetch failed:", err);
    return res.status(500).json({ error: "Failed to retrieve session user" });
  }
});

// POST /api/auth/logout
router.post('/logout', (_req, res) => {
  res.clearCookie('session', {
    httpOnly: true,
    secure: false, // Set to true in production
    sameSite: 'lax',
  });
  return res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
