import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../config/supabase';
import { AuthRequest, authenticate } from '../middleware/auth';

const router = Router();

// Register new user
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('dateOfBirth').notEmpty().withMessage('Date of birth is required'),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password, fullName, dateOfBirth } = req.body;

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (authError) {
        res.status(400).json({ error: authError.message });
        return;
      }

      // Create user profile in database
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email,
            full_name: fullName,
            date_of_birth: dateOfBirth,
            policy_status: 'Active',
          },
        ])
        .select()
        .single();

      if (profileError) {
        // Rollback auth user if profile creation fails
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        res.status(400).json({ error: profileError.message });
        return;
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: authData.user.id, email: authData.user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        user: {
          id: profileData.id,
          email: profileData.email,
          fullName: profileData.full_name,
          dateOfBirth: profileData.date_of_birth,
          policyNumber: profileData.policy_number,
          policyStatus: profileData.policy_status,
        },
        token,
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

// Login user
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password } = req.body;

      // Authenticate with Supabase
      const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      // Get user profile
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        res.status(404).json({ error: 'User profile not found' });
        return;
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: authData.user.id, email: authData.user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
      );

      res.status(200).json({
        user: {
          id: profileData.id,
          email: profileData.email,
          fullName: profileData.full_name,
          dateOfBirth: profileData.date_of_birth,
          policyNumber: profileData.policy_number,
          policyStatus: profileData.policy_status,
        },
        token,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', req.user!.id)
      .single();

    if (error) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      dateOfBirth: data.date_of_birth,
      policyNumber: data.policy_number,
      policyStatus: data.policy_status,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Logout (client-side token removal mainly)
router.post('/logout', authenticate, async (_req: AuthRequest, res: Response) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;