import React, { useState } from 'react';
import { Task, EnergyLevel, TaskCategory } from '../lib/types';
import { PlusIcon, BatteryFullIcon, BatteryMediumIcon, BatteryLowIcon } from 'lucide-react';
interface AddTaskProps {
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
}
const AddTask: React.FC<AddTaskProps> = ({
  onAddTask
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>('medium');
  const [category, setCategory] = useState<TaskCategory>('work');
  const [estimatedMinutes, setEstimatedMinutes] = useState(25);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask({
        title,
        description,
        energyLevel,
        category,
        estimatedMinutes
      });
      // Reset form
      setTitle('');
      setDescription('');
      setEnergyLevel('medium');
      setCategory('work');
      setEstimatedMinutes(25);
      setIsFormOpen(false);
    }
  };
  const categories: TaskCategory[] = ['work', 'personal', 'health', 'learning', 'other'];
  return <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
      {isFormOpen ? <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Task Name
            </label>
            <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="What do you need to do?" required />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="Add some details..." rows={2} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Energy Level Required
            </label>
            <div className="flex space-x-2">
              <button type="button" onClick={() => setEnergyLevel('low')} className={`flex items-center px-3 py-2 rounded border ${energyLevel === 'low' ? 'bg-red-100 border-red-300 text-red-700' : 'border-gray-300 hover:bg-gray-50'}`}>
                <BatteryLowIcon size={16} className="mr-1" />
                Low
              </button>
              <button type="button" onClick={() => setEnergyLevel('medium')} className={`flex items-center px-3 py-2 rounded border ${energyLevel === 'medium' ? 'bg-yellow-100 border-yellow-300 text-yellow-700' : 'border-gray-300 hover:bg-gray-50'}`}>
                <BatteryMediumIcon size={16} className="mr-1" />
                Medium
              </button>
              <button type="button" onClick={() => setEnergyLevel('high')} className={`flex items-center px-3 py-2 rounded border ${energyLevel === 'high' ? 'bg-green-100 border-green-300 text-green-700' : 'border-gray-300 hover:bg-gray-50'}`}>
                <BatteryFullIcon size={16} className="mr-1" />
                High
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select id="category" value={category} onChange={e => setCategory(e.target.value as TaskCategory)} className="w-full p-2 border border-gray-300 rounded-lg text-sm">
                {categories.map(cat => <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>)}
              </select>
            </div>
            <div>
              <label htmlFor="estimatedMinutes" className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Time (min)
              </label>
              <input id="estimatedMinutes" type="number" min="5" step="5" value={estimatedMinutes} onChange={e => setEstimatedMinutes(parseInt(e.target.value))} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
              Cancel
            </button>
            <button type="submit" disabled={!title.trim()} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:bg-blue-300">
              Add Task
            </button>
          </div>
        </form> : <button onClick={() => setIsFormOpen(true)} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center justify-center">
          <PlusIcon size={18} className="mr-2" />
          Create New Task
        </button>}
    </div>;
};
export default AddTask; 