import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register, loading: authLoading, isAuthenticated } = useAuth();
  const [name, setName] = useState('');
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
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
            <p className="text-xl tracking-[0.6em] uppercase text-on-surface-variant font-black lg:pl-1">Begin Your Ritual</p>
          </motion.div>

          <div className="space-y-6 max-w-md">
            <p className="text-on-surface text-lg font-light leading-relaxed">
              "Every great transformation begins with a single decision to change."
            </p>
            <div className="w-12 h-1 bg-primary"></div>
          </div>
        </div>

        <div className="absolute inset-0 -z-10 opacity-10">
          <img
            src="https://picsum.photos/seed/register/1200/1200?grayscale"
            alt="Register"
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
            <h2 className="font-headline text-3xl sm:text-4xl font-black uppercase italic tracking-tighter text-on-surface">Create Account</h2>
            <p className="text-on-surface-variant text-sm font-light">Join the Monolith. Begin your performance ritual.</p>
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

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="register-name" className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Full Name</label>
              <input
                id="register-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alexander Thorne"
                className="w-full bg-surface-container border border-outline px-6 py-5 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-on-surface-variant/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="register-email" className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Email Address</label>
              <input
                id="register-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="athlete@monolith.com"
                className="w-full bg-surface-container border border-outline px-6 py-5 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-on-surface-variant/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="register-password" className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Password</label>
              <input
                id="register-password"
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
                  Creating Account...
                </>
              ) : (
                'Create Account'
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
            Already a member? <Link to="/login" className="text-primary hover:text-on-surface transition-colors">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
