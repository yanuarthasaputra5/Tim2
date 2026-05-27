import { useEffect, useState } from 'react';
import { Shield, Key, Users, Activity } from 'lucide-react';
import { toast } from 'react-hot-toast';
import roleService from '../../../services/roleService';
import permissionService from '../../../services/permissionService';
import Badge from '../../../components/common/Badge';

function StatsCard({ icon: Icon, label, value, iconColor, iconBg, loading }) {
  return (
    <div style={{
      backgroundColor: '#121318',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '12px',
        backgroundColor: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={22} style={{ color: iconColor }} />
      </div>
      <div>
        <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>{label}</p>
        {loading
          ? <div style={{ height: '28px', width: '48px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '6px', marginTop: '4px' }} />
          : <p style={{ fontSize: '28px', fontWeight: 700, color: iconColor, marginTop: '2px', lineHeight: 1 }}>{value}</p>
        }
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cols, setCols] = useState(window.innerWidth >= 768 ? (window.innerWidth >= 1024 ? 4 : 2) : 1);

  useEffect(() => {
    const handler = () => {
      const w = window.innerWidth;
      setCols(w >= 1024 ? 4 : w >= 640 ? 2 : 1);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesRes, permsRes] = await Promise.all([
          roleService.getRoles(),
          permissionService.getPermissions(),
        ]);
        setRoles(rolesRes.data || []);
        setPermissions(permsRes.data || []);
      } catch (err) {
        if (err.response?.status !== 403) toast.error('Gagal memuat data dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const isWide = window.innerWidth >= 1024;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff' }}>Dashboard</h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
          Selamat datang kembali,{' '}
          <span style={{ color: '#fbbf24', fontWeight: 600 }}>{user.name}</span>
        </p>
      </div>

      {/* Stats grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: '16px',
      }}>
        <StatsCard icon={Shield}   label="Total Roles"       value={roles.length}                 iconColor="#f59e0b" iconBg="rgba(245,158,11,0.15)" loading={loading} />
        <StatsCard icon={Key}      label="Total Permissions" value={permissions.length}            iconColor="#3b82f6" iconBg="rgba(59,130,246,0.15)"  loading={loading} />
        <StatsCard icon={Users}    label="My Roles"          value={user.roles?.length || 0}       iconColor="#10b981" iconBg="rgba(16,185,129,0.15)"  loading={false} />
        <StatsCard icon={Activity} label="My Permissions"    value={user.permissions?.length || 0} iconColor="#8b5cf6" iconBg="rgba(139,92,246,0.15)"  loading={false} />
      </div>

      {/* Profile + Recent Roles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isWide ? '1fr 2fr' : '1fr',
        gap: '24px',
      }}>
        {/* Profile card */}
        <div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '12px' }}>Profil Saya</p>
          <div style={{
            backgroundColor: '#121318',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                backgroundColor: 'rgba(245,158,11,0.2)',
                border: '1px solid rgba(245,158,11,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#fbbf24' }}>
                  {user.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <p style={{ fontWeight: 600, color: '#ffffff', fontSize: '14px' }}>{user.name}</p>
                <p style={{ fontSize: '12px', color: '#64748b' }}>{user.email}</p>
              </div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>Roles</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {user.roles?.length > 0
                  ? user.roles.map((r) => <Badge key={r} color="amber">{r}</Badge>)
                  : <span style={{ fontSize: '12px', color: '#475569' }}>—</span>
                }
              </div>
            </div>
            <div>
              <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>Permissions</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {user.permissions?.slice(0, 4).map((p) => <Badge key={p} color="blue">{p}</Badge>)}
                {user.permissions?.length > 4 && <Badge color="slate">+{user.permissions.length - 4}</Badge>}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Roles */}
        <div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '12px' }}>Role Terbaru</p>
          <div style={{
            backgroundColor: '#121318',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            {loading ? (
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{ height: '40px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '6px' }} />
                ))}
              </div>
            ) : roles.length === 0 ? (
              <p style={{ textAlign: 'center', fontSize: '13px', color: '#475569', padding: '40px' }}>Belum ada role</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: 600, color: '#64748b' }}>Role</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: 600, color: '#64748b' }}>Permissions</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.slice(0, 5).map((role) => (
                    <tr key={role.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <Badge color="amber">{role.name}</Badge>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {role.permissions?.slice(0, 3).map((p) => <Badge key={p} color="slate">{p}</Badge>)}
                          {role.permissions?.length > 3 && <Badge color="slate">+{role.permissions.length - 3}</Badge>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
