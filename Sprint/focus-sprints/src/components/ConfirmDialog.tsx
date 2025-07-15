import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Delete',
  cancelText = 'Cancel'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-sm w-full mx-4 shadow-lg border">
        <p className="text-sm text-gray-700 mb-3">{message}</p>
        
        <div className="flex space-x-2 justify-end">
          <button
            onClick={onCancel}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
