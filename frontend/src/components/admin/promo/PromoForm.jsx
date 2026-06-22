// PromoForm.jsx
import { useState, useEffect } from "react";

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  background: "#0a0b0f",
  border: "1px solid rgba(212,175,55,0.15)",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "14px",
  boxSizing: "border-box",
  outline: "none",
};

const labelStyle = {
  display: "block",
  color: "#94a3b8",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  marginBottom: "6px",
};

const empty = {
  name: "",
  type: "percent",
  value: "",
  starts_at: "",
  ends_at: "",
  is_active: true,
  product_ids: [],
};

const formatDateForInput = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 16);
};

export default function PromoForm({ promo, onSubmit, products = [], categories = [] }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (promo) {
      setForm({
        name:         promo.name         || "",
        type:         promo.type         || "percent",
        value:        promo.value        ?? "",
        starts_at:    formatDateForInput(promo.starts_at),
        ends_at:      formatDateForInput(promo.ends_at),
        is_active:    promo.is_active    ?? true,
        product_ids:  (promo.products || []).map(p => p.id),
      });
    } else {
      setForm(empty);
    }
  }, [promo]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name:       form.name,
      type:       form.type,
      value:      Number(form.value),
      starts_at:  form.starts_at,
      ends_at:    form.ends_at,
      is_active:  form.is_active,
      product_ids: form.product_ids,
    };

    onSubmit(payload);
    if (!promo) setForm(empty);
  };

  const isValid = form.name.trim() && form.value && form.starts_at && form.ends_at && form.product_ids.length > 0;

  const toggleArrayItem = (field, id) => {
    setForm((prev) => {
      const arr = prev[field];
      return {
        ...prev,
        [field]: arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id],
      };
    });
  };

  return (
    <div style={{
      background: "#111215",
      border: "1px solid rgba(212,175,55,.15)",
      borderRadius: "10px",
      padding: "28px",
      marginBottom: "24px",
    }}>

      <form onSubmit={handleSubmit}>

        {/* Row 1: Nama + Tipe + Nilai */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 180px", gap: "16px", marginBottom: "16px" }}>

          {/* Nama */}
          <div>
            <label style={labelStyle}>
              Nama Promo / Diskon <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Diskon Akhir Tahun"
              value={form.name}
              style={inputStyle}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          {/* Tipe */}
          <div>
            <label style={labelStyle}>
              Tipe Diskon <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <select
              value={form.type}
              style={inputStyle}
              onChange={(e) => handleChange("type", e.target.value)}
            >
              <option value="percent">Persen (%)</option>
              <option value="fixed">Nominal Tetap (Rp)</option>
            </select>
          </div>

          {/* Nilai */}
          <div>
            <label style={labelStyle}>
              Nilai Diskon <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              step="any"
              placeholder={form.type === 'percent' ? "20" : "50000"}
              value={form.value}
              style={inputStyle}
              onChange={(e) => handleChange("value", e.target.value)}
            />
          </div>
        </div>

        {/* Row 2: Tanggal Mulai + Tanggal Berakhir + Status */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 140px", gap: "16px", marginBottom: "16px" }}>

          {/* Tanggal Mulai */}
          <div>
            <label style={labelStyle}>
              Tanggal Mulai <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="datetime-local"
              required
              value={form.starts_at}
              style={inputStyle}
              onChange={(e) => handleChange("starts_at", e.target.value)}
            />
          </div>

          {/* Tanggal Berakhir */}
          <div>
            <label style={labelStyle}>
              Tanggal Berakhir <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="datetime-local"
              required
              value={form.ends_at}
              style={inputStyle}
              onChange={(e) => handleChange("ends_at", e.target.value)}
            />
          </div>

          {/* Status */}
          <div>
            <label style={labelStyle}>Status</label>
            <select
              value={form.is_active ? "1" : "0"}
              style={inputStyle}
              onChange={(e) => handleChange("is_active", e.target.value === "1")}
            >
              <option value="1">Aktif</option>
              <option value="0">Nonaktif</option>
            </select>
          </div>
        </div>

        {/* Product Picker (Selalu Muncul) */}
        {products.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
              <label style={labelStyle}>Pilih Produk yang Didiskon <span style={{ color: "#ef4444" }}>*</span> <span style={{ color: "#475569", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(pilih minimal satu)</span></label>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, product_ids: products.map(p => p.id) }))}
                  style={{
                    padding: "3px 10px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "1px solid rgba(16,185,129,0.3)",
                    background: "rgba(16,185,129,0.1)",
                    color: "#4ade80",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(16,185,129,0.2)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(16,185,129,0.1)"}
                >
                  Pilih Semua
                </button>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, product_ids: [] }))}
                  style={{
                    padding: "3px 10px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "1px solid rgba(239,68,68,0.3)",
                    background: "rgba(239,68,68,0.1)",
                    color: "#f87171",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.2)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                >
                  Hapus Semua
                </button>
              </div>
            </div>
            <div style={{
              display: "flex", flexWrap: "wrap", gap: "8px",
              padding: "12px",
              background: "#0a0b0f",
              border: "1px solid rgba(212,175,55,0.15)",
              borderRadius: "8px",
              maxHeight: "160px",
              overflowY: "auto",
            }}>
              {products.map(p => {
                const selected = form.product_ids.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleArrayItem('product_ids', p.id)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      border: selected
                        ? "1px solid rgba(245,158,11,0.4)"
                        : "1px solid rgba(255,255,255,0.1)",
                      background: selected
                        ? "rgba(245,158,11,0.15)"
                        : "rgba(255,255,255,0.03)",
                      color: selected ? "#f59e0b" : "#94a3b8",
                      transition: "all 0.15s",
                    }}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
          <button
            type="submit"
            disabled={!isValid}
            style={{
              padding: "10px 22px",
              background: !isValid
                ? "rgba(212,175,55,.25)"
                : "linear-gradient(135deg, #f59e0b, #d97706)",
              color: !isValid ? "#64748b" : "#1a0f00",
              border: "none",
              borderRadius: "8px",
              cursor: !isValid ? "not-allowed" : "pointer",
              fontWeight: 700,
              fontSize: "14px",
              letterSpacing: "0.01em",
            }}
          >
            {promo ? "Update Promo" : "Simpan Promo"}
          </button>

          <button
            type="button"
            onClick={() => onSubmit(null)}
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
            onMouseEnter={e => e.currentTarget.style.color = "#94a3b8"}
            onMouseLeave={e => e.currentTarget.style.color = "#64748b"}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
