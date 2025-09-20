
import React from 'react';
import { Task } from '../types';
import TaskCard from './TaskCard';

interface DashboardProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, onEditTask, onDeleteTask }) => {
  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Tasks</h2>
       {tasks.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {tasks.map(task => (
                <TaskCard 
                    key={task.id} 
                    task={task} 
                    onEdit={onEditTask} 
                    onDelete={onDeleteTask} 
                />
            ))}
            </ul>
        </div>
        ) : (
            <div className="text-center py-12 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">All Clear!</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">You have no tasks. Add one to get started.</p>
            </div>
        )}
    </div>
  );
};

export default Dashboard;
