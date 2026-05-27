const colorMap = {
  amber: {
    iconBg:    'rgba(245,158,11,0.1)',
    iconColor: '#fbbf24',
    valColor:  '#fbbf24',
    border:    'rgba(245,158,11,0.2)',
  },
  blue: {
    iconBg:    'rgba(59,130,246,0.1)',
    iconColor: '#60a5fa',
    valColor:  '#60a5fa',
    border:    'rgba(59,130,246,0.2)',
  },
  green: {
    iconBg:    'rgba(16,185,129,0.1)',
    iconColor: '#34d399',
    valColor:  '#34d399',
    border:    'rgba(16,185,129,0.2)',
  },
  purple: {
    iconBg:    'rgba(139,92,246,0.1)',
    iconColor: '#a78bfa',
    valColor:  '#a78bfa',
    border:    'rgba(139,92,246,0.2)',
  },
};

export default function StatsCard({ icon: Icon, label, value, color = 'amber', loading = false }) {
  const c = colorMap[color] || colorMap.amber;

  return (
    <div
      className="rounded-xl p-5 flex items-center gap-4"
      style={{
        backgroundColor: '#121318',
        border: `1px solid ${c.border}`,
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: c.iconBg }}
      >
        <Icon size={22} style={{ color: c.iconColor }} />
      </div>
      <div>
        <p className="text-xs font-medium" style={{ color: '#64748b' }}>{label}</p>
        {loading ? (
          <div className="h-7 w-12 rounded animate-pulse mt-1" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
        ) : (
          <p className="text-2xl font-bold mt-0.5" style={{ color: c.valColor }}>{value}</p>
        )}
      </div>
    </div>
  );
}
