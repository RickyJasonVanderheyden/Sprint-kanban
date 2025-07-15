import React, { useState } from 'react';
interface AddColumnProps {
  onAddColumn: (title: string) => void;
  onCancel: () => void;
}
const AddColumn: React.FC<AddColumnProps> = ({
  onAddColumn,
  onCancel
}) => {
  const [title, setTitle] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddColumn(title.trim());
      setTitle('');
    }
  };
  return <div className="bg-white/98 backdrop-blur-sm rounded-xl shadow-lg p-4 w-[280px] flex-shrink-0 border border-gray-200">
      <form onSubmit={handleSubmit}>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full mb-4 p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Column title" autoFocus />
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={!title.trim()} className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg disabled:bg-blue-300 transition-colors font-medium">
            Add
          </button>
        </div>
      </form>
    </div>;
};
export default AddColumn; 