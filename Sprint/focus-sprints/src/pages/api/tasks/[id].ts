import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/db/db';
import Task from '../../../lib/db/Task';
import { verifyJwtToken } from '../../../lib/auth';
import * as cookie from 'cookie';

function getUserIdFromRequest(req: NextApiRequest): string | null {
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.auth_token;
    
    if (!token) return null;
    
    const decoded = verifyJwtToken(token) as any;
    return decoded?.userId || null;
  } catch (error) {
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const userId = getUserIdFromRequest(req);
  
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const task = await Task.findOne({ _id: id, userId });
      if (!task) return res.status(404).json({ error: 'Task not found' });
      return res.status(200).json(task);
    } catch (error) {
      console.error('Error fetching task:', error);
      return res.status(500).json({ error: 'Failed to fetch task' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const update = req.body;
      const task = await Task.findOneAndUpdate({ _id: id, userId }, update, { new: true });
      if (!task) return res.status(404).json({ error: 'Task not found' });
      return res.status(200).json(task);
    } catch (error) {
      console.error('Error updating task:', error);
      return res.status(500).json({ error: 'Failed to update task' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const task = await Task.findOneAndDelete({ _id: id, userId });
      if (!task) return res.status(404).json({ error: 'Task not found' });
      return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error deleting task:', error);
      return res.status(500).json({ error: 'Failed to delete task' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 