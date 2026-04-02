

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { HiEye, HiEyeOff } from 'react-icons/hi'; // react-icons for eye icon

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // <- toggle state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      router.push('/admin');
    } else {
      setError(result.error || 'Invalid credentials');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-black dark:bg-brand-grey-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-accent">Growth Valley</h1>
          <p className="text-brand-grey-400 text-center mt-2">Admin Portal</p>
        </div>

        {/* Login form */}
        <form
          onSubmit={handleSubmit}
          className="bg-brand-grey-900 dark:bg-brand-grey-900 p-8 rounded-lg border border-brand-grey-800 dark:border-brand-grey-700"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Sign In</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500 dark:border-red-400 text-red-500 dark:text-red-400 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-brand-grey-300 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-brand-black dark:bg-brand-grey-800 border border-brand-grey-700 dark:border-brand-grey-600 rounded-lg text-white placeholder-brand-grey-500 focus:outline-none focus:border-accent transition-colors"
                placeholder="admin@growthvalley.com"
              />
            </div>

            {/* Password with Eye Toggle */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-brand-grey-300 mb-2"
              >
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pr-12 bg-brand-black dark:bg-brand-grey-800 border border-brand-grey-700 dark:border-brand-grey-600 rounded-lg text-white placeholder-brand-grey-500 focus:outline-none focus:border-accent transition-colors"
                placeholder="••••••••"
              />
              <div className="absolute top-7 bottom-0 right-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex items-center justify-center text-brand-grey-400 hover:text-accent h-full"
                >
                  {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 px-6 py-3 bg-accent text-brand-black font-semibold rounded-lg hover:bg-accent-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-brand-grey-500 text-sm mt-6">
            <a href="/" className="text-accent hover:underline">
              ← Back to website
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}