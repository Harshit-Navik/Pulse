import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LayoutDashboard, UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { label: 'Home', href: '/', active: false },
  { label: 'Features', href: '/#features', active: false },
  { label: 'Products', href: '/products', active: false },
  { label: 'Pricing', href: '/#pricing', active: false },
  { label: 'FAQs', href: '/#faqs', active: false },
  { label: 'Contact', href: '/#contact', active: false },
];

function displayName(user: { name?: string; email?: string } | null): string {
  if (!user) return 'User';
  const n = user.name?.trim();
  if (n) return n;
  const e = user.email?.trim();
  if (e) return e.split('@')[0] ?? 'User';
  return 'User';
}

function initialsFromUser(user: { name?: string; email?: string } | null): string {
  if (!user) return '?';
  const n = user.name?.trim();
  if (n) {
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  const e = user.email?.trim();
  if (e) return e.slice(0, 2).toUpperCase();
  return 'U';
}

export function LandingNavbar() {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const name = displayName(user);
  const initials = initialsFromUser(user);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  useEffect(() => {
    function onEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setDropdownOpen(false);
    }
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const AuthSlotDesktop = () => {
    if (authLoading) {
      return (
        <div
          className="hidden md:flex h-10 w-28 rounded-sm bg-surface-container animate-pulse border border-outline/30"
          aria-hidden
        />
      );
    }
    if (isAuthenticated && user) {
      return (
        <div className="hidden md:block relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-2 pl-1 pr-2 py-1.5 rounded-sm border border-outline/50 bg-surface-container/80 hover:bg-surface-container hover:border-primary/40 transition-all duration-200"
            aria-expanded={dropdownOpen}
            aria-haspopup="menu"
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold uppercase tracking-tight text-primary border border-primary/30"
              aria-hidden
            >
              {initials}
            </span>
            <span className="text-xs font-bold uppercase tracking-tight text-on-surface max-w-[140px] truncate">
              Hi, {name}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-on-surface-variant shrink-0 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {dropdownOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-52 py-1 rounded-sm border border-outline/50 bg-background/95 backdrop-blur-md shadow-xl z-[60]"
            >
              <Link
                role="menuitem"
                to="/profile"
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-on-surface hover:bg-surface-container transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <UserCircle className="w-4 h-4 text-on-surface-variant" />
                Profile
              </Link>
              <Link
                role="menuitem"
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-on-surface hover:bg-surface-container transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <LayoutDashboard className="w-4 h-4 text-on-surface-variant" />
                Dashboard
              </Link>
              <button
                type="button"
                role="menuitem"
                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-red-400 hover:bg-red-950/30 transition-colors text-left"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      );
    }
    return (
      <Link
        to="/login"
        className="hidden md:block bg-primary text-on-primary px-8 py-2.5 text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all duration-300 active:scale-95"
      >
        Join Now
      </Link>
    );
  };

  const AuthSlotMobile = () => {
    if (authLoading) {
      return (
        <div className="h-10 w-full rounded-sm bg-surface-container animate-pulse border border-outline/30 mt-4" aria-hidden />
      );
    }
    if (isAuthenticated && user) {
      return (
        <div className="mt-4 pt-4 border-t border-outline/30 space-y-2">
          <div className="flex items-center gap-3 px-1 py-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-xs font-bold uppercase text-primary border border-primary/30">
              {initials}
            </span>
            <div>
              <p className="text-xs font-bold text-on-surface uppercase tracking-tight">Hi, {name}</p>
              <p className="text-[10px] text-on-surface-variant truncate max-w-[200px]">{user.email}</p>
            </div>
          </div>
          <Link
            to="/profile"
            onClick={() => setMobileOpen(false)}
            className="block w-full text-center border border-outline text-on-surface px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-surface-container transition-colors"
          >
            Profile
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="block w-full text-center border border-outline text-on-surface px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-surface-container transition-colors"
          >
            Dashboard
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="block w-full text-center bg-red-950/40 text-red-300 border border-red-500/30 px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-red-950/60 transition-colors"
          >
            Logout
          </button>
        </div>
      );
    }
    return (
      <Link
        to="/login"
        onClick={() => setMobileOpen(false)}
        className="block w-full text-center bg-primary text-on-primary px-8 py-3 text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all duration-300 active:scale-95 mt-4"
      >
        Join Now
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-outline/30">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-6 px-8 md:px-12">
        <Link to="/" className="flex items-center">
          <img src="/images/logo.svg" alt="App Logo" className="h-8 md:h-10 w-auto object-contain" />
        </Link>

        <div className="hidden md:flex items-center gap-x-10">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={
                link.active
                  ? 'font-headline uppercase tracking-tight text-xs text-primary font-bold'
                  : 'font-headline uppercase tracking-tight text-xs text-on-surface-variant hover:text-primary transition-all duration-200'
              }
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-on-surface-variant hover:text-on-surface transition-colors"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <AuthSlotDesktop />
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-outline/30 bg-background/95 backdrop-blur-md">
          <div className="px-8 py-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={
                  link.active
                    ? 'block font-headline uppercase tracking-tight text-xs text-primary font-bold py-2'
                    : 'block font-headline uppercase tracking-tight text-xs text-on-surface-variant hover:text-primary transition-all duration-200 py-2'
                }
              >
                {link.label}
              </a>
            ))}
            <AuthSlotMobile />
          </div>
        </div>
      )}
    </nav>
  );
}
