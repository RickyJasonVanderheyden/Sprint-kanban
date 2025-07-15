import React from 'react';
import { Task } from '../lib/types';
import { CheckCircleIcon, BatteryFullIcon, BatteryMediumIcon, BatteryLowIcon } from 'lucide-react';
interface DashboardProps {
  tasks: Task[];
}
const Dashboard: React.FC<DashboardProps> = ({
  tasks
}) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? completedTasks / totalTasks * 100 : 0;
  const tasksByEnergyLevel = {
    high: tasks.filter(task => task.energyLevel === 'high').length,
    medium: tasks.filter(task => task.energyLevel === 'medium').length,
    low: tasks.filter(task => task.energyLevel === 'low').length
  };
  const tasksByCategory = tasks.reduce((acc: Record<string, number>, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {});
  return <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Progress Dashboard</h2>
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-gray-600">Task Completion</span>
          <span className="text-sm font-medium text-gray-800">
            {completedTasks}/{totalTasks} ({Math.round(completionRate)}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{
          width: `${completionRate}%`
        }}></div>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-800 mb-3">
          Tasks by Energy Level
        </h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <BatteryFullIcon className="h-4 w-4 text-green-600 mr-2" />
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{
              width: `${tasksByEnergyLevel.high / totalTasks * 100}%`
            }}></div>
            </div>
            <span className="ml-2 text-xs text-gray-500">
              {tasksByEnergyLevel.high}
            </span>
          </div>
          <div className="flex items-center">
            <BatteryMediumIcon className="h-4 w-4 text-yellow-600 mr-2" />
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{
              width: `${tasksByEnergyLevel.medium / totalTasks * 100}%`
            }}></div>
            </div>
            <span className="ml-2 text-xs text-gray-500">
              {tasksByEnergyLevel.medium}
            </span>
          </div>
          <div className="flex items-center">
            <BatteryLowIcon className="h-4 w-4 text-red-600 mr-2" />
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{
              width: `${tasksByEnergyLevel.low / totalTasks * 100}%`
            }}></div>
            </div>
            <span className="ml-2 text-xs text-gray-500">
              {tasksByEnergyLevel.low}
            </span>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-800 mb-3">Daily Stats</h3>
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm text-gray-700">Tasks completed today</span>
          </div>
          <span className="text-lg font-bold text-blue-700">
            {completedTasks}
          </span>
        </div>
      </div>
    </div>;
};
export default Dashboard; 