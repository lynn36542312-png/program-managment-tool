
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Task, Status } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'priorityScore' | 'status'> & { id?: string; status?: Status }) => void;
  taskToEdit: Task | null;
}

const Slider: React.FC<{label: string; value: number; onChange: (value: number) => void; minLabel: string; maxLabel: string;}> = ({label, value, onChange, minLabel, maxLabel}) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <div className="flex items-center space-x-4">
            <span className="text-xs text-gray-500 w-16 text-center">{minLabel}</span>
            <input
                type="range"
                min="1"
                max="5"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <span className="text-xs text-gray-500 w-16 text-center">{maxLabel}</span>
            <span className="font-bold text-blue-600 w-4">{value}</span>
        </div>
    </div>
);


const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, taskToEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [urgency, setUrgency] = useState(3);
  const [importance, setImportance] = useState(3);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setDueDate(taskToEdit.dueDate);
      setUrgency(taskToEdit.urgency);
      setImportance(taskToEdit.importance);
    } else {
      // Reset form for new task
      setTitle('');
      setDescription('');
      const today = new Date();
      today.setDate(today.getDate() + 1);
      setDueDate(today.toISOString().split('T')[0]);
      setUrgency(3);
      setImportance(3);
    }
  }, [taskToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: taskToEdit?.id,
      title,
      description,
      dueDate,
      urgency,
      importance,
      status: taskToEdit?.status || Status.Todo
    });
  };

  const priorityScore = useMemo(() => (importance * 2) + (urgency * 3), [importance, urgency]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
        style={{ animationFillMode: 'forwards' }}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{taskToEdit ? 'Edit Task' : 'Add New Task'}</h2>
                <div className="text-right">
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-semibold">Calculated Priority</span>
                    <p className="text-2xl font-extrabold text-gray-800 dark:text-white">{priorityScore}</p>
                </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                  id="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                <input
                  type="date"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>

              <Slider label="Urgency" value={urgency} onChange={setUrgency} minLabel="Not Urgent" maxLabel="Critical" />
              <Slider label="Importance" value={importance} onChange={setImportance} minLabel="Not Important" maxLabel="Very Important" />

            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 px-6 py-3 flex justify-end space-x-3 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Save Task
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale {
          animation-name: fade-in-scale;
          animation-duration: 0.2s;
        }
      `}</style>
    </div>
  );
};

export default TaskModal;
