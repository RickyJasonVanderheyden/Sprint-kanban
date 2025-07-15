import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import EnergySelector from '../components/EnergySelector';
import TaskList from '../components/TaskList';
import FocusTimer from '../components/FocusTimer';
import AddTask from '../components/AddTask';
import TaskDashboard from '../components/TaskDashboard';
import Toast from '../components/Toast';
import TabNav from '../components/TabNav';
import FloatingBubbles from '../components/FloatingBubbles';
import FloatingAchievements from '../components/FloatingAchievements';
import PageFlip from '../components/PageFlip';
import TaskCat from '../components/TaskCat';
import { Task, EnergyLevel } from '../lib/types';
import { playCompletionSound } from '../lib/soundUtils';

const FocusSprintsPage: React.FC = () => {
  const router = useRouter();
  const [currentEnergyLevel, setCurrentEnergyLevel] = useState<EnergyLevel>('medium');
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    isVisible: boolean;
    message: string;
    type: 'success' | 'error' | 'warning';
  }>({
    isVisible: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    fetchTasks();
    // Preload completion sound for instant playback
    playCompletionSound(0); // Play at 0 volume to preload
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tasks');
      
      if (response.status === 401) {
        // Not authenticated, redirect to login
        router.push('/login');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      const data = await response.json();
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        // Normalize task IDs to ensure both id and _id exist
        const normalizedTasks = data.map(task => ({
          ...task,
          id: task._id || task.id, // Ensure id field exists
          _id: task._id || task.id  // Ensure _id field exists
        }));
        setTasks(normalizedTasks);
      } else {
        console.error('Expected array but got:', data);
        setTasks([]);
        setError('Invalid data format received');
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task: Omit<Task, 'id' | 'completed'>) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      
      if (!res.ok) {
        throw new Error('Failed to create task');
      }
      
      const newTask = await res.json();
      
      // Normalize the new task ID
      const normalizedTask = {
        ...newTask,
        id: newTask._id || newTask.id,
        _id: newTask._id || newTask.id
      };
      
      setTasks(prev => [...prev, normalizedTask]);
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task');
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    try {
      const task = tasks.find(t => (t._id || t.id) === taskId);
      if (!task) {
        console.error('Task not found with ID:', taskId);
        return;
      }
      
      const id = task._id || task.id;
      const isBeingCompleted = !task.completed; // Store if task is being completed
      
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: isBeingCompleted }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to update task');
      }
      
      const updated = await res.json();
      
      // Normalize the updated task ID
      const normalizedUpdated = {
        ...updated,
        id: updated._id || updated.id,
        _id: updated._id || updated.id
      };
      
      setTasks(tasks.map(t => ((t._id || t.id) === (normalizedUpdated._id || normalizedUpdated.id)) ? normalizedUpdated : t));
      
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
    }
  };

  const updateTask = async (taskId: string, title: string, description: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to update task');
      }
      
      const updated = await res.json();
      
      // Normalize the updated task ID
      const normalizedUpdated = {
        ...updated,
        id: updated._id || updated.id,
        _id: updated._id || updated.id
      };
      
      setTasks(tasks.map(t => ((t._id || t.id) === (normalizedUpdated._id || normalizedUpdated.id)) ? normalizedUpdated : t));
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        throw new Error('Failed to delete task');
      }
      
      const deletedTask = tasks.find(t => (t._id || t.id) === taskId);
      setTasks(tasks.filter(t => (t._id || t.id) !== taskId));
      
      setToast({
        isVisible: true,
        message: `Task "${deletedTask?.title || 'Task'}" deleted`,
        type: 'success'
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      setToast({
        isVisible: true,
        message: 'Failed to delete task',
        type: 'error'
      });
    }
  };

  const startFocusSprint = (task: Task) => {
    if (task.completed) {
      setError('Cannot start a sprint on a completed task');
      return;
    }
    setActiveTask(task);
    setIsTimerActive(true);
  };
  const endFocusSprint = async (completed: boolean) => {
    if (activeTask && completed) {
      const taskId = activeTask._id || activeTask.id;
      if (taskId) {
        await toggleTaskCompletion(taskId);
      }
    }
    setActiveTask(null);
    setIsTimerActive(false);
  };
  const getRecommendedTasks = () => {
    // Ensure tasks is an array before filtering
    if (!Array.isArray(tasks)) {
      console.warn('tasks is not an array:', tasks);
      return [];
    }
    return tasks.filter(task => task.energyLevel === currentEnergyLevel && !task.completed);
  };  if (loading) {
    return (
      <div className="min-h-screen color-changing-bg">
        <FloatingBubbles />
        <TabNav activeTab="focus" />
        <div className="todo-container pt-20">
          <div className="text-center py-10 text-gray-100 text-lg">Loading your tasks...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen color-changing-bg">
        <FloatingBubbles />
        <TabNav activeTab="focus" />
        <div className="todo-container pt-20">
          <div className="todo-paper">
            <div className="text-center py-10">
              <div className="text-red-600 mb-4 text-xl">{error}</div>
              <button 
                onClick={fetchTasks}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen color-changing-bg">
      <FloatingBubbles />
      <FloatingAchievements
        tasks={tasks}
        completedTasks={tasks.filter(task => task.completed).length}
        totalTasks={tasks.length}
      />
      <TaskCat remainingTasks={tasks.filter(task => !task.completed).length} initialPosition="right" />
      <TabNav activeTab="focus" />
      {isTimerActive && activeTask ? (
        <FocusTimer task={activeTask} onComplete={() => endFocusSprint(true)} onCancel={() => endFocusSprint(false)} />
      ) : (
        <div className="todo-container pt-20">
          <div className="todo-paper">
            <div className="hole"></div>
            <div className="hole"></div>
            <div className="hole"></div>
            <div className="todo-content">
              <header className="todo-header">
                <h1 className="todo-title">My ToDo List</h1>
                <p className="todo-subtitle">Focus Sprints & Productivity</p>
              </header>
              
              <div className="mb-8">
                <EnergySelector currentLevel={currentEnergyLevel} onChange={setCurrentEnergyLevel} />
              </div>
              
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 todo-task-content">Recommended Tasks</h2>
                <TaskList 
                  tasks={getRecommendedTasks()} 
                  onStartSprint={startFocusSprint} 
                  onToggleComplete={toggleTaskCompletion}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                  showEnergyLevel={false}
                />
              </div>
              
              <PageFlip
                tasks={tasks}
                onStartSprint={startFocusSprint}
                onToggleComplete={toggleTaskCompletion}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
                onAddTask={(task) => addTask(task)}
              />
            </div>
          </div>
        </div>
      )}
      
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default FocusSprintsPage; 