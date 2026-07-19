// src/app/auth/reset-password/page.tsx
'use client';

import useVolunteersResetPassword from '@/hooks/use-volunteers-reset-password';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useState } from 'react';

export default function ResetPasswordPage() {
  const {
    showPass,
    setShowPass,
    isLoading,
    register,
    handleSubmit,
    errors,
    onSubmit,
  } = useVolunteersResetPassword();
  const [showConfirmField, setShowConfirmField] = useState(false);

  return (
    <div className="px-6">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">
        <Lock className="h-7 w-7 text-orange-600" />
      </div>
      <h1 className="mb-1 text-xl font-bold text-gray-900">
        Set a new password
      </h1>
      <p className="mb-6 text-sm text-gray-500">
        Choose a strong password you haven&apos;t used before.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPass ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPass ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              {...register('confirmPassword')}
              type={showConfirmField ? 'text' : 'password'}
              placeholder="Re-enter password"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmField(!showConfirmField)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirmField ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-orange-500 py-3 font-semibold text-white shadow-lg shadow-orange-200 transition-colors hover:bg-orange-600 disabled:opacity-70"
        >
          {isLoading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
