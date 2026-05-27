import { Trash2 } from 'lucide-react';
import Badge from '../../common/Badge';
import Button from '../../common/Button';
import EmptyState from '../../common/EmptyState';

export default function PermissionTable({ permissions, onDelete }) {
  if (permissions.length === 0) {
    return (
      <EmptyState
        title="Belum ada permission"
        description="Klik 'Tambah Permission' untuk membuat permission pertama."
      />
    );
  }

  return (
    <div
      style={{
        overflowX: 'auto',
        borderRadius: '12px',
        backgroundColor: '#121318',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <th className="text-left px-4 py-3 text-xs font-medium" style={{ color: '#64748b' }}>#</th>
            <th className="text-left px-4 py-3 text-xs font-medium" style={{ color: '#64748b' }}>Nama Permission</th>
            <th className="text-right px-4 py-3 text-xs font-medium" style={{ color: '#64748b' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {permissions.map((perm, idx) => (
            <tr
              key={perm.id ?? perm}
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <td className="px-4 py-3 text-xs" style={{ color: '#475569' }}>{idx + 1}</td>
              <td className="px-4 py-3">
                <Badge color="blue">{perm.name ?? perm}</Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end">
                  <Button variant="danger" className="px-2.5 py-1.5 text-xs" onClick={() => onDelete(perm)}>
                    <Trash2 size={13} /> Hapus
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
