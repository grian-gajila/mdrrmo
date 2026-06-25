import { Icons } from '@/constant/icons';
import { AlertCircle, CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const RegisterForm = () => {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const strength = (() => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6)
      return { label: 'Too short', color: 'bg-red-400', pct: '25%' };
    if (p.length < 8)
      return { label: 'Weak', color: 'bg-orange-400', pct: '50%' };
    if (/[A-Z]/.test(p) && /[0-9]/.test(p))
      return { label: 'Strong', color: 'bg-green-500', pct: '100%' };
    return { label: 'Good', color: 'bg-blue-400', pct: '75%' };
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.firstName || !form.lastName || !form.email || !form.password)
      return setError('Please fill in all required fields.');
    if (form.password !== form.confirmPassword)
      return setError('Passwords do not match.');
    if (form.password.length < 8)
      return setError('Password must be at least 8 characters.');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1600));
    setLoading(false);
    router.push('/profile');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-5">
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-500">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">
            First Name <span className="text-red-400">*</span>
          </label>
          <input
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            placeholder="Juan"
            className={fieldCls}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">
            Last Name <span className="text-red-400">*</span>
          </label>
          <input
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            placeholder="dela Cruz"
            className={fieldCls}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-700">
          Email Address <span className="text-red-400">*</span>
        </label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@email.com"
          className={fieldCls}
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-700">
          Password <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <input
            type={showPass ? 'text' : 'password'}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Min. 8 characters"
            className={`${fieldCls} pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:cursor-pointer hover:text-gray-600"
            aria-label="Toggle password visibility"
          >
            {showPass ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {strength && (
          <div className="space-y-1 pt-0.5">
            <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                style={{ width: strength.pct }}
              />
            </div>
            <p className="text-xs text-gray-400">{strength.label}</p>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-700">
          Confirm Password <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <input
            type={showPass ? 'text' : 'password'}
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
            placeholder="Re-enter password"
            className={`${fieldCls} pr-10`}
          />
          {form.confirmPassword && form.password === form.confirmPassword && (
            <CheckCircle className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-green-500" />
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-1 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-orange-500 text-sm font-bold text-white shadow-md shadow-orange-200 transition-all duration-300 hover:cursor-pointer hover:bg-orange-400 disabled:bg-orange-300"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating account…
          </>
        ) : (
          'Create Account & Apply'
        )}
      </button>

      <div className="relative flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-100" />
        <span className="text-xs font-medium text-gray-400">or</span>
        <div className="h-px flex-1 bg-gray-100" />
      </div>

      <button
        type="button"
        className="flex h-10 w-full items-center justify-center gap-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 transition-colors hover:cursor-pointer hover:bg-gray-50"
      >
        <Icons.GoogleIcon />
        Sign up with Google
      </button>

      <p className="text-center text-xs leading-relaxed text-gray-400">
        By registering you agree to our{' '}
        <Link href="/terms" className="text-orange-500 hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-orange-500 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
};

const fieldCls =
  'w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-gray-50 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition';
