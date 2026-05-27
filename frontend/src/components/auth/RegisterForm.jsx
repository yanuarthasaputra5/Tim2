import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import authService from '../../services/authService';
import Button from '../common/Button';

const schema = z.object({
  name:                  z.string().min(1, 'Nama wajib diisi').max(255),
  email:                 z.string().email('Email tidak valid').max(255),
  password:              z.string().min(8, 'Password minimal 8 karakter'),
  password_confirmation: z.string(),
}).refine((d) => d.password === d.password_confirmation, {
  message: 'Konfirmasi password tidak cocok',
  path: ['password_confirmation'],
});

const inputStyle = (hasError) => ({
  width: '100%',
  paddingLeft: '2.25rem',
  paddingRight: '1rem',
  paddingTop: '0.625rem',
  paddingBottom: '0.625rem',
  borderRadius: '0.5rem',
  fontSize: '0.875rem',
  color: '#e2e8f0',
  backgroundColor: 'rgba(255,255,255,0.05)',
  border: `1px solid ${hasError ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
  outline: 'none',
  transition: 'border-color 0.15s',
});

function PasswordInput({ register: reg, name, placeholder, error, errors }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748b' }} />
      <input
        {...reg(name)}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        style={{ ...inputStyle(!!error), paddingRight: '2.5rem' }}
        onFocus={(e) => { e.target.style.borderColor = '#f59e0b'; }}
        onBlur={(e) => { e.target.style.borderColor = error ? '#ef4444' : 'rgba(255,255,255,0.1)'; }}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2"
        style={{ color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

export default function RegisterForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authService.register(data);
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Registrasi berhasil');
      // Register selalu jadi role user → redirect ke customer
      navigate('/customer');
    } catch (err) {
      const errors422 = err.response?.data?.errors;
      if (errors422) {
        Object.entries(errors422).forEach(([field, msgs]) => {
          setError(field, { message: msgs[0] });
        });
      } else {
        toast.error(err.response?.data?.message || 'Registrasi gagal');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-8 py-8">
      <div className="mb-7">
        <h1 className="text-xl font-bold" style={{ color: '#ffffff' }}>Buat Akun Baru</h1>
        <p className="text-sm mt-1" style={{ color: '#64748b' }}>Isi data di bawah untuk mendaftar</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>Nama Lengkap</label>
          <div className="relative">
            <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748b' }} />
            <input
              {...register('name')}
              type="text"
              placeholder="John Doe"
              style={inputStyle(!!errors.name)}
              onFocus={(e) => { e.target.style.borderColor = '#f59e0b'; }}
              onBlur={(e) => { e.target.style.borderColor = errors.name ? '#ef4444' : 'rgba(255,255,255,0.1)'; }}
            />
          </div>
          {errors.name && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>Email</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748b' }} />
            <input
              {...register('email')}
              type="email"
              placeholder="john@example.com"
              style={inputStyle(!!errors.email)}
              onFocus={(e) => { e.target.style.borderColor = '#f59e0b'; }}
              onBlur={(e) => { e.target.style.borderColor = errors.email ? '#ef4444' : 'rgba(255,255,255,0.1)'; }}
            />
          </div>
          {errors.email && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>Password</label>
          <PasswordInput register={register} name="password" placeholder="Min. 8 karakter" error={errors.password} />
          {errors.password && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>Konfirmasi Password</label>
          <PasswordInput register={register} name="password_confirmation" placeholder="Ulangi password" error={errors.password_confirmation} />
          {errors.password_confirmation && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.password_confirmation.message}</p>}
        </div>

        <Button type="submit" loading={loading} className="w-full py-2.5 mt-2">
          <UserPlus size={15} /> Daftar
        </Button>
      </form>

      <p className="text-center text-xs mt-6" style={{ color: '#64748b' }}>
        Sudah punya akun?{' '}
        <Link to="/login" className="font-medium" style={{ color: '#fbbf24' }}>
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
