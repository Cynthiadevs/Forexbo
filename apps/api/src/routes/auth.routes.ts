import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppConfig } from '@forex/config';
import { UserRole, AuthLoginSchema, AuthRegisterSchema } from '@forex/shared';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth.js';

export const authRouter = Router();

// In-memory mock store fallback for demo & offline runs
const usersDb: any[] = [
  {
    id: 'usr-admin-1',
    email: 'admin@alphaquantfx.io',
    name: 'Super Administrator',
    passwordHash: bcrypt.hashSync('AdminSecurePassword123!', 10),
    role: UserRole.SUPER_ADMIN,
    createdAt: new Date()
  },
  {
    id: 'usr-analyst-1',
    email: 'analyst@alphaquantfx.io',
    name: 'Lead FX Analyst',
    passwordHash: bcrypt.hashSync('Analyst123!', 10),
    role: UserRole.ANALYST,
    createdAt: new Date()
  }
];

authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = AuthLoginSchema.parse(req.body);
    const user = usersDb.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    const accessToken = jwt.sign(tokenPayload, AppConfig.jwt.secret, { expiresIn: '1d' });
    const refreshToken = jwt.sign(tokenPayload, AppConfig.jwt.refreshSecret, { expiresIn: '7d' });

    return res.json({
      success: true,
      data: {
        user: tokenPayload,
        accessToken,
        refreshToken
      }
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = AuthRegisterSchema.parse(req.body);
    if (usersDb.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(409).json({ success: false, error: 'User with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: `usr-${Date.now()}`,
      email,
      name,
      passwordHash,
      role: role || UserRole.USER,
      createdAt: new Date()
    };
    usersDb.push(newUser);

    const tokenPayload = { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role };
    const accessToken = jwt.sign(tokenPayload, AppConfig.jwt.secret, { expiresIn: '1d' });

    return res.status(201).json({
      success: true,
      data: {
        user: tokenPayload,
        accessToken
      }
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

authRouter.get('/me', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ success: true, data: req.user });
});
