import React, { useEffect, useState } from 'react';
import { Task } from '../lib/types';
import { TimerIcon, XIcon } from 'lucide-react';
interface FocusTimerProps {
  task: Task;
  onComplete: () => void;
  onCancel: () => void;
}
const FocusTimer: React.FC<FocusTimerProps> = ({
  task,
  onComplete,
  onCancel
}) => {
  // Default to 25 minutes (1500 seconds) for focus sprint
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      onComplete();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining, onComplete]);
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  const calculateProgress = (): number => {
    return (25 * 60 - timeRemaining) / (25 * 60) * 100;
  };
  return <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Focus Sprint</h2>
          <button onClick={() => setShowConfirmation(true)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
            <XIcon size={20} />
          </button>
        </div>
        <div className="text-center mb-8">
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            {task.title}
          </h3>
          <p className="text-gray-500">{task.description}</p>
        </div>
        <div className="relative mb-8">
          <div className="w-48 h-48 mx-auto relative">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="#3b82f6" strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - 283 * calculateProgress() / 100} transform="rotate(-90 50 50)" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800">
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-sm text-gray-500">remaining</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          {isActive ? <button onClick={() => setIsActive(false)} className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium">
              Pause
            </button> : <button onClick={() => setIsActive(true)} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center">
              <TimerIcon size={18} className="mr-2" />
              {timeRemaining === 25 * 60 ? 'Start' : 'Resume'} Focus
            </button>}
        </div>
        {showConfirmation && <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                End focus sprint?
              </h3>
              <p className="text-gray-600 mb-6">
                Your progress will not be saved. Are you sure you want to exit?
              </p>
              <div className="flex justify-end space-x-3">
                <button onClick={() => setShowConfirmation(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  Cancel
                </button>
                <button onClick={onCancel} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
                  End Sprint
                </button>
              </div>
            </div>
          </div>}
      </div>
    </div>;
};
export default FocusTimer; 