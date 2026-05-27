import { Sparkles } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

export default function ComingSoonModal({ isOpen, onClose, feature }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Segera Hadir">
      <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          backgroundColor: 'rgba(245,158,11,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <Sparkles size={28} style={{ color: '#f59e0b' }} />
        </div>
        <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
          Fitur {feature} Segera Hadir
        </h3>
        <p style={{ fontSize: '13px', color: '#94a3b8', maxWidth: '320px', margin: '0 auto 24px' }}>
          Kami sedang menyiapkan fitur ini untuk Anda. Pantau terus update kami!
        </p>
        <Button onClick={onClose}>Mengerti</Button>
      </div>
    </Modal>
  );
}
