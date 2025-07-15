import React, { useState } from 'react';
import { CalendarIcon, TagIcon, PaletteIcon, AlertCircleIcon } from 'lucide-react';

interface AddCardProps {
  onAddCard: (title: string, description: string, priority: string, color: string, dueDate: string, labels: string[]) => void;
  onCancel: () => void;
}

const AddCard: React.FC<AddCardProps> = ({
  onAddCard,
  onCancel
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [color, setColor] = useState('#3b82f6');
  const [dueDate, setDueDate] = useState('');
  const [labels, setLabels] = useState<string[]>([]);
  const [newLabel, setNewLabel] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddCard(title.trim(), description.trim(), priority, color, dueDate, labels);
      setTitle('');
      setDescription('');
      setPriority('medium');
      setColor('#3b82f6');
      setDueDate('');
      setLabels([]);
      setNewLabel('');
    }
  };

  const addLabel = () => {
    if (newLabel.trim() && !labels.includes(newLabel.trim())) {
      setLabels([...labels, newLabel.trim()]);
      setNewLabel('');
    }
  };

  const removeLabel = (labelToRemove: string) => {
    setLabels(labels.filter(label => label !== labelToRemove));
  };

  const colorOptions = [
    { value: '#3b82f6', name: 'Blue' },
    { value: '#ef4444', name: 'Red' },
    { value: '#10b981', name: 'Green' },
    { value: '#f59e0b', name: 'Yellow' },
    { value: '#8b5cf6', name: 'Purple' },
    { value: '#06b6d4', name: 'Cyan' },
    { value: '#84cc16', name: 'Lime' },
    { value: '#f97316', name: 'Orange' }
  ];

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addLabel();
    }
  };
  return <form onSubmit={handleSubmit} className="bg-white/98 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-gray-200 space-y-4">
      {/* Title */}
      <input 
        type="text" 
        value={title} 
        onChange={e => setTitle(e.target.value)} 
        className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
        placeholder="Card title" 
        autoFocus 
      />
      
      {/* Description */}
      <textarea 
        value={description} 
        onChange={e => setDescription(e.target.value)} 
        className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
        placeholder="Description (optional)" 
        rows={2} 
      />
      
      {/* Priority */}
      <div className="flex items-center space-x-2">
        <AlertCircleIcon size={16} className="text-gray-600" />
        <select 
          value={priority} 
          onChange={e => setPriority(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
      </div>
      
      {/* Color */}
      <div className="flex items-center space-x-2">
        <PaletteIcon size={16} className="text-gray-600" />
        <div className="flex space-x-1.5 flex-wrap">
          {colorOptions.slice(0, 6).map(colorOption => (
            <button
              key={colorOption.value}
              type="button"
              onClick={() => setColor(colorOption.value)}
              className={`w-5 h-5 rounded-full border-2 transition-transform flex-shrink-0 ${
                color === colorOption.value ? 'border-gray-800 scale-110' : 'border-gray-300'
              }`}
              style={{ backgroundColor: colorOption.value }}
              title={colorOption.name}
            />
          ))}
        </div>
      </div>
      
      {/* Due Date */}
      <div className="flex items-center space-x-2">
        <CalendarIcon size={16} className="text-gray-600" />
        <input 
          type="date" 
          value={dueDate} 
          onChange={e => setDueDate(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      {/* Labels */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <TagIcon size={16} className="text-gray-600" />
          <input 
            type="text" 
            value={newLabel} 
            onChange={e => setNewLabel(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 min-w-0 p-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add label..."
          />
          <button
            type="button"
            onClick={addLabel}
            className="px-2 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium flex items-center gap-1 whitespace-nowrap flex-shrink-0"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add
          </button>
        </div>
        
        {/* Label Tags */}
        {labels.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {labels.map(label => (
              <span 
                key={label}
                className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {label}
                <button
                  type="button"
                  onClick={() => removeLabel(label)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={!title.trim()} className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg disabled:bg-blue-300 transition-colors font-medium">
          Add Card
        </button>
      </div>
    </form>;
};
export default AddCard; 