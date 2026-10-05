import { useEffect, useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import type { Note, NoteInput } from '../../types';

interface NoteDialogProps { note: Note | null; busy: boolean; onClose: () => void; onSave: (input: NoteInput) => Promise<void> }

export function NoteDialog({ note, busy, onClose, onSave }: NoteDialogProps) {
  const [title, setTitle] = useState(note?.title ?? '');
  const [content, setContent] = useState(note?.content ?? '');
  const [error, setError] = useState('');
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape' && !busy) onClose(); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [busy, onClose]);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) { setError('Add both a title and some content.'); return; }
    setError('');
    try { await onSave({ title: title.trim(), content: content.trim() }); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not save this note.'); }
  };

  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onClose(); }}>
    <form role="dialog" aria-modal="true" aria-labelledby="note-dialog-title" className="modal-card" onSubmit={(event) => void submit(event)}>
      <div className="flex items-start justify-between"><div><p className="eyebrow">A SPACE FOR YOUR THOUGHTS</p><h2 id="note-dialog-title" className="mt-2 font-display text-2xl font-semibold text-ink">{note ? 'Edit note' : 'Write a note'}</h2></div><button type="button" className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={20} /></button></div>
      <label className="field-label mt-6" htmlFor="note-title">Title</label><input id="note-title" autoFocus maxLength={160} className="field mt-2" placeholder="Give this note a name" value={title} onChange={(event) => setTitle(event.target.value)} />
      <label className="field-label mt-5" htmlFor="note-content">Your note</label><textarea id="note-content" maxLength={12000} rows={9} className="field mt-2 resize-y" placeholder="Start writing…" value={content} onChange={(event) => setContent(event.target.value)} />
      {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
      <div className="mt-7 flex justify-end gap-3"><button type="button" className="button-secondary" disabled={busy} onClick={onClose}>Cancel</button><button className="button-primary" disabled={busy}>{busy ? 'Saving…' : note ? 'Save changes' : 'Save note'}</button></div>
    </form>
  </div>;
}