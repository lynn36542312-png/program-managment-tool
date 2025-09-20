
export enum Status {
  Todo = 'todo',
  InProgress = 'in-progress',
  Done = 'done',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // Using string for simplicity in date picker
  urgency: number; // 1-5
  importance: number; // 1-5
  priorityScore: number;
  status: Status;
}

export type View = 'dashboard' | 'kanban';
