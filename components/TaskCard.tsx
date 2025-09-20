
import React from 'react';
import { Task, Status } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete?: (taskId: string) => void; // Optional for Kanban
  isDraggable?: boolean;
}

const statusStyles: Record<Status, string> = {
    [Status.Todo]: 'bg-gray-200 text-gray-800',
    [Status.InProgress]: 'bg-blue-200 text-blue-800',
    [Status.Done]: 'bg-green-200 text-green-800',
};

const priorityBorderColor = (score: number): string => {
    if (score > 20) return 'border-l-red-500';
    if (score > 15) return 'border-l-orange-500';
    if (score > 10) return 'border-l-yellow-500';
    return 'border-l-gray-300';
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, isDraggable = false }) => {
    const handleDragStart = (e: React.DragEvent<HTMLLIElement>) => {
        e.dataTransfer.setData("taskId", task.id);
    };

    return (
        <li
            draggable={isDraggable}
            onDragStart={isDraggable ? handleDragStart : undefined}
            className={`flex items-center justify-between p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 border-l-4 ${priorityBorderColor(task.priorityScore)} ${isDraggable ? 'cursor-grab rounded-lg shadow-md my-2' : 'border-b-0'}`}
        >
            <div className="flex-1 min-w-0 mr-4" onClick={() => onEdit(task)}>
                <p className="text-md font-semibold text-gray-900 dark:text-white truncate">{task.title}</p>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span>{task.dueDate}</span>
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusStyles[task.status]}`}>
                        {task.status.replace('-', ' ')}
                    </span>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                 <div className="text-right">
                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400">Priority</p>
                    <p className="text-lg font-extrabold text-gray-800 dark:text-white">{task.priorityScore}</p>
                </div>
                {onDelete && (
                    <div className="flex items-center ml-4">
                        <button onClick={() => onEdit(task)} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                        </button>
                        <button onClick={() => onDelete(task.id)} className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                )}
            </div>
        </li>
    );
};

export default TaskCard;
