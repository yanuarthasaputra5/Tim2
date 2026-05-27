import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { KeyRound, Trash2, Shield, ChevronDown } from 'lucide-react';
import userService from '../../../services/userService';
import roleService from '../../../services/roleService';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';

const pwSchema = z.object({
  password:              z.string().min(8, 'Password minimal 8 karakter'),
  password_confirmation: z.string(),
}).refine((d) => d.password === d.password_confirmation, {
  message: 'Konfirmasi password tidak cocok',
  path: ['password_confirmation'],
});

const roleSchema = z.object({
  role: z.string().min(1, 'Role wajib dipilih'),
});

const inputSt = (err) => ({
  width: '100%', padding: '10px 12px', borderRadius: '8px',
  fontSize: '14px', color: '#e2e8f0',
  backgroundColor: 'rgba(255,255,255,0.05)',
  border: `1px solid ${err ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
  outline: 'none',
});

export default function UsersPage() {
  const [users, setUsers]             = useState([]);
  const [roles, setRoles]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [pwTarget, setPwTarget]       = useState(null);
  const [roleTarget, setRoleTarget]   = useState(null);
  const [delTarget, setDelTarget]     = useState(null);
  const [pwLoading, setPwLoading]     = useState(false);
  const [roleLoading, setRoleLoading] = useState(false);
  const [delLoading, setDelLoading]   = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchData = async () => {
    try {
      const [usersRes, rolesRes] = await Promise.all([
        userService.getUsers(),
        roleService.getRoles(),
      ]);
      setUsers(usersRes.data || []);
      setRoles(rolesRes.data || []);
    } catch {
      toast.error('Gagal memuat data users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const { register: regPw, handleSubmit: handlePw, formState: { errors: pwErrors }, reset: resetPw } = useForm({ resolver: zodResolver(pwSchema) });
  const { register: regRole, handleSubmit: handleRole, formState: { errors: roleErrors }, reset: resetRole } = useForm({ resolver: zodResolver(roleSchema) });

  const onChangePassword = async (data) => {
    setPwLoading(true);
    try {
      await userService.changePassword(pwTarget.id, data.password, data.password_confirmation);
      toast.success(`Password ${pwTarget.name} berhasil diubah`);
      setPwTarget(null); resetPw();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengubah password');
    } finally { setPwLoading(false); }
  };

  const onAssignRole = async (data) => {
    setRoleLoading(true);
    try {
      await userService.assignRole(roleTarget.id, data.role);
      toast.success(`Role berhasil di-assign ke ${roleTarget.name}`);
      setRoleTarget(null); resetRole(); fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal assign role');
    } finally { setRoleLoading(false); }
  };

  const onDeleteUser = async () => {
    setDelLoading(true);
    try {
      await userService.deleteUser(delTarget.id);
      toast.success(`User ${delTarget.name} berhasil dihapus`);
      setDelTarget(null); fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus user');
    } finally { setDelLoading(false); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff' }}>Manajemen User</h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>{users.length} user terdaftar</p>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', borderRadius: '12px', backgroundColor: '#121318', border: '1px solid rgba(255,255,255,0.08)' }}>
        {users.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#475569', fontSize: '14px' }}>Belum ada user</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['#','Nama','Email','Role','Bergabung','Aksi'].map((h, i) => (
                  <th key={h} style={{
                    padding: '12px 16px', fontSize: '11px', fontWeight: 600, color: '#64748b',
                    textAlign: i === 5 ? 'right' : 'left',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr
                  key={user.id}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <td style={{ padding: '12px 16px', color: '#475569', fontSize: '12px' }}>{idx + 1}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                        backgroundColor: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#fbbf24' }}>
                          {user.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{user.name}</span>
                        {user.id === currentUser.id && (
                          <span style={{ marginLeft: '6px', fontSize: '11px', color: '#f59e0b' }}>(Anda)</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8' }}>{user.email}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {user.roles?.length > 0
                        ? user.roles.map((r) => <Badge key={r} color={r === 'admin' ? 'amber' : 'blue'}>{r}</Badge>)
                        : <span style={{ fontSize: '12px', color: '#475569' }}>—</span>
                      }
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '12px' }}>
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID') : '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                      <Button variant="ghost" className="px-2.5 py-1.5 text-xs" onClick={() => { setRoleTarget(user); resetRole(); }}>
                        <Shield size={13} /> Role
                      </Button>
                      <Button variant="outline" className="px-2.5 py-1.5 text-xs" onClick={() => { setPwTarget(user); resetPw(); }}>
                        <KeyRound size={13} /> Password
                      </Button>
                      {user.id !== currentUser.id && (
                        <Button variant="danger" className="px-2.5 py-1.5 text-xs" onClick={() => setDelTarget(user)}>
                          <Trash2 size={13} /> Hapus
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Change Password Modal */}
      <Modal isOpen={!!pwTarget} onClose={() => { setPwTarget(null); resetPw(); }} title={`Ganti Password — ${pwTarget?.name}`}>
        <form onSubmit={handlePw(onChangePassword)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#94a3b8', marginBottom: '6px' }}>Password Baru</label>
            <input {...regPw('password')} type="password" placeholder="Min. 8 karakter" style={inputSt(pwErrors.password)}
              onFocus={(e) => { e.target.style.borderColor = '#f59e0b'; }}
              onBlur={(e) => { e.target.style.borderColor = pwErrors.password ? '#ef4444' : 'rgba(255,255,255,0.1)'; }}
            />
            {pwErrors.password && <p style={{ fontSize: '12px', color: '#f87171', marginTop: '4px' }}>{pwErrors.password.message}</p>}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#94a3b8', marginBottom: '6px' }}>Konfirmasi Password</label>
            <input {...regPw('password_confirmation')} type="password" placeholder="Ulangi password" style={inputSt(pwErrors.password_confirmation)}
              onFocus={(e) => { e.target.style.borderColor = '#f59e0b'; }}
              onBlur={(e) => { e.target.style.borderColor = pwErrors.password_confirmation ? '#ef4444' : 'rgba(255,255,255,0.1)'; }}
            />
            {pwErrors.password_confirmation && <p style={{ fontSize: '12px', color: '#f87171', marginTop: '4px' }}>{pwErrors.password_confirmation.message}</p>}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '4px' }}>
            <Button variant="ghost" type="button" onClick={() => { setPwTarget(null); resetPw(); }}>Batal</Button>
            <Button type="submit" loading={pwLoading}>Simpan Password</Button>
          </div>
        </form>
      </Modal>

      {/* Assign Role Modal */}
      <Modal isOpen={!!roleTarget} onClose={() => { setRoleTarget(null); resetRole(); }} title={`Assign Role — ${roleTarget?.name}`}>
        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
          Role saat ini: {roleTarget?.roles?.join(', ') || '—'}
        </p>
        <form onSubmit={handleRole(onAssignRole)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#94a3b8', marginBottom: '6px' }}>Pilih Role</label>
            <div style={{ position: 'relative' }}>
              <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
              <select {...regRole('role')} style={{ ...inputSt(roleErrors.role), paddingRight: '36px', appearance: 'none', cursor: 'pointer' }}>
                <option value="" style={{ backgroundColor: '#121318' }}>-- Pilih Role --</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.name} style={{ backgroundColor: '#121318' }}>{r.name}</option>
                ))}
              </select>
            </div>
            {roleErrors.role && <p style={{ fontSize: '12px', color: '#f87171', marginTop: '4px' }}>{roleErrors.role.message}</p>}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '4px' }}>
            <Button variant="ghost" type="button" onClick={() => { setRoleTarget(null); resetRole(); }}>Batal</Button>
            <Button type="submit" loading={roleLoading}>Assign Role</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!delTarget} onClose={() => setDelTarget(null)} title="Hapus User">
        <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '4px' }}>
          Hapus user <span style={{ fontWeight: 600, color: '#ffffff' }}>"{delTarget?.name}"</span>?
        </p>
        <p style={{ fontSize: '12px', color: '#475569', marginBottom: '24px' }}>Semua token user akan dihapus. Tidak dapat dibatalkan.</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Button variant="ghost" onClick={() => setDelTarget(null)} disabled={delLoading}>Batal</Button>
          <Button variant="danger" loading={delLoading} onClick={onDeleteUser}>Ya, Hapus</Button>
        </div>
      </Modal>
    </div>
  );
}
