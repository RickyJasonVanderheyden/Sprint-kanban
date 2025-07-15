import React, { useEffect } from 'react';
import { CheckIcon, XIcon, AlertTriangleIcon } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 3000
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          text: 'text-green-800',
          icon: <CheckIcon className="w-4 h-4 text-green-600" />
        };
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          text: 'text-red-800',
          icon: <XIcon className="w-4 h-4 text-red-600" />
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          text: 'text-yellow-800',
          icon: <AlertTriangleIcon className="w-4 h-4 text-yellow-600" />
        };
      default:
        return {
          bg: 'bg-gray-50 border-gray-200',
          text: 'text-gray-800',
          icon: <AlertTriangleIcon className="w-4 h-4 text-gray-600" />
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`flex items-center p-3 rounded-lg border shadow-sm ${styles.bg}`}>
        <div className="mr-2">{styles.icon}</div>
        <p className={`text-sm ${styles.text}`}>{message}</p>
        <button
          onClick={onClose}
          className={`ml-3 ${styles.text} hover:opacity-70`}
        >
          <XIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
