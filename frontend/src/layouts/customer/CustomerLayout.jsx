import { Outlet } from 'react-router-dom';
import '../../styles/landing.css';
import CustomerNavbar from './CustomerNavbar';
import Footer from '../Footer';

export default function CustomerLayout() {
  const scrollToId = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#08090c', display: 'flex', flexDirection: 'column' }}>
      <CustomerNavbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer scrollToId={scrollToId} />
    </div>
  );
}
