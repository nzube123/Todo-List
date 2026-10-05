import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppLayout, type PageName } from './components/layout/AppLayout';
import { TodoDialog } from './components/todos/TodoDialog';
import { NoteDialog } from './components/notes/NoteDialog';
import { Toast } from './components/ui/Feedback';
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { NotesPage } from './pages/NotesPage';
import { useDebouncedValue } from './hooks/useDebouncedValue';
import { todoService, type TodoFilter, type TodoSort } from './services/todo.service';
import { noteService } from './services/note.service';
import type { Note, NoteInput, Todo, TodoInput } from './types';

type DialogState = { type: 'todo'; item: Todo | null } | { type: 'note'; item: Note | null } | null;
type DataState<T> = { data: T; loading: boolean; error: string };

export default function App() {
  const [page, setPage] = useState<PageName>('Dashboard');
  const [todosState, setTodosState] = useState<DataState<Todo[]>>({ data: [], loading: true, error: '' });
  const [notesState, setNotesState] = useState<DataState<Note[]>>({ data: [], loading: true, error: '' });
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [sort, setSort] = useState<TodoSort>('newest');
  const [todoSearch, setTodoSearch] = useState('');
  const [noteSearch, setNoteSearch] = useState('');
  const delayedTodoSearch = useDebouncedValue(todoSearch);
  const delayedNoteSearch = useDebouncedValue(noteSearch);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [refreshToken, setRefreshToken] = useState(0);

  const loadTodos = useCallback(async () => {
    setTodosState((state) => ({ ...state, loading: true, error: '' }));
    try {
      const data = await todoService.list({ search: delayedTodoSearch, filter, sort });
      setTodosState({ data, loading: false, error: '' });
    } catch (cause) {
      setTodosState((state) => ({ ...state, loading: false, error: cause instanceof Error ? cause.message : 'Could not load tasks.' }));
    }
  }, [delayedTodoSearch, filter, sort]);

  const loadNotes = useCallback(async () => {
    setNotesState((state) => ({ ...state, loading: true, error: '' }));
    try {
      const data = await noteService.list(delayedNoteSearch);
      setNotesState({ data, loading: false, error: '' });
    } catch (cause) {
      setNotesState((state) => ({ ...state, loading: false, error: cause instanceof Error ? cause.message : 'Could not load notes.' }));
    }
  }, [delayedNoteSearch]);

  useEffect(() => { void loadTodos(); }, [loadTodos, refreshToken]);
  useEffect(() => { void loadNotes(); }, [loadNotes, refreshToken]);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(''), 3000); return () => window.clearTimeout(timer); }, [toast]);

  const refresh = () => setRefreshToken((token) => token + 1);
  const handleNavigate = (target: PageName) => { setPage(target); setDialog(null); };
  const handleCreate = (target: 'Tasks' | 'Notes' = page === 'Notes' ? 'Notes' : 'Tasks') => { setPage(target); setDialog(target === 'Tasks' ? { type: 'todo', item: null } : { type: 'note', item: null }); };
  const visibleTodos = useMemo(() => todosState.data, [todosState.data]);

  const saveTodo = async (input: TodoInput) => {
    if (dialog?.type !== 'todo') return;
    setSaving(true);
    try {
      if (dialog.item) await todoService.update(dialog.item.id, input);
      else await todoService.create(input);
      setDialog(null); setToast(dialog.item ? 'Task updated' : 'Task added'); refresh();
    } finally { setSaving(false); }
  };

  const saveNote = async (input: NoteInput) => {
    if (dialog?.type !== 'note') return;
    setSaving(true);
    try {
      if (dialog.item) await noteService.update(dialog.item.id, input);
      else await noteService.create(input);
      setDialog(null); setToast(dialog.item ? 'Note updated' : 'Note saved'); refresh();
    } finally { setSaving(false); }
  };

  const toggleTodo = async (todo: Todo) => {
    const previous = todosState.data;
    setTodosState((state) => ({ ...state, data: state.data.map((item) => item.id === todo.id ? { ...item, completed: !item.completed } : item) }));
    try { await todoService.toggle(todo.id, !todo.completed); setToast(todo.completed ? 'Task moved back to in progress' : 'Task completed'); refresh(); }
    catch (cause) { setTodosState((state) => ({ ...state, data: previous })); setToast(cause instanceof Error ? cause.message : 'Could not update task'); }
  };

  const deleteTodo = async (todo: Todo) => {
    if (!window.confirm(`Delete “${todo.title}”? This can’t be undone.`)) return;
    try { await todoService.remove(todo.id); setToast('Task deleted'); refresh(); }
    catch (cause) { setToast(cause instanceof Error ? cause.message : 'Could not delete task'); }
  };

  const togglePin = async (note: Note) => {
    try { await noteService.update(note.id, { pinned: !note.pinned }); setToast(note.pinned ? 'Note unpinned' : 'Note pinned'); refresh(); }
    catch (cause) { setToast(cause instanceof Error ? cause.message : 'Could not update note'); }
  };

  const deleteNote = async (note: Note) => {
    if (!window.confirm(`Delete “${note.title}”? This can’t be undone.`)) return;
    try { await noteService.remove(note.id); setToast('Note deleted'); refresh(); }
    catch (cause) { setToast(cause instanceof Error ? cause.message : 'Could not delete note'); }
  };

  return <>
    <AppLayout page={page} onNavigate={handleNavigate} onCreate={() => handleCreate()}>
      {page === 'Dashboard' && <DashboardPage todos={todosState.data} notes={notesState.data} loading={todosState.loading || notesState.loading} error={todosState.error || notesState.error} onRetry={refresh} onNavigate={handleNavigate} onCreate={handleCreate} />}
      {page === 'Tasks' && <TasksPage todos={visibleTodos} loading={todosState.loading} error={todosState.error} search={todoSearch} filter={filter} sort={sort} onSearch={setTodoSearch} onFilter={setFilter} onSort={setSort} onRetry={refresh} onCreate={() => handleCreate('Tasks')} onEdit={(todo) => setDialog({ type: 'todo', item: todo })} onToggle={(todo) => void toggleTodo(todo)} onDelete={(todo) => void deleteTodo(todo)} />}
      {page === 'Notes' && <NotesPage notes={notesState.data} loading={notesState.loading} error={notesState.error} search={noteSearch} onSearch={setNoteSearch} onRetry={refresh} onCreate={() => handleCreate('Notes')} onEdit={(note) => setDialog({ type: 'note', item: note })} onPin={(note) => void togglePin(note)} onDelete={(note) => void deleteNote(note)} />}
    </AppLayout>
    {dialog?.type === 'todo' && <TodoDialog todo={dialog.item} busy={saving} onClose={() => setDialog(null)} onSave={saveTodo} />}
    {dialog?.type === 'note' && <NoteDialog note={dialog.item} busy={saving} onClose={() => setDialog(null)} onSave={saveNote} />}
    {toast && <Toast message={toast} onClose={() => setToast('')} />}
  </>;
}