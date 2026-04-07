'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { Mail, Lock, CheckCircle2, AlertCircle, Loader } from 'lucide-react';

/**
 * Login Page - Enhanced Design
 * Modern login interface with improved visual hierarchy, icons, and UX
 */
export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main login card */}
      <div className="w-full max-w-md relative z-10">
        {/* Header section with branding */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-full">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Task Manager</h1>
          <p className="text-slate-400">Sign in to manage your tasks</p>
        </div>

        {/* Login form card */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-slate-700/70"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-2.5 bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-slate-700/70"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-blue-400 transition-colors"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 text-white py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/50 disabled:shadow-none"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-slate-600 to-transparent"></div>
            <span className="text-xs text-slate-400 font-medium">Demo Credentials</span>
            <div className="flex-1 h-px bg-gradient-to-l from-slate-600 to-transparent"></div>
          </div>

          {/* Demo credentials */}
          <div className="space-y-3">
            {/* Admin credential */}
            <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-3 hover:bg-slate-700/50 transition-colors">
              <p className="text-xs text-slate-400 font-medium">Admin Account</p>
              <p className="text-sm text-slate-200 font-mono">admin@example.com</p>
              <p className="text-xs text-slate-400 font-mono">admin123</p>
            </div>

            {/* User credential */}
            <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-3 hover:bg-slate-700/50 transition-colors">
              <p className="text-xs text-slate-400 font-medium">User Account</p>
              <p className="text-sm text-slate-200 font-mono">user@example.com</p>
              <p className="text-xs text-slate-400 font-mono">user123</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-slate-500 text-xs mt-6">
          Role-based Task Management System with Audit Logging
        </p>
      </div>
    </div>
  );
}
