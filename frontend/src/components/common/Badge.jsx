const colorStyles = {
  amber: {
    backgroundColor: 'rgba(245,158,11,0.15)',
    color: '#fbbf24',
    border: '1px solid rgba(245,158,11,0.3)',
  },
  blue: {
    backgroundColor: 'rgba(59,130,246,0.15)',
    color: '#60a5fa',
    border: '1px solid rgba(59,130,246,0.3)',
  },
  green: {
    backgroundColor: 'rgba(16,185,129,0.15)',
    color: '#34d399',
    border: '1px solid rgba(16,185,129,0.3)',
  },
  red: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    color: '#f87171',
    border: '1px solid rgba(239,68,68,0.3)',
  },
  purple: {
    backgroundColor: 'rgba(139,92,246,0.15)',
    color: '#a78bfa',
    border: '1px solid rgba(139,92,246,0.3)',
  },
  slate: {
    backgroundColor: 'rgba(100,116,139,0.15)',
    color: '#94a3b8',
    border: '1px solid rgba(100,116,139,0.3)',
  },
};

export default function Badge({ children, color = 'amber', className = '', style = {} }) {
  const colorStyle = colorStyles[color] || colorStyles.amber;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={{ ...colorStyle, ...style }}
    >
      {children}
    </span>
  );
}
