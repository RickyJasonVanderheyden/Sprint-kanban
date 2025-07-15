import { Schema, model, models } from 'mongoose';

export interface IKanbanCard {
  title: string;
  description: string;
  column: string;
  priority?: 'low' | 'medium' | 'high';
  color?: string;
  dueDate?: Date;
  labels?: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const KanbanCardSchema = new Schema<IKanbanCard>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  column: {
    type: String,
    required: true,
    enum: ['todo', 'in-progress', 'done', 'backlog', 'review', 'archived'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  color: {
    type: String,
    default: '#3b82f6'
  },
  dueDate: {
    type: Date
  },
  labels: {
    type: [String],
    default: []
  },
  userId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Create indexes for better performance
KanbanCardSchema.index({ userId: 1, column: 1 });
KanbanCardSchema.index({ userId: 1, createdAt: -1 });

const KanbanCard = models.KanbanCard || model<IKanbanCard>('KanbanCard', KanbanCardSchema);

export default KanbanCard;
