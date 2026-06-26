// PromoTable.jsx
export default function PromoTable({ promos, loading, onEdit, onDelete }) {

  const typeLabel = (type) => {
    switch (type) {
      case 'percent':       return 'Persen';
      case 'fixed':         return 'Nominal';
      case 'free_shipping': return 'Gratis Ongkir';
      default:              return type;
    }
  };

  const formatValue = (promo) => {
    if (promo.type === 'percent') return `${Number(promo.value)}%`;
    if (promo.type === 'fixed') return `Rp ${Number(promo.value).toLocaleString('id-ID')}`;
    return '—';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  // Aktif/Nonaktif murni dari is_active (di-set manual lewat form/toggle).
  // Tanggal TIDAK ikut menentukan badge ini — itu cuma info tambahan (lihat getDateStatus).
  const isPromoActive = (promo) => Boolean(promo.is_active);

  // Badge info tanggal: otomatis "Kedaluwarsa" jika ends_at sudah lewat
  const getDateStatus = (promo) => {
    const now = new Date();
    if (promo.ends_at && new Date(promo.ends_at) < now) return 'expired';
    if (promo.starts_at && new Date(promo.starts_at) > now) return 'upcoming';
    return 'ongoing';
  };

  if (loading) {
    return (
      <div style={{
        background: '#121318',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
            Daftar Promo
          </h2>
        </div>
        <div style={{ padding: '60px 24px', textAlign: 'center' }}>
          <div style={{
            width: 32, height: 32, margin: '0 auto',
            border: '3px solid rgba(255,255,255,0.07)',
            borderTop: '3px solid #f59e0b',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: '#121318',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
          Daftar Promo
        </h2>
        <span style={{
          fontSize: '12px', color: '#64748b',
          background: 'rgba(255,255,255,0.05)',
          padding: '4px 10px', borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          {promos.length} promo
        </span>
      </div>

      {promos.length === 0 ? (
        <div style={{ padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>🏷️</div>
          <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Belum ada promo</p>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#475569' }}>
            Tambahkan promo menggunakan tombol di atas
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Nama', 'Tipe', 'Nilai', 'Periode', 'Produk', 'Status', 'Aksi'].map((h) => (
                  <th key={h} style={{
                    padding: '12px 16px',
                    textAlign: h === 'Aksi' ? 'center' : 'left',
                    fontSize: '12px', fontWeight: 600, color: '#64748b',
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                    background: 'rgba(255,255,255,0.02)',
                    whiteSpace: 'nowrap',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {promos.map((promo, idx) => {
                const active     = isPromoActive(promo);
                const dateStatus = getDateStatus(promo);

                return (
                  <tr
                    key={promo.id}
                    style={{
                      borderBottom: idx < promos.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Nama */}
                    <td style={{ padding: '13px 16px', color: '#e2e8f0', fontSize: 14, fontWeight: 500 }}>
                      {promo.name || '—'}
                    </td>

                    {/* Tipe */}
                    <td style={{ padding: '13px 16px', color: '#94a3b8', fontSize: 13 }}>
                      {typeLabel(promo.type)}
                    </td>

                    {/* Nilai */}
                    <td style={{ padding: '13px 16px', color: '#f59e0b', fontSize: 14, fontWeight: 600 }}>
                      {formatValue(promo)}
                    </td>

                    {/* Periode */}
                    <td style={{ padding: '13px 16px', fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                      {formatDate(promo.starts_at)} — {formatDate(promo.ends_at)}
                    </td>

                    {/* Produk */}
                    <td style={{ padding: '13px 16px', fontSize: 13, color: '#94a3b8', maxWidth: 200 }}>
                      {promo.products?.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {promo.products.slice(0, 3).map(p => (
                            <span key={p.id} style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: 11,
                              fontWeight: 500,
                              background: 'rgba(245,158,11,0.08)',
                              border: '1px solid rgba(245,158,11,0.15)',
                              color: '#f59e0b',
                              whiteSpace: 'nowrap',
                            }}>
                              {p.name}
                            </span>
                          ))}
                          {promo.products.length > 3 && (
                            <span style={{ fontSize: 11, color: '#64748b', padding: '2px 4px' }}>
                              +{promo.products.length - 3} lainnya
                            </span>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: '#64748b', fontStyle: 'italic', fontSize: 12 }}>—</span>
                      )}
                    </td>

                    {/* Status — berdasarkan is_active saja + badge tanggal terpisah */}
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {/* Badge is_active */}
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          padding: '3px 10px',
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 600,
                          background: active ? 'rgba(16,185,129,.1)' : 'rgba(239,68,68,.1)',
                          border: `1px solid ${active ? 'rgba(16,185,129,.2)' : 'rgba(239,68,68,.2)'}`,
                          color: active ? '#10b981' : '#ef4444',
                          width: 'fit-content',
                        }}>
                          <span style={{
                            width: 5, height: 5, borderRadius: '50%',
                            background: active ? '#10b981' : '#ef4444',
                            flexShrink: 0,
                          }} />
                          {active ? 'Aktif' : 'Nonaktif'}
                        </span>

                        {/* Badge tanggal — hanya info tambahan, cuma tampil saat status Nonaktif */}
                        {!active && dateStatus === 'expired' && (
                          <span style={{
                            fontSize: 10, fontWeight: 600,
                            color: '#94a3b8',
                            letterSpacing: '0.03em',
                          }}>
                            Kedaluwarsa
                          </span>
                        )}
                        {!active && dateStatus === 'upcoming' && (
                          <span style={{
                            fontSize: 10, fontWeight: 600,
                            color: '#60a5fa',
                            letterSpacing: '0.03em',
                          }}>
                            Belum Mulai
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Aksi */}
                    <td style={{ padding: '13px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button onClick={() => onEdit(promo)} style={{
                          padding: '6px 14px',
                          background: 'rgba(59,130,246,0.1)',
                          border: '1px solid rgba(59,130,246,0.3)',
                          borderRadius: '6px', color: '#60a5fa',
                          fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                        }}
                          onMouseEnter={e => e.target.style.background = 'rgba(59,130,246,0.2)'}
                          onMouseLeave={e => e.target.style.background = 'rgba(59,130,246,0.1)'}
                        >Edit</button>
                        <button onClick={() => onDelete(promo)} style={{
                          padding: '6px 14px',
                          background: 'rgba(239,68,68,0.1)',
                          border: '1px solid rgba(239,68,68,0.3)',
                          borderRadius: '6px', color: '#f87171',
                          fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                        }}
                          onMouseEnter={e => e.target.style.background = 'rgba(239,68,68,0.2)'}
                          onMouseLeave={e => e.target.style.background = 'rgba(239,68,68,0.1)'}
                        >Hapus</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}