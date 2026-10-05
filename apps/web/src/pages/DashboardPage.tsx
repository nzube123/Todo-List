import { ArrowRight, BookOpenText, Check, CheckCircle2, Circle, Clock3, Pin, Plus, Sparkles } from 'lucide-react';
import type { Note, Todo } from '../types';
import type { PageName } from '../components/layout/AppLayout';
import { EmptyState, ErrorState, Loading } from '../components/ui/Feedback';

interface DashboardPageProps {
  todos: Todo[]; notes: Note[]; loading: boolean; error: string;
  onRetry: () => void; onNavigate: (page: PageName) => void; onCreate: (page: 'Tasks' | 'Notes') => void;
}

const dateLabel = (date: string) => new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(date));

export function DashboardPage({ todos, notes, loading, error, onRetry, onNavigate, onCreate }: DashboardPageProps) {
  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  const done = todos.filter((todo) => todo.completed).length;
  const pending = todos.length - done;
  const recentTodos = [...todos].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);
  const recentNotes = notes.slice(0, 3);
  const pinned = notes.filter((note) => note.pinned).slice(0, 3);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return <div className="space-y-8">
    <section className="welcome-banner">
      <div className="relative z-10 max-w-lg"><span className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1.5 text-[11px] font-semibold text-violet-700"><Sparkles size={13} /> YOUR PERSONAL WORKSPACE</span><h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-[38px]">{greeting}. <span className="text-violet-500">Let’s make today count.</span></h1><p className="mt-3 max-w-md text-sm leading-6 text-slate-500">A fresh page, a clear mind. Keep your plans close and move at your own pace.</p><button className="button-primary mt-5" onClick={() => onCreate('Tasks')}><Plus size={16} /> Add a task</button></div>
      <div className="welcome-art" aria-hidden="true"><div className="art-circle art-circle-one" /><div className="art-circle art-circle-two" /><div className="art-leaf">✳</div><div className="art-sparkle">✦</div></div>
    </section>

    <section aria-label="Workspace overview" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      <StatCard label="Total tasks" value={todos.length} icon={<CheckCircle2 size={18} />} tone="violet" caption="All on your list" />
      <StatCard label="Completed" value={done} icon={<Check size={18} />} tone="green" caption={todos.length ? `${Math.round(done / todos.length * 100)}% of your tasks` : 'Ready when you are'} />
      <StatCard label="Still to do" value={pending} icon={<Clock3 size={18} />} tone="amber" caption={pending ? 'One step at a time' : 'Nothing pending'} />
      <StatCard label="Your notes" value={notes.length} icon={<BookOpenText size={18} />} tone="blue" caption={pinned.length ? `${pinned.length} pinned for later` : 'Thoughts, collected'} />
    </section>

    <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
      <section className="surface-card">
        <div className="section-heading"><div><p className="eyebrow">A LITTLE MOMENTUM</p><h2 className="mt-1 font-display text-xl font-semibold text-ink">Recent tasks</h2></div><button className="text-link" onClick={() => onNavigate('Tasks')}>See all <ArrowRight size={14} /></button></div>
        {recentTodos.length ? <div className="divide-y divide-slate-100">{recentTodos.map((todo) => <div key={todo.id} className="flex items-center gap-3 py-3.5"><span className={`dashboard-check ${todo.completed ? 'dashboard-check-done' : ''}`}>{todo.completed && <Check size={12} />}</span><span className={`min-w-0 flex-1 truncate text-sm ${todo.completed ? 'text-slate-400 line-through' : 'font-medium text-slate-700'}`}>{todo.title}</span><span className={`priority-dot priority-${todo.priority.toLowerCase()}`} /><span className="text-xs capitalize text-slate-400">{todo.priority.toLowerCase()}</span></div>)}</div> : <EmptyState icon={<Circle size={21} />} title="No tasks just yet" description="Add your first task and give today a little direction." action={<button className="text-link" onClick={() => onCreate('Tasks')}><Plus size={15} /> Add a task</button>} />}
      </section>

      <section className="surface-card">
        <div className="section-heading"><div><p className="eyebrow">THOUGHTS TO KEEP</p><h2 className="mt-1 font-display text-xl font-semibold text-ink">Pinned notes</h2></div><button className="text-link" onClick={() => onNavigate('Notes')}>All notes <ArrowRight size={14} /></button></div>
        {pinned.length ? <div className="space-y-3">{pinned.map((note) => <button key={note.id} onClick={() => onNavigate('Notes')} className="pinned-preview w-full text-left"><span className="flex items-center gap-2 text-sm font-semibold text-slate-700"><Pin size={13} className="fill-amber-300 text-amber-500" />{note.title}</span><span className="mt-2 block line-clamp-2 text-xs leading-5 text-slate-500">{note.content}</span></button>)}</div> : <EmptyState icon={<Pin size={20} />} title="Save a thought for later" description="Pin your favorite notes and they’ll be waiting here." action={<button className="text-link" onClick={() => onCreate('Notes')}><Plus size={15} /> Write a note</button>} />}
      </section>
    </div>

    <section className="surface-card"><div className="section-heading"><div><p className="eyebrow">RECENTLY CAPTURED</p><h2 className="mt-1 font-display text-xl font-semibold text-ink">Recent notes</h2></div><button className="text-link" onClick={() => onNavigate('Notes')}>See all <ArrowRight size={14} /></button></div>
      {recentNotes.length ? <div className="grid gap-3 md:grid-cols-3">{recentNotes.map((note) => <button key={note.id} onClick={() => onNavigate('Notes')} className="recent-note text-left"><span className="block truncate text-sm font-semibold text-slate-700">{note.title}</span><span className="mt-2 line-clamp-3 block min-h-[60px] text-xs leading-5 text-slate-500">{note.content}</span><span className="mt-3 block text-[11px] text-slate-400">Updated {dateLabel(note.updatedAt)}</span></button>)}</div> : <EmptyState icon={<BookOpenText size={21} />} title="A blank page is full of possibility" description="Start a note to keep an idea, a list, or a passing thought." action={<button className="text-link" onClick={() => onCreate('Notes')}><Plus size={15} /> Write a note</button>} />}
    </section>
  </div>;
}

function StatCard({ label, value, icon, tone, caption }: { label: string; value: number; icon: React.ReactNode; tone: string; caption: string }) {
  return <div className="stat-card"><span className={`stat-icon stat-${tone}`}>{icon}</span><p className="mt-4 text-xs font-medium text-slate-500">{label}</p><p className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">{value}</p><p className="mt-1 text-[11px] text-slate-400">{caption}</p></div>;
}