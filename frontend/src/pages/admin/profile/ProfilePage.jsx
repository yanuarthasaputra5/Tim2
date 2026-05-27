import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { User, Mail, Calendar, Shield, Key } from 'lucide-react';
import authService from '../../../services/authService';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import Badge from '../../../components/common/Badge';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getProfile()
      .then((res) => setProfile(res.data))
      .catch(() => toast.error('Gagal memuat profil'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '672px' }}>
      <div>
        <h1 className="text-xl font-bold" style={{ color: '#ffffff' }}>Profil Saya</h1>
        <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>Informasi akun Anda</p>
      </div>

      {profile && (
        <div
          className="rounded-xl overflow-hidden"
          style={{
            backgroundColor: '#121318',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Avatar header */}
          <div
            className="px-6 py-8 flex items-center gap-5"
            style={{
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, transparent 60%)',
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: 'rgba(245,158,11,0.2)',
                border: '2px solid rgba(245,158,11,0.4)',
              }}
            >
              <span className="text-2xl font-bold" style={{ color: '#fbbf24' }}>
                {profile.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: '#ffffff' }}>{profile.name}</h2>
              <p className="text-sm" style={{ color: '#64748b' }}>{profile.email}</p>
              <div className="flex gap-1.5 mt-2">
                {profile.roles?.map((r) => <Badge key={r} color="amber">{r}</Badge>)}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="px-6 py-5 space-y-4">
            <InfoRow icon={User}     label="Nama"      value={profile.name} />
            <InfoRow icon={Mail}     label="Email"     value={profile.email} />
            <InfoRow
              icon={Calendar}
              label="Bergabung"
              value={new Date(profile.created_at).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            />

            <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-start gap-3">
                <Shield size={15} className="mt-0.5 flex-shrink-0" style={{ color: '#64748b' }} />
                <div>
                  <p className="text-xs mb-2" style={{ color: '#64748b' }}>Roles</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.roles?.length > 0
                      ? profile.roles.map((r) => <Badge key={r} color="amber">{r}</Badge>)
                      : <span className="text-xs" style={{ color: '#334155' }}>Tidak ada role</span>
                    }
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-start gap-3">
                <Key size={15} className="mt-0.5 flex-shrink-0" style={{ color: '#64748b' }} />
                <div>
                  <p className="text-xs mb-2" style={{ color: '#64748b' }}>Permissions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.permissions?.length > 0
                      ? profile.permissions.map((p) => <Badge key={p} color="blue">{p}</Badge>)
                      : <span className="text-xs" style={{ color: '#334155' }}>Tidak ada permission</span>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={15} className="flex-shrink-0" style={{ color: '#64748b' }} />
      <div className="flex-1 flex items-center justify-between">
        <span className="text-xs" style={{ color: '#64748b' }}>{label}</span>
        <span className="text-sm" style={{ color: '#e2e8f0' }}>{value}</span>
      </div>
    </div>
  );
}
