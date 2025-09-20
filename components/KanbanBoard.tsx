
import React, { useState, useMemo } from 'react';
import { Task, Status } from '../types';
import TaskCard from './TaskCard';

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateTaskStatus: (taskId: string, newStatus: Status) => void;
  onEditTask: (task: Task) => void;
}

interface KanbanColumnProps {
  title: string;
  status: Status;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDrop: (status: Status) => void;
  taskCount: number;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, status, tasks, onEditTask, onDrop, taskCount }) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDrop(status);
    setIsOver(false);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`bg-gray-100 dark:bg-gray-800 rounded-xl p-4 flex-1 transition-all duration-300 ${isOver ? 'bg-blue-100 dark:bg-blue-900/50' : ''}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-gray-800 dark:text-white">{title}</h3>
        <span className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-semibold px-3 py-1 rounded-full">
          {taskCount}
        </span>
      </div>
      <div className="space-y-3 h-[calc(100vh-20rem)] overflow-y-auto pr-2">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onEdit={onEditTask} isDraggable />
        ))}
      </div>
    </div>
  );
};


const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onUpdateTaskStatus, onEditTask }) => {
  const handleDrop = (newStatus: Status) => (e: React.DragEvent<HTMLDivElement> | Status) => {
    const status = typeof e === 'string' ? e : newStatus;
    const taskId = (e as React.DragEvent<HTMLDivElement>).dataTransfer.getData("taskId");
    if (taskId) {
        onUpdateTaskStatus(taskId, status);
    }
  };

  const filteredTasks = useMemo(() => {
    return {
      [Status.Todo]: tasks.filter(t => t.status === Status.Todo),
      [Status.InProgress]: tasks.filter(t => t.status === Status.InProgress),
      [Status.Done]: tasks.filter(t => t.status === Status.Done),
    };
  }, [tasks]);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <KanbanColumn
        title="To-Do"
        status={Status.Todo}
        tasks={filteredTasks[Status.Todo]}
        onEditTask={onEditTask}
        onDrop={handleDrop(Status.Todo)}
        taskCount={filteredTasks[Status.Todo].length}
      />
      <KanbanColumn
        title="In Progress"
        status={Status.InProgress}
        tasks={filteredTasks[Status.InProgress]}
        onEditTask={onEditTask}
        onDrop={handleDrop(Status.InProgress)}
        taskCount={filteredTasks[Status.InProgress].length}
      />
      <KanbanColumn
        title="Done"
        status={Status.Done}
        tasks={filteredTasks[Status.Done]}
        onEditTask={onEditTask}
        onDrop={handleDrop(Status.Done)}
        taskCount={filteredTasks[Status.Done].length}
      />
    </div>
  );
};

export default KanbanBoard;
