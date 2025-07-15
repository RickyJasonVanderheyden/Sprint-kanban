import React from 'react';
import { EnergyLevel } from '../lib/types';
import { BatteryFullIcon, BatteryMediumIcon, BatteryLowIcon } from 'lucide-react';
interface EnergySelectorProps {
  currentLevel: EnergyLevel;
  onChange: (level: EnergyLevel) => void;
}
const EnergySelector: React.FC<EnergySelectorProps> = ({
  currentLevel,
  onChange
}) => {
  const energyLevels: {
    value: EnergyLevel;
    label: string;
    icon: React.ReactNode;
    color: string;
  }[] = [{
    value: 'high',
    label: 'High Energy',
    icon: <BatteryFullIcon className="h-6 w-6" />,
    color: 'bg-green-100 border-green-300 text-green-700'
  }, {
    value: 'medium',
    label: 'Medium Energy',
    icon: <BatteryMediumIcon className="h-6 w-6" />,
    color: 'bg-yellow-100 border-yellow-300 text-yellow-700'
  }, {
    value: 'low',
    label: 'Low Energy',
    icon: <BatteryLowIcon className="h-6 w-6" />,
    color: 'bg-red-100 border-red-300 text-red-700'
  }];
  return <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">
        How's your energy right now?
      </h2>
      <p className="text-gray-500 mb-4">
        Select your current energy level to get task recommendations
      </p>
      <div className="flex flex-wrap gap-4">
        {energyLevels.map(level => <button key={level.value} onClick={() => onChange(level.value)} className={`flex items-center px-4 py-3 rounded-lg border-2 transition-all ${currentLevel === level.value ? `${level.color} border-2` : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100:bg-gray-800'}`}>
            <span className="mr-2">{level.icon}</span>
            <span className="font-medium">{level.label}</span>
          </button>)}
      </div>
    </div>;
};
export default EnergySelector; 