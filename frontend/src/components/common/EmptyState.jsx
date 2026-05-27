import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'Belum ada data', description = '', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
      >
        <Inbox size={24} style={{ color: '#64748b' }} />
      </div>
      <p className="text-sm font-medium" style={{ color: '#cbd5e1' }}>{title}</p>
      {description && <p className="text-xs max-w-xs" style={{ color: '#64748b' }}>{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
