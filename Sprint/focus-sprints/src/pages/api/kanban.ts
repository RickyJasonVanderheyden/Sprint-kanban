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
  
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  if (req.method === 'GET') {
    try {
      // Get all tasks for the user, organized by kanban column
      const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
      
      // Organize tasks by kanban columns
      const kanbanData: { [key: string]: any[] } = {
        todo: tasks.filter(task => task.kanbanColumn === 'todo'),
        'in-progress': tasks.filter(task => task.kanbanColumn === 'in-progress'),
        done: tasks.filter(task => task.kanbanColumn === 'done'),
      };
      
      // Also include any other custom columns
      const customColumns = [...new Set(tasks.map(task => task.kanbanColumn))];
      customColumns.forEach(column => {
        if (!kanbanData[column]) {
          kanbanData[column] = tasks.filter(task => task.kanbanColumn === column);
        }
      });
      
      return res.status(200).json(kanbanData);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch kanban data' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, description, kanbanColumn = 'todo' } = req.body;
      
      const newTask = await Task.create({
        userId,
        title,
        description,
        kanbanColumn,
        energyLevel: 'medium',
        category: 'work',
        completed: false,
        estimatedMinutes: 25,
      });
      
      return res.status(201).json(newTask);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create task' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { taskId, title, description, kanbanColumn } = req.body;
      
      const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId, userId },
        { title, description, kanbanColumn },
        { new: true }
      );
      
      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      return res.status(200).json(updatedTask);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update task' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { taskId } = req.body;
      
      const deletedTask = await Task.findOneAndDelete({ _id: taskId, userId });
      
      if (!deletedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete task' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
