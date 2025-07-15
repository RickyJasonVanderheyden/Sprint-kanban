import React from 'react';
import { Task } from '../lib/types';

interface TaskDashboardProps {
  tasks: Task[];
}

const TaskDashboard: React.FC<TaskDashboardProps> = ({ tasks }) => {
  // Calculate task statistics by category
  const getTaskStats = () => {
    const categories = ['work', 'personal', 'health', 'learning'];
    
    return categories.map(category => {
      const categoryTasks = tasks.filter(task => task.category === category);
      const completedTasks = categoryTasks.filter(task => task.completed);
      const totalTasks = categoryTasks.length;
      const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;
      
      return {
        category,
        total: totalTasks,
        completed: completedTasks.length,
        remaining: totalTasks - completedTasks.length,
        completionRate: Math.round(completionRate)
      };
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work':
        return { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-700' };
      case 'personal':
        return { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-700' };
      case 'health':
        return { bg: 'bg-green-500', light: 'bg-green-100', text: 'text-green-700' };
      case 'learning':
        return { bg: 'bg-yellow-500', light: 'bg-yellow-100', text: 'text-yellow-700' };
      default:
        return { bg: 'bg-gray-500', light: 'bg-gray-100', text: 'text-gray-700' };
    }
  };

  const formatCategoryName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getMotivationalMessage = (progress: number) => {
    if (progress === 100) return "All tasks completed";
    if (progress >= 80) return "Almost finished";
    if (progress >= 60) return "Making good progress";
    if (progress >= 40) return "Halfway there";
    if (progress >= 20) return "Getting started";
    if (progress > 0) return "In progress";
    return "Ready to begin";
  };

  const stats = getTaskStats();
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const overallProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Task Progress</h2>
        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {getMotivationalMessage(overallProgress)}
        </div>
      </div>
      
      {/* Overall Progress */}
      <div className="mb-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
            <p className="text-sm text-gray-600">Track your task completion</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(overallProgress)}%
            </div>
            <div className="text-sm text-gray-600">
              {completedTasks} of {totalTasks} tasks
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="h-3 bg-blue-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Progress milestones */}
        <div className="flex justify-between mt-3 text-xs text-gray-500">
          <span className={overallProgress >= 0 ? 'text-blue-600 font-medium' : ''}>0%</span>
          <span className={overallProgress >= 25 ? 'text-blue-600 font-medium' : ''}>25%</span>
          <span className={overallProgress >= 50 ? 'text-blue-600 font-medium' : ''}>50%</span>
          <span className={overallProgress >= 75 ? 'text-blue-600 font-medium' : ''}>75%</span>
          <span className={overallProgress >= 100 ? 'text-blue-600 font-bold' : ''}>100%</span>
        </div>
        
        {/* Achievement message for completion */}
        {overallProgress >= 100 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-center text-blue-800 text-sm font-medium">
              All tasks completed
            </div>
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      <div className="space-y-4">
        {stats.filter(stat => stat.total > 0).map(stat => {
          const colors = getCategoryColor(stat.category);
          
          return (
            <div key={stat.category} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${colors.bg}`}></div>
                  <span className="text-sm font-medium text-gray-700">
                    {formatCategoryName(stat.category)}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {stat.remaining} remaining
                  </div>
                  <div className="text-xs text-gray-600">
                    {stat.completed}/{stat.total} done
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className={`w-full ${colors.light} rounded-full h-2`}>
                  <div 
                    className={`${colors.bg} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${stat.completionRate}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-gray-600">
                    {stat.completionRate}% complete
                  </div>
                  {stat.completionRate === 100 && (
                    <div className="text-xs text-gray-700 font-medium">
                      Complete
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="text-2xl font-bold text-gray-900 mb-1">{completedTasks}</div>
          <div className="text-sm text-gray-700 font-medium">Completed</div>
        </div>
        <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="text-2xl font-bold text-gray-900 mb-1">{totalTasks - completedTasks}</div>
          <div className="text-sm text-gray-700 font-medium">Remaining</div>
        </div>
      </div>
    </div>
  );
};

export default TaskDashboard;
