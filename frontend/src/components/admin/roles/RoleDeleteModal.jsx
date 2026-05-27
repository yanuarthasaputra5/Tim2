import Modal from '../../common/Modal';
import Button from '../../common/Button';

export default function RoleDeleteModal({ isOpen, onClose, onConfirm, role, loading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hapus Role">
      <p className="text-sm text-slate-400 mb-1">
        Apakah Anda yakin ingin menghapus role{' '}
        <span className="font-semibold text-white">"{role?.name}"</span>?
      </p>
      <p className="text-xs text-slate-600 mb-6">Tindakan ini tidak dapat dibatalkan.</p>
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose} disabled={loading}>Batal</Button>
        <Button variant="danger" loading={loading} onClick={onConfirm}>Ya, Hapus</Button>
      </div>
    </Modal>
  );
}
