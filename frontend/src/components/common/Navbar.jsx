import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, ChevronDown, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';
import authService from '../../services/authService';

export default function AdminNavbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    try { await authService.logout(); } catch (_) {}
    localStorage.clear();
    toast.success('Logout berhasil');
    navigate('/login');
  };

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      height: '64px',
      display: 'flex', alignItems: 'center', padding: '0 16px', gap: '16px',
      backgroundColor: 'rgba(8,9,12,0.97)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      {/* Hamburger */}
      <button
        onClick={onToggleSidebar}
        style={{
          padding: '8px', borderRadius: '8px', background: 'none',
          border: 'none', cursor: 'pointer', color: '#94a3b8',
          display: 'flex', alignItems: 'center',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
      >
        <Menu size={20} />
      </button>

      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Shield size={18} style={{ color: '#f59e0b' }} />
        <span style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '0.5px', color: '#ffffff' }}>
          SIBER <span style={{ color: '#f59e0b' }}>Admin</span>
        </span>
      </div>

      <div style={{ flex: 1 }} />

      {/* User dropdown */}
      <div style={{ position: 'relative' }} ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '6px 12px', borderRadius: '8px',
            background: 'none', border: 'none', cursor: 'pointer',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          {/* Avatar */}
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            backgroundColor: 'rgba(245,158,11,0.2)',
            border: '1px solid rgba(245,158,11,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#fbbf24' }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          {/* Name + role */}
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', lineHeight: 1 }}>
              {user?.name || 'User'}
            </p>
            <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              {user?.roles?.[0] || 'user'}
            </p>
          </div>
          <ChevronDown size={14} style={{ color: '#64748b' }} />
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div style={{
            position: 'absolute', right: 0, top: 'calc(100% + 8px)',
            width: '220px', borderRadius: '12px',
            backgroundColor: '#121318',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            zIndex: 100,
            overflow: 'hidden',
          }}>
            {/* User info */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>{user?.name}</p>
              <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                {user?.roles?.map((r) => (
                  <span key={r} style={{
                    fontSize: '11px', padding: '2px 8px', borderRadius: '20px',
                    backgroundColor: 'rgba(245,158,11,0.15)',
                    color: '#fbbf24',
                    border: '1px solid rgba(245,158,11,0.3)',
                  }}>{r}</span>
                ))}
              </div>
            </div>
            {/* Logout */}
            <button
              onClick={() => { setDropdownOpen(false); handleLogout(); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 16px', fontSize: '13px', color: '#cbd5e1',
                background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#cbd5e1'; }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
