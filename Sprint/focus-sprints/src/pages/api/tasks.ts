import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/db/db';
import Task from '../../lib/db/Task';
import { verifyJwtToken } from '../../lib/auth';
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
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  if (req.method === 'GET') {
    const tasks = await Task.find({ userId });
    return res.status(200).json(tasks);
  }

  if (req.method === 'POST') {
    const { title, description, energyLevel, category, completed, estimatedMinutes, kanbanColumn } = req.body;
    const newTask = await Task.create({
      userId,
      title,
      description,
      energyLevel,
      category,
      completed,
      estimatedMinutes,
      kanbanColumn,
    });
    return res.status(201).json(newTask);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 