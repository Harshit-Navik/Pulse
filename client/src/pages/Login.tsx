import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, loading: authLoading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div
          className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin"
          role="status"
          aria-label="Checking session"
        />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden min-w-0">
      {/* Left Side - Brand/Image */}
      <div className="hidden md:flex md:w-1/2 bg-surface-low relative items-center justify-center p-24 overflow-hidden">
        <div className="absolute inset-0 kinetic-grid opacity-30"></div>
        <div className="absolute inset-0 kinetic-grain"></div>

        <div className="relative z-10 space-y-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img src="/images/logo.svg" alt="App Logo" className="h-14 lg:h-20 w-auto object-contain mb-6 drop-shadow-xl" />
            <p className="text-xl tracking-[0.6em] uppercase text-on-surface-variant font-black lg:pl-1">Performance Ritual</p>
          </motion.div>

          <div className="space-y-6 max-w-md">
            <p className="text-on-surface text-lg font-light leading-relaxed">
              "The difference between the elite and the average is the quality of their rituals."
            </p>
            <div className="w-12 h-1 bg-primary"></div>
          </div>
        </div>

        {/* Background Image Overlay */}
        <div className="absolute inset-0 -z-10 opacity-10">
          <img
            src="https://picsum.photos/seed/monolith/1200/1200?grayscale"
            alt="Monolith"
            className="w-full h-full object-cover contrast-150 brightness-50"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-5 sm:p-8 md:p-24 relative min-w-0">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md space-y-12"
        >
          <div className="space-y-4">
            <h2 className="font-headline text-3xl sm:text-4xl font-black uppercase italic tracking-tighter text-on-surface">Welcome Back</h2>
            <p className="text-on-surface-variant text-sm font-light">Enter your credentials to access the Monolith.</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-900/20 border border-red-500/50 text-red-500 text-xs font-black uppercase tracking-widest"
            >
              System Error: {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="login-email" className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Email Address</label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="athlete@monolith.com"
                className="w-full bg-surface-container border border-outline px-6 py-5 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-on-surface-variant/20"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="login-password" className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Password</label>
                <a href="#" className="text-[9px] font-black text-primary uppercase tracking-widest hover:text-on-surface transition-colors">Forgot?</a>
              </div>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-surface-container border border-outline px-6 py-5 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-on-surface-variant/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-primary text-on-primary font-black text-[10px] uppercase tracking-[0.4em] hover:brightness-110 transition-all active:scale-[0.98] shadow-2xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : (
                'Continue'
              )}
            </button>
          </form>

          {/* <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline"></div>
            </div>
            <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.4em]">
              <span className="bg-background px-4 text-on-surface-variant">Or Connect With</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button className="flex items-center justify-center gap-3 py-4 border border-outline hover:bg-surface-container transition-all group">
              <Chrome className="w-4 h-4 text-on-surface-variant group-hover:text-on-surface transition-colors" />
              <span className="text-[9px] font-black uppercase tracking-widest">Google</span>
            </button>
          </div> */}

          <p className="text-center text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
            New to the ritual? <Link to="/register" className="text-primary hover:text-on-surface transition-colors">Create an Account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
