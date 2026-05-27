import { Shield } from 'lucide-react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 16px',
      backgroundColor: '#08090c',
      backgroundImage: `
        radial-gradient(at 0% 0%, rgba(245,158,11,0.08) 0px, transparent 60%),
        radial-gradient(at 100% 100%, rgba(255,152,0,0.06) 0px, transparent 60%)
      `,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          backgroundColor: 'rgba(245,158,11,0.2)',
          border: '1px solid rgba(245,158,11,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Shield size={18} style={{ color: '#fbbf24' }} />
        </div>
        <span style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.5px' }}>
          SIBER <span style={{ color: '#f59e0b' }}>Panel</span>
        </span>
      </div>

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: '440px',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: '#121318',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
      }}>
        <Outlet />
      </div>

      {/* Footer */}
      <p style={{ marginTop: '24px', fontSize: '12px', color: '#334155' }}>
        &copy; {new Date().getFullYear()} SIBER. All rights reserved.
      </p>
    </div>
  );
}
