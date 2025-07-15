import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { PlusIcon } from 'lucide-react';
import Column from './Column';
import AddColumn from './AddColumn';

export interface CardType {
  id: string;
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high';
  color?: string;
  dueDate?: string;
  labels?: string[];
  _id?: string; // MongoDB ID
}

export interface ColumnType {
  id: string;
  title: string;
  cards: CardType[];
}

interface KanbanBoardProps {
  onTaskCountChange?: (count: number) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ onTaskCountChange }) => {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10, // Require 10px movement before drag starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // Require 250ms touch before drag starts
        tolerance: 5, // Allow 5px movement during delay
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Load kanban data from MongoDB
  useEffect(() => {
    fetchKanbanData();
  }, []);

  // Calculate and report task count whenever columns change
  useEffect(() => {
    if (onTaskCountChange) {
      // Count only tasks that are NOT in the "Done" column
      const incompleteTasks = columns.reduce((sum, column) => {
        // Don't count tasks in the "Done" column
        if (column.id === 'done' || column.title.toLowerCase().includes('done')) {
          return sum;
        }
        return sum + column.cards.length;
      }, 0);
      onTaskCountChange(incompleteTasks);
    }
  }, [columns, onTaskCountChange]);

  const fetchKanbanData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/kanban-cards');
      
      if (!response.ok) {
        // Check if it's a 401 (not authenticated) error
        if (response.status === 401) {
          setError('Please log in to view your kanban board');
          return;
        }
        
        // For other errors, show a generic message
        const errorText = await response.text();
        console.error('Kanban fetch error:', errorText);
        setError('Failed to load kanban data. Please try again.');
        return;
      }
      
      const kanbanData = await response.json();
      
      // Convert MongoDB data to column format
      const columnsFromDB: ColumnType[] = [
        {
          id: 'todo',
          title: 'To Do',
          cards: kanbanData.todo?.map((card: any) => ({
            id: card._id,
            title: card.title,
            description: card.description,
            priority: card.priority,
            color: card.color,
            dueDate: card.dueDate,
            labels: card.labels,
            _id: card._id
          })) || []
        },
        {
          id: 'in-progress',
          title: 'In Progress',
          cards: kanbanData['in-progress']?.map((card: any) => ({
            id: card._id,
            title: card.title,
            description: card.description,
            priority: card.priority,
            color: card.color,
            dueDate: card.dueDate,
            labels: card.labels,
            _id: card._id
          })) || []
        },
        {
          id: 'done',
          title: 'Done',
          cards: kanbanData.done?.map((card: any) => ({
            id: card._id,
            title: card.title,
            description: card.description,
            priority: card.priority,
            color: card.color,
            dueDate: card.dueDate,
            labels: card.labels,
            _id: card._id
          })) || []
        }
      ];
      
      setColumns(columnsFromDB);
      setError(null);
    } catch (err) {
      console.error('Error fetching kanban data:', err);
      setError('Failed to load kanban data. Please try refreshing the page.');
      
      // Fallback to default columns if fetch fails
      setColumns([
        { id: 'todo', title: 'To Do', cards: [] },
        { id: 'in-progress', title: 'In Progress', cards: [] },
        { id: 'done', title: 'Done', cards: [] }
      ]);
    } finally {
      setLoading(false);
    }
  };
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Handle card being dragged
    if (activeId.startsWith('card-')) {
      // Parse card ID more carefully to handle column IDs with hyphens
      const cardMatch = activeId.match(/^card-(.+)-column-(.+)$/);
      if (!cardMatch) return;
      
      const [, activeCardId, activeColumnId] = cardMatch;
      
      let targetColumnId: string;
      
      // If dropped on a column directly
      if (columns.find(col => col.id === overId)) {
        targetColumnId = overId;
      }
      // If dropped on another card
      else if (overId.startsWith('card-')) {
        const overCardMatch = overId.match(/^card-(.+)-column-(.+)$/);
        if (!overCardMatch) return;
        const [, , overColumnId] = overCardMatch;
        targetColumnId = overColumnId;
      }
      else {
        return; // Invalid drop target
      }

      // Don't do anything if dropped on the same column
      if (activeColumnId === targetColumnId) return;

      // Update local state immediately for better UX
      setColumns(prevColumns => {
        const activeColumn = prevColumns.find(col => col.id === activeColumnId);
        const targetColumn = prevColumns.find(col => col.id === targetColumnId);
        if (!activeColumn || !targetColumn) return prevColumns;

        const activeCard = activeColumn.cards.find(card => card.id === activeCardId);
        if (!activeCard) return prevColumns;

        // Remove card from source column
        const updatedSourceColumn = {
          ...activeColumn,
          cards: activeColumn.cards.filter(card => card.id !== activeCardId)
        };

        // Add card to target column
        const updatedTargetColumn = {
          ...targetColumn,
          cards: [...targetColumn.cards, activeCard]
        };

        return prevColumns.map(column => {
          if (column.id === activeColumnId) return updatedSourceColumn;
          if (column.id === targetColumnId) return updatedTargetColumn;
          return column;
        });
      });

      // Update MongoDB
      try {
        await fetch('/api/kanban-cards', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cardId: activeCardId,
            column: targetColumnId
          })
        });
      } catch (error) {
        console.error('Failed to update card column:', error);
        // Revert local state if API call fails
        fetchKanbanData();
      }
    }

    // Handle column reordering
    if (columns.find(col => col.id === activeId) && columns.find(col => col.id === overId)) {
      const activeIndex = columns.findIndex(col => col.id === activeId);
      const overIndex = columns.findIndex(col => col.id === overId);
      if (activeIndex !== overIndex) {
        setColumns(arrayMove(columns, activeIndex, overIndex));
      }
    }
  };
  const addCard = async (columnId: string, title: string, description: string, priority: string, color: string, dueDate: string, labels: string[]) => {
    try {
      const response = await fetch('/api/kanban-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          column: columnId,
          priority,
          color,
          dueDate: dueDate || undefined,
          labels
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create card');
      }

      const newCard = await response.json();

      // Update local state
      setColumns(prevColumns => {
        return prevColumns.map(column => {
          if (column.id === columnId) {
            return {
              ...column,
              cards: [...column.cards, {
                id: newCard._id,
                title: newCard.title,
                description: newCard.description,
                priority: newCard.priority,
                color: newCard.color,
                dueDate: newCard.dueDate,
                labels: newCard.labels,
                _id: newCard._id
              }]
            };
          }
          return column;
        });
      });
    } catch (error) {
      console.error('Failed to add card:', error);
      setError('Failed to add card');
    }
  };
  const updateCard = async (columnId: string, cardId: string, title: string, description: string) => {
    try {
      const response = await fetch('/api/kanban-cards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: cardId,
          title,
          description,
          column: columnId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update card');
      }

      // Update local state
      setColumns(prevColumns => {
        return prevColumns.map(column => {
          if (column.id === columnId) {
            return {
              ...column,
              cards: column.cards.map(card => {
                if (card.id === cardId) {
                  return {
                    ...card,
                    title,
                    description
                  };
                }
                return card;
              })
            };
          }
          return column;
        });
      });
    } catch (error) {
      console.error('Failed to update card:', error);
      setError('Failed to update card');
    }
  };

  const updateFullCard = async (columnId: string, cardId: string, updatedCard: Partial<CardType>) => {
    try {
      const response = await fetch('/api/kanban-cards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: cardId,
          ...updatedCard,
          column: columnId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update card');
      }

      // Update local state
      setColumns(prevColumns => {
        return prevColumns.map(column => {
          if (column.id === columnId) {
            return {
              ...column,
              cards: column.cards.map(card => {
                if (card.id === cardId) {
                  return {
                    ...card,
                    ...updatedCard
                  };
                }
                return card;
              })
            };
          }
          return column;
        });
      });
    } catch (error) {
      console.error('Failed to update card:', error);
      setError('Failed to update card');
    }
  };

  const deleteCard = async (columnId: string, cardId: string) => {
    try {
      const response = await fetch('/api/kanban-cards', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: cardId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to delete card');
      }

      // Update local state
      setColumns(prevColumns => {
        return prevColumns.map(column => {
          if (column.id === columnId) {
            return {
              ...column,
              cards: column.cards.filter(card => card.id !== cardId)
            };
          }
          return column;
        });
      });
    } catch (error) {
      console.error('Failed to delete card:', error);
      setError('Failed to delete card');
    }
  };
  const addColumn = (title: string) => {
    setColumns(prevColumns => [...prevColumns, {
      id: `column-${Date.now()}`,
      title,
      cards: []
    }]);
    setShowAddColumn(false);
  };
  const deleteColumn = (columnId: string) => {
    setColumns(prevColumns => prevColumns.filter(column => column.id !== columnId));
  };

  const updateColumn = (columnId: string, newTitle: string) => {
    setColumns(prevColumns => 
      prevColumns.map(column => 
        column.id === columnId 
          ? { ...column, title: newTitle }
          : column
      )
    );
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-white/80 drop-shadow-md">Loading your kanban board...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-lg text-red-200 mb-4 drop-shadow-md">{error}</div>
        <button 
          onClick={fetchKanbanData}
          className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200 drop-shadow-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-4 min-w-max">
          <SortableContext items={columns.map(col => col.id)} strategy={horizontalListSortingStrategy}>
            {columns.map(column => <Column key={column.id} column={column} onAddCard={addCard} onUpdateCard={updateCard} onDeleteCard={deleteCard} onDeleteColumn={deleteColumn} onUpdateColumn={updateColumn} onUpdateFullCard={updateFullCard} />)}
          </SortableContext>
          {showAddColumn ? <AddColumn onAddColumn={addColumn} onCancel={() => setShowAddColumn(false)} /> : <button onClick={() => setShowAddColumn(true)} className="flex items-center justify-center h-12 px-4 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white transition-all duration-200 min-w-[280px] flex-shrink-0 border-2 border-dashed border-white/30 drop-shadow-lg">
              <PlusIcon size={18} className="mr-2" />
              Add Column
            </button>}
        </div>
      </div>
    </DndContext>;
};
export default KanbanBoard;