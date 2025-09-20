
import React, { useState, useCallback, useMemo } from 'react';
import { Task, Status, View } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';
import TaskModal from './components/TaskModal';
import PomodoroTimer from './components/PomodoroTimer';

// Mock Data
const initialTasks: Task[] = [
  { id: '1', title: 'Finalize Q3 report', description: 'Compile sales data and create final presentation slides.', dueDate: '2025-09-30', urgency: 5, importance: 5, priorityScore: 25, status: Status.Todo },
  { id: '2', title: 'Design new landing page', description: 'Create mockups and prototypes in Figma.', dueDate: '2025-10-15', urgency: 4, importance: 4, priorityScore: 20, status: Status.InProgress },
  { id: '3', title: 'Fix login bug', description: 'Investigate and resolve the authentication issue on the staging server.', dueDate: '2025-09-28', urgency: 5, importance: 3, priorityScore: 21, status: Status.InProgress },
  { id: '4', title: 'User research interviews', description: 'Schedule and conduct interviews with 5 target users.', dueDate: '2025-10-05', urgency: 3, importance: 5, priorityScore: 19, status: Status.Todo },
  { id: '5', title: 'Deploy v2.1 to production', description: 'Merge all feature branches and deploy to the live environment.', dueDate: '2025-09-25', urgency: 2, importance: 2, priorityScore: 10, status: Status.Done },
];


const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [view, setView] = useState<View>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const handleOpenModal = useCallback((task: Task | null) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  }, []);

  const handleSaveTask = useCallback((taskData: Omit<Task, 'id' | 'priorityScore'> & { id?: string }) => {
    const priorityScore = (taskData.importance * 2) + (taskData.urgency * 3);

    if (taskData.id) {
      // Update existing task
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskData.id ? { ...task, ...taskData, priorityScore } : task
        )
      );
    } else {
      // Add new task
      const newTask: Task = {
        ...taskData,
        id: new Date().getTime().toString(),
        priorityScore,
        status: Status.Todo,
      };
      setTasks(prevTasks => [...prevTasks, newTask]);
    }
    handleCloseModal();
  }, [handleCloseModal]);

  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  }, []);

  const handleUpdateTaskStatus = useCallback((taskId: string, newStatus: Status) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  }, []);

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (b.priorityScore !== a.priorityScore) {
        return b.priorityScore - a.priorityScore;
      }
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [tasks]);


  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <Header currentView={view} setView={setView} onNewTask={() => handleOpenModal(null)} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {view === 'dashboard' ? (
          <Dashboard tasks={sortedTasks} onEditTask={handleOpenModal} onDeleteTask={handleDeleteTask} />
        ) : (
          <KanbanBoard tasks={tasks} onUpdateTaskStatus={handleUpdateTaskStatus} onEditTask={handleOpenModal} />
        )}
      </main>
      <PomodoroTimer />
      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveTask}
          taskToEdit={taskToEdit}
        />
      )}
    </div>
  );
};

export default App;
