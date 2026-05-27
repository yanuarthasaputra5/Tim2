import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import authService from '../../services/authService';
import Button from '../common/Button';

const schema = z.object({
  email:    z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
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

export default function LoginForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authService.login(data.email, data.password);
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Login berhasil');
      // Redirect berdasarkan role
      const roles = res.data.user?.roles || [];
      if (roles.includes('admin')) {
        navigate('/admin/dashboard');
      } else {
        navigate('/customer');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login gagal';
      const errors422 = err.response?.data?.errors;
      if (errors422?.email) {
        setError('email', { message: errors422.email[0] });
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-8 py-8">
      <div className="mb-7">
        <h1 className="text-xl font-bold" style={{ color: '#ffffff' }}>Masuk ke Akun</h1>
        <p className="text-sm mt-1" style={{ color: '#64748b' }}>Masukkan kredensial Anda untuk melanjutkan</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: '#94a3b8' }}>Email</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748b' }} />
            <input
              {...register('email')}
              type="email"
              placeholder="admin@example.com"
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
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748b' }} />
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              style={{ ...inputStyle(!!errors.password), paddingRight: '2.5rem' }}
              onFocus={(e) => { e.target.style.borderColor = '#f59e0b'; }}
              onBlur={(e) => { e.target.style.borderColor = errors.password ? '#ef4444' : 'rgba(255,255,255,0.1)'; }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.password.message}</p>}
        </div>

        <Button type="submit" loading={loading} className="w-full py-2.5 mt-2">
          <LogIn size={15} /> Masuk
        </Button>
      </form>

      <p className="text-center text-xs mt-6" style={{ color: '#64748b' }}>
        Belum punya akun?{' '}
        <Link to="/register" className="font-medium" style={{ color: '#fbbf24' }}>
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}
