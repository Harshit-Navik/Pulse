import React from 'react';
import { Search, Bell, Menu, User } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface TopBarProps {
  onMenuToggle?: () => void;
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  const location = useLocation();
  const { user } = useAuth();
  const pathName = location.pathname.split('/').pop() || 'Dashboard';
  const formattedPath = pathName.charAt(0).toUpperCase() + pathName.slice(1);

  // Dynamic date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <header className="fixed top-0 right-0 w-full lg:w-[calc(100%-16rem)] h-20 bg-surface-low/60 backdrop-blur-xl flex items-center justify-between px-6 md:px-10 z-40 border-b border-outline/50">
      <div className="flex items-center gap-4">
        {/* Hamburger for mobile */}
        <button 
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-on-surface-variant hover:text-on-surface transition-colors mr-2"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-on-surface font-headline">{formattedPath}</h2>
        <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-widest hidden sm:inline">{formattedDate}</span>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <div className="relative group hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search metrics..." 
            className="bg-surface-container border-none rounded-sm pl-10 pr-4 py-2 text-xs w-64 focus:ring-1 focus:ring-primary/30 transition-all text-on-surface placeholder:text-on-surface-variant/50"
          />
        </div>

        <button className="relative text-on-surface-variant hover:text-on-surface transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-primary rounded-full border border-surface-low"></span>
        </button>

        <div className="flex items-center gap-4 pl-4 md:pl-6 border-l border-outline">
          {!user ? (
            <Link to="/login" className="flex items-center gap-3 group">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-on-surface uppercase tracking-tight group-hover:text-primary transition-colors">Guest User</p>
                <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest group-hover:text-primary/70 transition-colors">Sign In to Save Progress</p>
              </div>
              <div className="w-10 h-10 rounded-sm overflow-hidden border border-outline ring-1 ring-primary/10 bg-surface-lowest flex items-center justify-center">
                <User className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ) : (
            <>
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-on-surface uppercase tracking-tight">{user.name || 'Athlete'}</p>
                <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest">{user.tier || 'Premium'} Member</p>
              </div>
              <div className="w-10 h-10 rounded-sm overflow-hidden border border-outline ring-1 ring-primary/10">
                <img 
                  src="https://picsum.photos/seed/athlete/100/100" 
                  alt="User Profile" 
                  className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
