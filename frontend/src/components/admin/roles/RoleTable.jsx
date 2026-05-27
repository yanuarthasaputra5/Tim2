import { Pencil, Trash2 } from 'lucide-react';
import Badge from '../../common/Badge';
import Button from '../../common/Button';
import EmptyState from '../../common/EmptyState';

export default function RoleTable({ roles, onEdit, onDelete }) {
  if (roles.length === 0) {
    return (
      <EmptyState
        title="Belum ada role"
        description="Klik 'Tambah Role' untuk membuat role pertama."
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
            <th className="text-left px-4 py-3 text-xs font-medium" style={{ color: '#64748b' }}>Nama Role</th>
            <th className="text-left px-4 py-3 text-xs font-medium" style={{ color: '#64748b' }}>Permissions</th>
            <th className="text-right px-4 py-3 text-xs font-medium" style={{ color: '#64748b' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role, idx) => (
            <tr
              key={role.id}
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <td className="px-4 py-3 text-xs" style={{ color: '#475569' }}>{idx + 1}</td>
              <td className="px-4 py-3">
                <Badge color="amber">{role.name}</Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {role.permissions?.length > 0
                    ? role.permissions.map((p) => <Badge key={p} color="slate">{p}</Badge>)
                    : <span className="text-xs" style={{ color: '#334155' }}>—</span>
                  }
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" className="px-2.5 py-1.5 text-xs" onClick={() => onEdit(role)}>
                    <Pencil size={13} /> Edit
                  </Button>
                  <Button variant="danger" className="px-2.5 py-1.5 text-xs" onClick={() => onDelete(role)}>
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
