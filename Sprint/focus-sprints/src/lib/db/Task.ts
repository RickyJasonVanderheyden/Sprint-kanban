import mongoose, { Schema, models, model } from 'mongoose';

const TaskSchema = new Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String },
  energyLevel: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  category: { type: String, default: 'work' },
  completed: { type: Boolean, default: false },
  estimatedMinutes: { type: Number, default: 25 },
  kanbanColumn: { type: String, default: 'todo' }, // e.g., 'todo', 'in-progress', 'done'
}, { timestamps: true });

const Task = models.Task || model('Task', TaskSchema);

export default Task; 