import type { Note, NoteInput } from '../types';
import { request } from './api';

export const noteService = {
  list(search = '') {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    return request<Note[]>(`/notes${params.size ? `?${params.toString()}` : ''}`);
  },
  create(input: NoteInput) {
    return request<Note>('/notes', { method: 'POST', body: JSON.stringify(input) });
  },
  update(id: string, input: Partial<NoteInput> & { pinned?: boolean }) {
    return request<Note>(`/notes/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
  },
  remove(id: string) {
    return request<{ id: string }>(`/notes/${id}`, { method: 'DELETE' });
  },
};