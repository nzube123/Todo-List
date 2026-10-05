import type { Todo, TodoInput, Priority } from '../types';
import { request } from './api';

export type TodoFilter = 'all' | 'active' | 'completed' | 'high';
export type TodoSort = 'newest' | 'oldest' | 'priority' | 'dueDate';
export interface TodoQuery { search?: string; filter?: TodoFilter; sort?: TodoSort }

export const todoService = {
  list(query: TodoQuery = {}) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) if (value) params.set(key, value);
    return request<Todo[]>(`/todos${params.size ? `?${params.toString()}` : ''}`);
  },
  create(input: TodoInput) {
    return request<Todo>('/todos', { method: 'POST', body: JSON.stringify(input) });
  },
  update(id: string, input: Partial<TodoInput> & { completed?: boolean }) {
    return request<Todo>(`/todos/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
  },
  remove(id: string) {
    return request<{ id: string }>(`/todos/${id}`, { method: 'DELETE' });
  },
  async toggle(id: string, completed: boolean) {
    return todoService.update(id, { completed });
  },
  priorityLabel(priority: Priority) { return priority.toLowerCase(); },
};