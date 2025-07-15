import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { PlusIcon, MoreVerticalIcon, TrashIcon, EditIcon, CheckIcon, XIcon } from 'lucide-react';
import Card from './Card';
import AddCard from './AddCard';
import { ColumnType, CardType } from './KanbanBoard';
interface ColumnProps {
  column: ColumnType;
  onAddCard: (columnId: string, title: string, description: string, priority: string, color: string, dueDate: string, labels: string[]) => void;
  onUpdateCard: (columnId: string, cardId: string, title: string, description: string) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onUpdateColumn: (columnId: string, title: string) => void;
  onUpdateFullCard?: (columnId: string, cardId: string, updatedCard: Partial<CardType>) => void;
}
const Column: React.FC<ColumnProps> = ({
  column,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onDeleteColumn,
  onUpdateColumn,
  onUpdateFullCard
}) => {
  const [showAddCard, setShowAddCard] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptions]);

  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right - 150 + window.scrollX // Align to the right edge of button
      });
    }
    
    setShowOptions(!showOptions);
  };
  const handleSaveEdit = () => {
    if (editTitle.trim() && editTitle !== column.title) {
      onUpdateColumn(column.id, editTitle.trim());
    }
    setIsEditing(false);
    setShowOptions(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(column.title);
    setIsEditing(false);
    setShowOptions(false);
  };

  const handleDeleteColumn = () => {
    onDeleteColumn(column.id);
    setShowDeleteConfirm(false);
  };

  const {
    attributes,
    listeners,
    setNodeRef: setSortableNodeRef,
    transform,
    transition
  } = useSortable({
    id: column.id,
    data: {
      type: 'column'
    }
  });

  const { setNodeRef: setDroppableNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'column'
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  return (
    <>
      <div ref={(node) => {
        setSortableNodeRef(node);
        setDroppableNodeRef(node);
      }} style={style} className={`kanban-column flex flex-col bg-white/30 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 w-[280px] max-h-[80vh] flex-shrink-0 transition-all duration-200 hover:shadow-xl relative ${isOver ? 'ring-2 ring-blue-400 bg-blue-50/50' : ''}`}>
      <div className="p-4 flex justify-between items-center bg-white/90 backdrop-blur-sm rounded-t-xl border-b border-gray-200" {...attributes} {...listeners}>
        <div className="flex items-center space-x-2 flex-1">
          {isEditing ? (
            <div className="flex-1 flex items-center space-x-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                autoFocus
              />
              <button
                onClick={handleSaveEdit}
                className="p-1 text-green-600 hover:text-green-700 transition-colors"
              >
                <CheckIcon size={16} />
              </button>
              <button
                onClick={handleCancelEdit}
                className="p-1 text-red-600 hover:text-red-700 transition-colors"
              >
                <XIcon size={16} />
              </button>
            </div>
          ) : (
            <h3 className="font-semibold text-gray-800 flex-1">{column.title}</h3>
          )}
        </div>
        <div className="relative z-[100]">
          <button 
            ref={buttonRef}
            onClick={handleOptionsClick}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-all duration-200"
          >
            <MoreVerticalIcon size={16} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3 kanban-column relative">
        <SortableContext items={column.cards.map(card => `card-${card.id}-column-${column.id}`)} strategy={verticalListSortingStrategy}>
          {column.cards.map(card => <Card key={card.id} card={card} columnId={column.id} onUpdateCard={onUpdateCard} onDeleteCard={onDeleteCard} onUpdateFullCard={onUpdateFullCard} />)}
        </SortableContext>
      </div>
      <div className="p-3 border-t border-gray-200 bg-white/80 backdrop-blur-sm rounded-b-xl">
        {showAddCard ? <AddCard onAddCard={(title, description, priority, color, dueDate, labels) => {
        onAddCard(column.id, title, description, priority, color, dueDate, labels);
        setShowAddCard(false);
      }} onCancel={() => setShowAddCard(false)} /> : <button onClick={() => setShowAddCard(true)} className="flex items-center justify-center w-full py-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-sm transition-all duration-200 font-medium">
            <PlusIcon size={16} className="mr-2" />
            Add Card
          </button>}
      </div>
    </div>
    
    {/* Portal-based dropdown menu */}
    {showOptions && typeof window !== 'undefined' && createPortal(
      <div 
        ref={dropdownRef}
        className="fixed bg-white shadow-2xl rounded-lg z-[99999] border border-gray-300 overflow-hidden min-w-[150px]"
        style={{
          top: dropdownPosition.top,
          left: dropdownPosition.left,
        }}
      >
        <button onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsEditing(true);
          setShowOptions(false);
        }} className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors">
          <EditIcon size={14} className="mr-2" />
          Edit Title
        </button>
        <button onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setShowDeleteConfirm(true);
          setShowOptions(false);
        }} className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors">
          <TrashIcon size={14} className="mr-2" />
          Delete Column
        </button>
      </div>,
      document.body
    )}
    
    {/* Delete Confirmation Modal */}
    {showDeleteConfirm && (
      <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Column</h3>
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete "{column.title}"? This will also delete all cards in this column. This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteColumn}
              className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};
export default Column; 