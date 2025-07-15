import React, { useState, useEffect, useRef } from 'react';
import { Task, EnergyLevel } from '../lib/types';
import { PlayIcon, CheckIcon, BatteryFullIcon, BatteryMediumIcon, BatteryLowIcon, EditIcon, TrashIcon, SaveIcon, XIcon, MoreVerticalIcon } from 'lucide-react';
import { playCompletionSound } from '../lib/soundUtils';

interface TaskListProps {
  tasks: Task[];
  onStartSprint: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
  onUpdateTask: (taskId: string, title: string, description: string) => void;
  onDeleteTask: (taskId: string) => void;
  showEnergyLevel?: boolean;
}
const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onStartSprint,
  onToggleComplete,
  onUpdateTask,
  onDeleteTask,
  showEnergyLevel = false
}) => {
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [openMenuTask, setOpenMenuTask] = useState<string | null>(null);
  const [completingTask, setCompletingTask] = useState<string | null>(null);
  const [showCheckmark, setShowCheckmark] = useState<string | null>(null);
  const [newTasks, setNewTasks] = useState<Set<string>>(new Set());
  const [updatedTasks, setUpdatedTasks] = useState<Set<string>>(new Set());

  // Track new and updated tasks for animations
  useEffect(() => {
    const currentTaskIds = new Set(tasks.map(task => task.id || task._id || ''));
    const previousTaskIds = new Set(Array.from(newTasks).concat(Array.from(updatedTasks)));
    
    // Find truly new tasks (not in previous render)
    const actualNewTasks = new Set<string>();
    currentTaskIds.forEach(taskId => {
      if (!previousTaskIds.has(taskId)) {
        actualNewTasks.add(taskId);
      }
    });
    
    if (actualNewTasks.size > 0) {
      setNewTasks(actualNewTasks);
      
      // Remove from new tasks after animation completes
      setTimeout(() => {
        setNewTasks(prev => {
          const updated = new Set(prev);
          actualNewTasks.forEach(taskId => updated.delete(taskId));
          return updated;
        });
      }, 600);
    }
  }, [tasks]);

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuTask(null);
    };

    if (openMenuTask) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openMenuTask]);

  if (tasks.length === 0) {
    return <p className="text-gray-500 italic">No tasks available.</p>;
  }

  const handleEditStart = (task: Task) => {
    setEditingTask(task.id || task._id || '');
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setOpenMenuTask(null);
  };

  const handleEditSave = (taskId: string) => {
    onUpdateTask(taskId, editTitle, editDescription);
    setEditingTask(null);
    setEditTitle('');
    setEditDescription('');
    
    // Trigger update animation
    setUpdatedTasks(prev => new Set(prev).add(taskId));
    setTimeout(() => {
      setUpdatedTasks(prev => {
        const updated = new Set(prev);
        updated.delete(taskId);
        return updated;
      });
    }, 600);
  };

  const handleEditCancel = () => {
    setEditingTask(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleDeleteTask = (taskId: string) => {
    onDeleteTask(taskId);
    setOpenMenuTask(null);
  };

  const toggleMenu = (taskId: string) => {
    setOpenMenuTask(openMenuTask === taskId ? null : taskId);
  };

  const handleTaskCompletion = (taskId: string, task: Task) => {
    if (!task.completed) {
      // Play sound IMMEDIATELY on click - before any React state changes
      playCompletionSound();
      
      // Show checkmark animation first
      setShowCheckmark(taskId);
      setCompletingTask(taskId);
      
      // After checkmark animation, fade out and complete
      setTimeout(() => {
        setShowCheckmark(null);
        onToggleComplete(taskId);
        
        // Clear completing state after fade completes
        setTimeout(() => {
          setCompletingTask(null);
        }, 300);
      }, 800);
    } else {
      // If uncompleting, do it immediately
      onToggleComplete(taskId);
    }
  };

  const getEnergyIcon = (level: EnergyLevel) => {
    switch (level) {
      case 'high':
        return <BatteryFullIcon className="h-4 w-4 text-green-600 dark:text-green-300" />;
      case 'medium':
        return <BatteryMediumIcon className="h-4 w-4 text-yellow-600 dark:text-yellow-300" />;
      case 'low':
        return <BatteryLowIcon className="h-4 w-4 text-red-600 dark:text-red-300" />;
    }
  };
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'personal':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'health':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'learning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };
  return <div className="space-y-1 task-list-container">
      {tasks.map((task, index) => {
        const taskId = task.id || task._id || '';
        const isEditing = editingTask === taskId;
        
        return (
          <div 
            key={taskId} 
            style={{
              animationDelay: newTasks.has(taskId) ? `${index * 100}ms` : '0ms'
            }}
            className={`todo-task relative transition-all duration-300 ${
              task.completed ? 'completed' : ''
            } ${
              newTasks.has(taskId) ? 'task-slide-in new-task' : ''
            } ${
              updatedTasks.has(taskId) ? 'task-update-pulse' : ''
            } ${
              completingTask === taskId ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            {/* Checkmark Animation Overlay */}
            {showCheckmark === taskId && (
              <div className="absolute inset-0 flex items-center justify-center bg-green-50 bg-opacity-90 rounded-lg z-10">
                <div className="checkmark-animation">
                  <CheckIcon size={48} className="text-green-600" />
                </div>
              </div>
            )}
            <div className="flex items-start justify-between">
              <div className="flex-1 todo-task-content">
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="Task title"
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="Task description"
                      rows={2}
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center mb-1">
                      {showEnergyLevel && (
                        <div className="mr-2" title={`Energy Level: ${task.energyLevel}`}>
                          {getEnergyIcon(task.energyLevel)}
                        </div>
                      )}
                      <h3 className={`font-medium ${task.completed ? 'text-gray-500 line-through dark:text-gray-400' : 'text-gray-800 dark:text-gray-100'}`}>
                        {task.title}
                      </h3>
                    </div>
                    <p className={`text-sm ${task.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>
                      {task.description}
                    </p>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(task.category)}`}>
                        {task.category}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {task.estimatedMinutes} min
                      </span>
                    </div>
                  </>
                )}
              </div>
              <div className="flex space-x-1">
                {isEditing ? (
                  <>
                    <button 
                      onClick={() => handleEditSave(taskId)} 
                      className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200" 
                      title="Save changes"
                    >
                      <SaveIcon size={16} />
                    </button>
                    <button 
                      onClick={handleEditCancel} 
                      className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200" 
                      title="Cancel editing"
                    >
                      <XIcon size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => handleTaskCompletion(taskId, task)} 
                      className={`p-2 rounded-full transition-all duration-200 ${
                        showCheckmark === taskId ? 'pulse-green' : ''
                      } ${
                        task.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`} 
                      title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      <CheckIcon size={16} />
                    </button>
                    {!task.completed && (
                      <button 
                        onClick={() => onStartSprint(task)} 
                        className="p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200" 
                        title="Start focus sprint"
                      >
                        <PlayIcon size={16} />
                      </button>
                    )}
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(taskId);
                        }} 
                        className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200" 
                        title="More options"
                      >
                        <MoreVerticalIcon size={16} />
                      </button>
                      {openMenuTask === taskId && (
                        <div 
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-10 bg-white rounded-lg shadow-lg z-10 w-28"
                        >
                          <button 
                            onClick={() => handleEditStart(task)} 
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center rounded-t-lg"
                          >
                            <EditIcon size={14} className="mr-2" />
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteTask(taskId)} 
                            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center rounded-b-lg"
                          >
                            <TrashIcon size={14} className="mr-2" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>;
};
export default TaskList;