import { AlertCircle, Check, LoaderCircle, X } from 'lucide-react';

export function Loading({ label = 'Loading your workspace' }: { label?: string }) {
  return <div className="flex min-h-52 flex-col items-center justify-center gap-3 text-sm text-slate-400"><LoaderCircle className="animate-spin text-violet-500" size={24} /><span>{label}</span></div>;
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <div role="alert" className="flex flex-col items-center rounded-2xl border border-red-100 bg-white px-6 py-12 text-center"><AlertCircle className="mb-3 text-red-400" size={25} /><p className="text-sm font-semibold text-slate-700">We couldn’t load this</p><p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p><button className="button-secondary mt-5" onClick={onRetry}>Try again</button></div>;
}

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return <div role="status" className="toast"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><Check size={14} /></span><span>{message}</span><button aria-label="Dismiss notification" onClick={onClose} className="ml-2 text-slate-400 hover:text-slate-600"><X size={16} /></button></div>;
}

export function EmptyState({ icon, title, description, action }: { icon: React.ReactNode; title: string; description: string; action?: React.ReactNode }) {
  return <div className="empty-state"><span className="empty-icon">{icon}</span><h3 className="mt-4 text-base font-semibold text-slate-800">{title}</h3><p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">{description}</p>{action && <div className="mt-5">{action}</div>}</div>;
}