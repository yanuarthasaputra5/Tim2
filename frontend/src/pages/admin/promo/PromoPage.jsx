// PromoPage.jsx
import { useState, useEffect, useCallback } from 'react';
import PromoTable from '../../../components/admin/promo/PromoTable';
import PromoForm from '../../../components/admin/promo/PromoForm';
import PromoDeleteModal from '../../../components/admin/promo/PromoDeleteModal';
import { getPromos, createPromo, updatePromo, deletePromo } from '../../../services/promoService';
import { getProducts } from '../../../services/productService';

export default function PromoPage() {
  const [promos, setPromos]                   = useState([]);
  const [products, setProducts]               = useState([]);
  const [selectedPromo, setSelectedPromo]     = useState(null);
  const [promoToDelete, setPromoToDelete]     = useState(null);
  const [loading, setLoading]                 = useState(true);
  const [view, setView]                       = useState('table');

  // Fetch products for form picker
  useEffect(() => {
    getProducts({ per_page: 100 })
      .then(res => {
        const d = res.data?.data;
        setProducts(d?.data ?? d ?? []);
      })
      .catch(() => console.warn('Gagal memuat produk.'));
  }, []);

  const fetchPromos = useCallback(() => {
    setLoading(true);
    getPromos({ per_page: 100 })
      .then(res => {
        const d = res.data?.data;
        setPromos(d?.data ?? d ?? []);
      })
      .catch(() => alert('Gagal memuat promo.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchPromos(); }, [fetchPromos]);

  const handleAdd = () => {
    setSelectedPromo(null);
    setView('form');
  };

  const handleEdit = (promo) => {
    setSelectedPromo(promo);
    setView('form');
  };

  const handleBack = () => {
    setSelectedPromo(null);
    setView('table');
  };

  const handleSubmit = async (form) => {
    if (!form) {
      setSelectedPromo(null);
      setView('table');
      return;
    }
    try {
      if (selectedPromo) {
        await updatePromo(selectedPromo.id, form);
      } else {
        await createPromo(form);
      }
      setSelectedPromo(null);
      setView('table');
      fetchPromos();
    } catch (err) {
      const errors  = err.response?.data?.errors;
      const message = err.response?.data?.message;
      if (errors) {
        alert('Validasi gagal:\n' + Object.values(errors).flat().join('\n'));
      } else {
        alert(message ?? 'Gagal menyimpan promo.');
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deletePromo(promoToDelete.id);
      setPromoToDelete(null);
      fetchPromos();
    } catch {
      alert('Gagal menghapus promo.');
    }
  };

  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: '#08090c' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '24px',
        }}>
          <div>
            {view === 'form' && (
              <button
                onClick={handleBack}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  marginBottom: '10px',
                  background: 'transparent',
                  color: '#f59e0b',
                  border: '1px solid #d97706',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  letterSpacing: '0.01em',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(217,119,6,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                ← Kembali ke Daftar Promo
              </button>
            )}
            <h1 style={{
              margin: '0 0 4px',
              fontSize: '24px',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.5px',
            }}>
              {view === 'form'
                ? (selectedPromo ? 'Edit Promo' : 'Tambah Promo')
                : 'Kelola Promo'}
            </h1>
            <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
              {view === 'form'
                ? 'Isi detail promo di bawah ini'
                : 'Kelola promo dan diskon yang tersedia'}
            </p>
          </div>

          {view === 'table' && (
            <button
              onClick={handleAdd}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#1a0f00',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(217,119,6,0.35)',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              + Tambah Promo
            </button>
          )}
        </div>

        {/* ── Konten utama ── */}
        {view === 'table' ? (
          <PromoTable
            promos={promos}
            loading={loading}
            onEdit={handleEdit}
            onDelete={(promo) => setPromoToDelete(promo)}
          />
        ) : (
          <PromoForm
            promo={selectedPromo}
            onSubmit={handleSubmit}
            products={products}
          />
        )}

        <PromoDeleteModal
          promo={promoToDelete}
          onConfirm={handleDelete}
          onCancel={() => setPromoToDelete(null)}
        />
      </div>
    </div>
  );
}
