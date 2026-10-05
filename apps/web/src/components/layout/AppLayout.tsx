import { BookOpenText, CheckSquare2, Home, Menu, Plus, Sparkles, X } from 'lucide-react';
import { useState } from 'react';

export type PageName = 'Dashboard' | 'Tasks' | 'Notes';

interface AppLayoutProps {
  page: PageName;
  onNavigate: (page: PageName) => void;
  onCreate: () => void;
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard' as const, icon: Home },
  { name: 'Tasks' as const, icon: CheckSquare2 },
  { name: 'Notes' as const, icon: BookOpenText },
];

export function AppLayout({ page, onNavigate, onCreate, children }: AppLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const go = (target: PageName) => { onNavigate(target); setMenuOpen(false); };

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {menuOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="flex items-center justify-between px-7 pt-8">
          <button onClick={() => go('Dashboard')} className="flex items-center gap-3 text-left" aria-label="Daybook home">
            <span className="brand-mark"><Sparkles size={19} strokeWidth={2.2} /></span>
            <span className="font-display text-[21px] font-bold tracking-tight text-ink">daybook</span>
          </button>
          <button className="icon-button lg:hidden" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X size={20} /></button>
        </div>
        <p className="px-7 pb-3 pt-11 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">Workspace</p>
        <nav aria-label="Main navigation" className="space-y-1 px-3">
          {navigation.map(({ name, icon: Icon }) => (
            <button key={name} onClick={() => go(name)} className={`nav-item ${page === name ? 'nav-item-active' : ''}`} aria-current={page === name ? 'page' : undefined}>
              <Icon size={18} strokeWidth={1.9} /><span>{name}</span>
              {name === 'Tasks' && <span className="ml-auto rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-slate-500">Today</span>}
            </button>
          ))}
        </nav>
        <div className="mx-6 mt-9 border-t border-slate-100" />
        <div className="m-5 mt-7 rounded-2xl bg-[#f3f0ff] p-4">
          <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl bg-white text-violet-500 shadow-sm"><Sparkles size={16} /></span>
          <p className="text-sm font-semibold text-slate-800">A little at a time</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">Make room for what matters today.</p>
        </div>
        <div className="mt-auto px-6 pb-7 pt-6 text-xs text-slate-400">A calmer way to get things done.</div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <button className="icon-button lg:hidden" aria-label="Open navigation" onClick={() => setMenuOpen(true)}><Menu size={21} /></button>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400"><span>My workspace</span><span>/</span><span className="text-slate-600">{page}</span></div>
          <button className="button-primary ml-auto" onClick={onCreate}><Plus size={16} strokeWidth={2.4} /><span>{page === 'Notes' ? 'New note' : 'New task'}</span></button>
        </header>
        <main className="mx-auto max-w-[1160px] px-5 pb-12 pt-8 sm:px-8 lg:px-11">{children}</main>
      </div>
    </div>
  );
}