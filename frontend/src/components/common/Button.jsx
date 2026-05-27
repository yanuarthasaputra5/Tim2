import { Loader2 } from 'lucide-react';

const variantStyles = {
  primary: {
    backgroundColor: '#f59e0b',
    color: '#000000',
    border: '1px solid #f59e0b',
    fontWeight: '700',
    boxShadow: '0 4px 14px rgba(245,158,11,0.25)',
  },
  danger: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: '1px solid #ef4444',
    fontWeight: '600',
  },
  ghost: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: '#cbd5e1',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  outline: {
    backgroundColor: 'transparent',
    color: '#f59e0b',
    border: '1px solid rgba(245,158,11,0.5)',
  },
};

const variantHover = {
  primary: { backgroundColor: '#d97706', border: '1px solid #d97706' },
  danger:  { backgroundColor: '#dc2626', border: '1px solid #dc2626' },
  ghost:   { backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' },
  outline: { backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid #f59e0b' },
};

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  style = {},
  onClick,
}) {
  const base = variantStyles[variant] || variantStyles.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{ ...base, ...style }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          const h = variantHover[variant];
          if (h) Object.assign(e.currentTarget.style, h);
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          Object.assign(e.currentTarget.style, base, style);
        }
      }}
    >
      {loading && <Loader2 size={15} className="animate-spin" />}
      {children}
    </button>
  );
}
