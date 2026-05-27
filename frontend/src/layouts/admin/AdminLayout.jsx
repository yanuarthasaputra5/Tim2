import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#08090c' }}>
      <AdminNavbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isDesktop={isDesktop} />

      <main style={{
        paddingTop: '64px',
        paddingLeft: isDesktop ? '256px' : '0',
        minHeight: '100vh',
        transition: 'padding-left 0.3s',
      }}>
        <div style={{ padding: '24px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
