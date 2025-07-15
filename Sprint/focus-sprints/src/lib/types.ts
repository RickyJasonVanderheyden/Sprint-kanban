export type EnergyLevel = 'high' | 'medium' | 'low';
export type TaskCategory = 'work' | 'personal' | 'health' | 'learning' | 'other';
export interface Task {
  _id?: string; // MongoDB document id
  id?: string; // legacy/local id
  title: string;
  description: string;
  energyLevel: EnergyLevel;
  category: TaskCategory | string;
  completed: boolean;
  estimatedMinutes: number;
  kanbanColumn?: string;
}
export interface FocusSession {
  id: string;
  taskId: string;
  startTime: Date;
  endTime: Date | null;
  completed: boolean;
} 