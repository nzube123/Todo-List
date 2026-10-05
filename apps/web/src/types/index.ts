export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Todo {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TodoInput {
  title: string;
  description: string | null;
  priority: Priority;
  dueDate: string | null;
}

export interface NoteInput {
  title: string;
  content: string;
}