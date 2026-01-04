import { Router, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { AuthRequest, authenticate } from '../middleware/auth';

const router = Router();

// Get all conversations for user
router.get('/conversations', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('conversations')
      .select('*')
      .eq('user_id', req.user!.id)
      .order('updated_at', { ascending: false });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get messages for a conversation
router.get('/conversations/:id/messages', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Verify conversation belongs to user
    const { data: conversation, error: convError } = await supabaseAdmin
      .from('conversations')
      .select('id')
      .eq('id', id)
      .eq('user_id', req.user!.id)
      .single();

    if (convError || !conversation) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }

    const { data, error } = await supabaseAdmin
      .from('messages')
      .select('*')
      .eq('conversation_id', id)
      .order('timestamp', { ascending: true });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a message
router.post('/conversations/:id/messages', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    // Verify conversation belongs to user
    const { data: conversation, error: convError } = await supabaseAdmin
      .from('conversations')
      .select('id')
      .eq('id', id)
      .eq('user_id', req.user!.id)
      .single();

    if (convError || !conversation) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }

    const { data, error } = await supabaseAdmin
      .from('messages')
      .insert([
        {
          conversation_id: id,
          text,
          sender: 'user',
          timestamp: new Date().toISOString(),
          is_read: true,
        },
      ])
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    // Update conversation last message
    await supabaseAdmin
      .from('conversations')
      .update({
        last_message: text,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    res.status(201).json(data);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Create new conversation
router.post('/conversations', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { title, initialMessage } = req.body;

    const { data, error } = await supabaseAdmin
      .from('conversations')
      .insert([
        {
          user_id: req.user!.id,
          title,
          last_message: initialMessage || '',
          unread_count: 0,
        },
      ])
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    // Add initial message if provided
    if (initialMessage) {
      await supabaseAdmin
        .from('messages')
        .insert([
          {
            conversation_id: data.id,
            text: initialMessage,
            sender: 'user',
            timestamp: new Date().toISOString(),
            is_read: true,
          },
        ]);
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// Mark messages as read
router.put('/conversations/:id/read', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', id)
      .eq('sender', 'support');

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    // Reset unread count
    await supabaseAdmin
      .from('conversations')
      .update({ unread_count: 0 })
      .eq('id', id)
      .eq('user_id', req.user!.id);

    res.status(200).json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

export default router;
