export default function PromoDeleteModal({ promo, onConfirm, onCancel }) {
  if (!promo) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          background: "#121318",
          padding: 24,
          borderRadius: 12,
          minWidth: 350,
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 700 }}>
          Hapus Promo
        </h3>

        <p style={{ margin: '0 0 6px', fontSize: '14px', color: '#94a3b8' }}>
          Yakin ingin menghapus promo:
        </p>

        <strong style={{ color: '#f59e0b' }}>{promo.name}</strong>

        <div
          style={{
            marginTop: 20,
            display: "flex",
            gap: 10,
          }}
        >
          <button
            onClick={onCancel}
            style={{
              padding: "10px 20px",
              background: "transparent",
              color: "#64748b",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "14px",
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
            onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
          >
            Batal
          </button>

          <button
            onClick={onConfirm}
            style={{
              padding: "10px 20px",
              background: "rgba(239,68,68,0.15)",
              color: "#ef4444",
              border: "1px solid rgba(239,68,68,.3)",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "14px",
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
