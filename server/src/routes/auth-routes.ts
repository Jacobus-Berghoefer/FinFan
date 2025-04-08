// server/src/routes/auth-routes.ts
import { Router } from 'express';

const router = Router();

/**
 * GET /api/auth/session
 * Check if user is authenticated (for now, mock response)
 */
router.get('/session', (_, res) => {
  // In the future, check JWT or session here
  res.json({ authenticated: true, user: { id: '123', displayName: 'TestUser' } });
});

/**
 * POST /api/auth/login
 * Simulated login route
 */
router.post('/login', (req, res) => {
  const { sleeperId, displayName } = req.body;

  // In a real app, you'd check credentials or OAuth
  if (!sleeperId || !displayName) {
    return res.status(400).json({ error: 'Missing sleeperId or displayName' });
  }

  // You might also look up/create this user in the DB here

  // Return a mock token or success message
  return res.json({ success: true, sleeperId, displayName });
});

export default router;
