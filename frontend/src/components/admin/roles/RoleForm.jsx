import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import Button from '../../common/Button';

const schema = z.object({
  name:        z.string().min(1, 'Nama role wajib diisi').max(255),
  permissions: z.array(z.string()).optional(),
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

export default function RoleForm({ onSubmit, loading, defaultValues, allPermissions }) {
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', permissions: [] },
  });

  const selectedPerms = watch('permissions') || [];

  useEffect(() => {
    if (defaultValues) {
      reset({
        name: defaultValues.name || '',
        permissions: defaultValues.permissions || [],
      });
    } else {
      reset({ name: '', permissions: [] });
    }
  }, [defaultValues, reset]);

  const togglePermission = (perm) => {
    const current = selectedPerms;
    if (current.includes(perm)) {
      setValue('permissions', current.filter((p) => p !== perm));
    } else {
      setValue('permissions', [...current, perm]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name */}
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>Nama Role</label>
        <input
          {...register('name')}
          type="text"
          placeholder="contoh: editor"
          style={inputStyle(!!errors.name)}
          onFocus={(e) => { e.target.style.borderColor = '#f59e0b'; }}
          onBlur={(e) => { e.target.style.borderColor = errors.name ? '#ef4444' : 'rgba(255,255,255,0.1)'; }}
        />
        {errors.name && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.name.message}</p>}
      </div>

      {/* Permissions */}
      <div>
        <label className="block text-xs font-medium mb-2" style={{ color: '#94a3b8' }}>
          Permissions <span style={{ color: '#475569' }}>(opsional)</span>
        </label>
        {allPermissions.length === 0 ? (
          <p className="text-xs py-3" style={{ color: '#475569' }}>Belum ada permission tersedia.</p>
        ) : (
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {allPermissions.map((perm) => {
              const isSelected = selectedPerms.includes(perm);
              return (
                <label
                  key={perm}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-xs transition-colors"
                  style={{
                    border: isSelected ? '1px solid rgba(245,158,11,0.5)' : '1px solid rgba(255,255,255,0.08)',
                    backgroundColor: isSelected ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.02)',
                    color: isSelected ? '#fcd34d' : '#94a3b8',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => togglePermission(perm)}
                    style={{ accentColor: '#f59e0b' }}
                  />
                  {perm}
                </label>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {defaultValues ? 'Simpan Perubahan' : 'Buat Role'}
        </Button>
      </div>
    </form>
  );
}
