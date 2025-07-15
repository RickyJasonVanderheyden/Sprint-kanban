import React, { useState } from 'react';
import TaskList from './TaskList';
import AddTask from './AddTask';
import TaskDashboard from './TaskDashboard';
import { Task } from '../lib/types';

interface PageFlipProps {
  tasks: Task[];
  onStartSprint: (task: Task) => void;
  onToggleComplete: (taskId: string) => Promise<void>;
  onUpdateTask: (taskId: string, title: string, description: string) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
}

const PageFlip: React.FC<PageFlipProps> = ({ 
  tasks, 
  onStartSprint, 
  onToggleComplete, 
  onUpdateTask, 
  onDeleteTask, 
  onAddTask 
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const pages = [
    { id: 'tasks', title: 'All Tasks' },
    { id: 'add', title: 'Add Task' },
    { id: 'progress', title: 'Progress' }
  ];

  const flipToPage = (pageIndex: number) => {
    if (pageIndex === currentPage || isFlipping) return;
    
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage(pageIndex);
      setIsFlipping(false);
    }, 300); // Half of the flip duration
  };

  const renderPageContent = (pageIndex: number) => {
    const incompleteTasks = tasks.filter(task => !task.completed);
    const remainingTasksCount = incompleteTasks.length;

    switch (pageIndex) {
      case 0:
        return (
          <div className="page-content">
            <h2 className="page-title">All Tasks</h2>
            <TaskList 
              tasks={tasks} 
              onStartSprint={onStartSprint} 
              onToggleComplete={onToggleComplete}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
              showEnergyLevel 
            />
          </div>
        );
      case 1:
        return (
          <div className="page-content">
            <h2 className="page-title">Add New Task</h2>
            <AddTask onAddTask={onAddTask} />
          </div>
        );
      case 2:
        return (
          <div className="page-content">
            <h2 className="page-title">Progress Dashboard</h2>
            <TaskDashboard tasks={tasks} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="book-container">
      <div className="page-tabs">
        {pages.map((page, index) => (
          <button
            key={page.id}
            className={`page-tab ${currentPage === index ? 'active' : ''}`}
            onClick={() => flipToPage(index)}
          >
            {page.title}
          </button>
        ))}
      </div>
      
      <div className="book">
        <div className={`page-wrapper ${isFlipping ? 'flipping' : ''}`}>
          <div className="page current-page">
            {renderPageContent(currentPage)}
          </div>
          <div className="page next-page">
            {renderPageContent(currentPage + 1 < pages.length ? currentPage + 1 : 0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageFlip;
