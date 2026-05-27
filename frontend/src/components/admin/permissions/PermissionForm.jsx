import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../../common/Button';

const schema = z.object({
  name: z.string().min(1, 'Nama permission wajib diisi').max(255),
});

const inputStyle = (hasError) => ({
  width: '100%',
  padding: '0.625rem 0.75rem',
  borderRadius: '0.5rem',
  fontSize: '0.875rem',
  color: '#e2e8f0',
  backgroundColor: 'rgba(255,255,255,0.05)',
  border: `1px solid ${hasError ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
  outline: 'none',
  transition: 'border-color 0.15s',
});

export default function PermissionForm({ onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
  });

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>Nama Permission</label>
        <input
          {...register('name')}
          type="text"
          placeholder="contoh: manage-products"
          style={inputStyle(!!errors.name)}
          onFocus={(e) => { e.target.style.borderColor = '#f59e0b'; }}
          onBlur={(e) => { e.target.style.borderColor = errors.name ? '#ef4444' : 'rgba(255,255,255,0.1)'; }}
        />
        {errors.name && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.name.message}</p>}
        <p className="text-xs mt-1.5" style={{ color: '#475569' }}>Gunakan format kebab-case, contoh: manage-users</p>
      </div>

      <div className="flex justify-end">
        <Button type="submit" loading={loading}>Buat Permission</Button>
      </div>
    </form>
  );
}
