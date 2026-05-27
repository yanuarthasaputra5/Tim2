import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'Memuat data...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Loader2 size={32} className="animate-spin" style={{ color: '#f59e0b' }} />
      <p className="text-sm" style={{ color: '#64748b' }}>{text}</p>
    </div>
  );
}
