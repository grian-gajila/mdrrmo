import { Icons } from '@/constant/icons';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const LoginForm = () => {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    router.push('/profile');
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 p-5">
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label className="block text-xs font-semibold text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={fieldCls}
        />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-700">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-orange-500 hover:text-orange-300"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <input
            type={showPass ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={fieldCls}
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
            aria-label="Toggle password"
          >
            {showPass ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={form.remember}
          onChange={(e) => setForm({ ...form, remember: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300 accent-orange-500"
        />
        <span className="text-sm text-gray-500">Remember me</span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-orange-500 text-sm font-bold text-white shadow-md shadow-orange-200 transition-all duration-300 hover:cursor-pointer hover:bg-orange-400 disabled:bg-orange-300"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in…
          </>
        ) : (
          'Sign In'
        )}
      </button>

      <div className="relative flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-100" />
        <span className="text-xs font-medium text-gray-400">
          or continue with
        </span>
        <div className="h-px flex-1 bg-gray-100" />
      </div>

      <button
        type="button"
        className="flex h-10 w-full items-center justify-center gap-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 transition-colors hover:cursor-pointer hover:bg-gray-50"
      >
        <Icons.GoogleIcon />
        Continue with Google
      </button>
    </form>
  );
};

const fieldCls =
  'w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-gray-50 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition';

export default LoginForm;
