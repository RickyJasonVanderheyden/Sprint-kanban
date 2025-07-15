import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EditIcon, TrashIcon } from 'lucide-react';
import { CardType } from './KanbanBoard';
interface CardProps {
  card: CardType;
  columnId: string;
  onUpdateCard: (columnId: string, cardId: string, title: string, description: string) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
  onUpdateFullCard?: (columnId: string, cardId: string, updatedCard: Partial<CardType>) => void;
}
const Card: React.FC<CardProps> = ({
  card,
  columnId,
  onUpdateCard,
  onDeleteCard,
  onUpdateFullCard
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [priority, setPriority] = useState(card.priority || 'medium');
  const [color, setColor] = useState(card.color || '#3B82F6');
  const [dueDate, setDueDate] = useState(card.dueDate || '');
  const [labels, setLabels] = useState(card.labels || []);
  const [newLabel, setNewLabel] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id: `card-${card.id}-column-${columnId}`,
    data: {
      type: 'card'
    }
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateFullCard) {
      onUpdateFullCard(columnId, card.id, {
        title,
        description,
        priority: priority as 'low' | 'medium' | 'high',
        color,
        dueDate,
        labels
      });
    } else {
      onUpdateCard(columnId, card.id, title, description);
    }
    setIsEditing(false);
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

  const handleDelete = () => {
    onDeleteCard(columnId, card.id);
    setShowDeleteConfirm(false);
  };
  if (isEditing) {
    return <div ref={setNodeRef} style={style} className="bg-white/98 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Card title" 
              autoFocus 
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Description" 
              rows={3} 
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select 
                value={priority} 
                onChange={e => setPriority(e.target.value as 'low' | 'medium' | 'high')} 
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input 
                type="color" 
                value={color} 
                onChange={e => setColor(e.target.value)} 
                className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input 
              type="date" 
              value={dueDate} 
              onChange={e => setDueDate(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Labels</label>
            <div className="flex flex-wrap gap-1 mb-2">
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
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newLabel} 
                onChange={e => setNewLabel(e.target.value)} 
                className="flex-1 min-w-0 p-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="Add label" 
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addLabel())}
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
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button 
              type="button" 
              onClick={() => setIsEditing(false)} 
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium"
            >
              Save
            </button>
          </div>
        </form>
      </div>;
  }

  // Priority color mapping
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-blue-500';
    }
  };

  const getPriorityDot = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={`kanban-card bg-white/98 backdrop-blur-sm rounded-lg shadow-lg p-4 cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-xl border border-gray-200 border-l-4 ${getPriorityColor(card.priority)}`}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center space-x-2 flex-1">
            <div className={`priority-dot w-2 h-2 rounded-full ${getPriorityDot(card.priority)}`}></div>
            <h4 className="text-sm font-semibold text-gray-800 flex-1">{card.title}</h4>
          </div>
        <div className="flex space-x-1">
          {card.color && (
            <div 
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: card.color }}
              title="Card Color"
            />
          )}
          <button onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          setIsEditing(true);
        }} className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200">
            <EditIcon size={14} />
          </button>
          <button onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          setShowDeleteConfirm(true);
        }} className="p-1.5 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-all duration-200">
            <TrashIcon size={14} />
          </button>
        </div>
      </div>
      
      {card.description && <p className="text-xs text-gray-600 mt-2 leading-relaxed">{card.description}</p>}
      
      {/* Labels */}
      {card.labels && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {card.labels.map(label => (
            <span 
              key={label}
              className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {label}
            </span>
          ))}
        </div>
      )}
      
      {/* Due Date */}
      {card.dueDate && (
        <div className="mt-2 flex items-center text-xs text-gray-500">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date(card.dueDate).toLocaleDateString()}
        </div>
      )}
      
      {/* Priority Badge */}
      {card.priority && (
        <div className="mt-3 flex items-center justify-between">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            card.priority === 'high' ? 'bg-red-100 text-red-700' :
            card.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            {card.priority.charAt(0).toUpperCase() + card.priority.slice(1)} Priority
          </span>
        </div>
      )}
    </div>
    
    {/* Delete Confirmation Modal */}
    {showDeleteConfirm && (
      <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Card</h3>
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete "{card.title}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};
export default Card; 