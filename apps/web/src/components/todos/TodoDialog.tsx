import { useEffect, useState, type FormEvent } from 'react';
import { CalendarDays, X } from 'lucide-react';
import type { Todo, TodoInput, Priority } from '../../types';

interface TodoDialogProps {
  todo: Todo | null;
  busy: boolean;
  onClose: () => void;
  onSave: (input: TodoInput) => Promise<void>;
}

export function TodoDialog({ todo, busy, onClose, onSave }: TodoDialogProps) {
  const [title, setTitle] = useState(todo?.title ?? '');
  const [description, setDescription] = useState(todo?.description ?? '');
  const [priority, setPriority] = useState<Priority>(todo?.priority ?? 'MEDIUM');
  const [dueDate, setDueDate] = useState(todo?.dueDate ? todo.dueDate.slice(0, 10) : '');
  const [error, setError] = useState('');

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape' && !busy) onClose(); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [busy, onClose]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) { setError('Give your task a title to get started.'); return; }
    setError('');
    try { await onSave({ title: title.trim(), description: description.trim() || null, priority, dueDate: dueDate ? new Date(`${dueDate}T12:00:00`).toISOString() : null }); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not save this task.'); }
  };

  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onClose(); }}>
    <form role="dialog" aria-modal="true" aria-labelledby="todo-dialog-title" className="modal-card" onSubmit={(event) => void submit(event)}>
      <div className="flex items-start justify-between"><div><p className="eyebrow">{todo ? 'MAKE AN UPDATE' : 'ADD TO YOUR LIST'}</p><h2 id="todo-dialog-title" className="mt-2 font-display text-2xl font-semibold text-ink">{todo ? 'Edit task' : 'Create a task'}</h2></div><button type="button" className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={20} /></button></div>
      <label className="field-label mt-6" htmlFor="todo-title">Task name</label><input id="todo-title" autoFocus maxLength={160} className="field mt-2" placeholder="e.g. Plan the week" value={title} onChange={(event) => setTitle(event.target.value)} />
      <label className="field-label mt-5" htmlFor="todo-description">Description <span className="font-normal text-slate-400">· optional</span></label><textarea id="todo-description" maxLength={2000} rows={3} className="field mt-2 resize-none" placeholder="Add a few details to help you get started…" value={description} onChange={(event) => setDescription(event.target.value)} />
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2"><div><label className="field-label" htmlFor="todo-priority">Priority</label><select id="todo-priority" className="field mt-2" value={priority} onChange={(event) => setPriority(event.target.value as Priority)}><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option></select></div><div><label className="field-label" htmlFor="todo-due-date">Due date <span className="font-normal text-slate-400">· optional</span></label><div className="relative mt-2"><CalendarDays size={16} className="pointer-events-none absolute left-3 top-3 text-slate-400" /><input id="todo-due-date" type="date" className="field pl-9" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></div></div></div>
      {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
      <div className="mt-7 flex justify-end gap-3"><button type="button" className="button-secondary" disabled={busy} onClick={onClose}>Cancel</button><button className="button-primary" disabled={busy}>{busy ? 'Saving…' : todo ? 'Save changes' : 'Add task'}</button></div>
    </form>
  </div>;
}