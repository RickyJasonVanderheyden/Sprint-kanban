import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/db/db';
import KanbanCard from '../../lib/db/KanbanCard';
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
      // Get all kanban cards for the user, organized by column
      const cards = await KanbanCard.find({ userId }).sort({ createdAt: -1 });
      
      // Organize cards by columns
      const kanbanData: { [key: string]: any[] } = {
        todo: cards.filter(card => card.column === 'todo'),
        'in-progress': cards.filter(card => card.column === 'in-progress'),
        done: cards.filter(card => card.column === 'done'),
        backlog: cards.filter(card => card.column === 'backlog'),
        review: cards.filter(card => card.column === 'review'),
        archived: cards.filter(card => card.column === 'archived'),
      };
      
      // Also include any other custom columns
      const customColumns = [...new Set(cards.map(card => card.column))];
      customColumns.forEach(column => {
        if (!kanbanData[column]) {
          kanbanData[column] = cards.filter(card => card.column === column);
        }
      });
      
      return res.status(200).json(kanbanData);
    } catch (error) {
      console.error('Error fetching kanban cards:', error);
      return res.status(500).json({ error: 'Failed to fetch kanban cards' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, description, column, priority, color, dueDate, labels } = req.body;

      if (!title || !column) {
        return res.status(400).json({ error: 'Title and column are required' });
      }

      const newCard = new KanbanCard({
        title,
        description: description || '',
        column,
        priority: priority || 'medium',
        color: color || '#3b82f6',
        dueDate: dueDate ? new Date(dueDate) : undefined,
        labels: labels || [],
        userId
      });

      await newCard.save();
      return res.status(201).json(newCard);
    } catch (error) {
      console.error('Error creating kanban card:', error);
      return res.status(500).json({ error: 'Failed to create kanban card' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { cardId, title, description, column, priority, color, dueDate, labels } = req.body;

      if (!cardId) {
        return res.status(400).json({ error: 'Card ID is required' });
      }

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (column !== undefined) updateData.column = column;
      if (priority !== undefined) updateData.priority = priority;
      if (color !== undefined) updateData.color = color;
      if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
      if (labels !== undefined) updateData.labels = labels;

      const updatedCard = await KanbanCard.findOneAndUpdate(
        { _id: cardId, userId },
        updateData,
        { new: true }
      );

      if (!updatedCard) {
        return res.status(404).json({ error: 'Card not found' });
      }

      return res.status(200).json(updatedCard);
    } catch (error) {
      console.error('Error updating kanban card:', error);
      return res.status(500).json({ error: 'Failed to update kanban card' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { cardId } = req.body;

      if (!cardId) {
        return res.status(400).json({ error: 'Card ID is required' });
      }

      const deletedCard = await KanbanCard.findOneAndDelete({ _id: cardId, userId });

      if (!deletedCard) {
        return res.status(404).json({ error: 'Card not found' });
      }

      return res.status(200).json({ message: 'Card deleted successfully' });
    } catch (error) {
      console.error('Error deleting kanban card:', error);
      return res.status(500).json({ error: 'Failed to delete kanban card' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
