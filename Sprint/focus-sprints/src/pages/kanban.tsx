import React, { useState } from 'react';
import KanbanBoard from '../components/KanbanBoard';
import TabNav from '../components/TabNav';
import FloatingBubbles from '../components/FloatingBubbles';
import TaskCat from '../components/TaskCat';

const KanbanPage: React.FC = () => {
  const [taskCount, setTaskCount] = useState(0);

  return (
    <div className="min-h-screen color-changing-bg">
      <FloatingBubbles />
      <TabNav activeTab="kanban" />
      <TaskCat remainingTasks={taskCount} />
      <div className="max-w-7xl mx-auto p-4 md:p-8 pt-20">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Kanban Board</h1>
          <p className="text-white/80 text-lg drop-shadow-md">Organize your projects with visual workflow</p>
        </header>
        <KanbanBoard onTaskCountChange={setTaskCount} />
      </div>
    </div>
  );
};

export default KanbanPage; 