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

// Update password
router.put(
  '/password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { currentPassword, newPassword } = req.body;

      // Verify current password by trying to sign in
      const { error: verifyError } = await supabaseAdmin.auth.signInWithPassword({
        email: req.user!.email,
        password: currentPassword,
      });

      if (verifyError) {
        res.status(400).json({ error: 'Current password is incorrect' });
        return;
      }

      // Update password in Supabase Auth
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        req.user!.id,
        { password: newPassword }
      );

      if (updateError) {
        res.status(400).json({ error: updateError.message });
        return;
      }

      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Update password error:', error);
      res.status(500).json({ error: 'Failed to update password' });
    }
  }
);

// Update email
router.put(
  '/email',
  authenticate,
  [
    body('newEmail').isEmail().withMessage('Valid email is required'),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { newEmail } = req.body;

      // Update email in Supabase Auth
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
        req.user!.id,
        { email: newEmail }
      );

      if (authError) {
        res.status(400).json({ error: authError.message });
        return;
      }

      // Update email in users table
      const { error: dbError } = await supabaseAdmin
        .from('users')
        .update({ email: newEmail })
        .eq('id', req.user!.id);

      if (dbError) {
        res.status(400).json({ error: dbError.message });
        return;
      }

      res.status(200).json({ message: 'Email updated successfully', email: newEmail });
    } catch (error) {
      console.error('Update email error:', error);
      res.status(500).json({ error: 'Failed to update email' });
    }
  }
);

// Update profile
router.put(
  '/profile',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { fullName, dateOfBirth } = req.body;

      const updates: Record<string, string> = {};
      if (fullName) updates.full_name = fullName;
      if (dateOfBirth) updates.date_of_birth = dateOfBirth;

      if (Object.keys(updates).length === 0) {
        res.status(400).json({ error: 'No fields to update' });
        return;
      }

      const { data, error } = await supabaseAdmin
        .from('users')
        .update(updates)
        .eq('id', req.user!.id)
        .select()
        .single();

      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(200).json({
        message: 'Profile updated successfully',
        user: {
          id: data.id,
          email: data.email,
          fullName: data.full_name,
          dateOfBirth: data.date_of_birth,
          policyNumber: data.policy_number,
          policyStatus: data.policy_status,
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
);

export default router;