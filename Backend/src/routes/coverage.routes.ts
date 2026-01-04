import { Router, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { AuthRequest, authenticate } from '../middleware/auth';

const router = Router();

// Get all coverage plans for user
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('coverage')
      .select('*')
      .eq('user_id', req.user!.id)
      .order('name', { ascending: true });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Get coverage error:', error);
    res.status(500).json({ error: 'Failed to fetch coverage' });
  }
});

// Get single coverage by ID
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('coverage')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user!.id)
      .single();

    if (error) {
      res.status(404).json({ error: 'Coverage not found' });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Get coverage error:', error);
    res.status(500).json({ error: 'Failed to fetch coverage' });
  }
});

// Get coverage summary (total limits, used, remaining)
router.get('/summary', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('coverage')
      .select('limit, used, remaining')
      .eq('user_id', req.user!.id);

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    const summary = data.reduce(
      (acc, item) => ({
        totalLimit: acc.totalLimit + (item.limit || 0),
        totalUsed: acc.totalUsed + (item.used || 0),
        totalRemaining: acc.totalRemaining + (item.remaining || 0),
      }),
      { totalLimit: 0, totalUsed: 0, totalRemaining: 0 }
    );

    res.status(200).json(summary);
  } catch (error) {
    console.error('Get coverage summary error:', error);
    res.status(500).json({ error: 'Failed to fetch coverage summary' });
  }
});

export default router;
