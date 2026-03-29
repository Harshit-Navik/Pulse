import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export function TopBar() {
  const location = useLocation();
  const pathName = location.pathname.split('/').pop() || 'Dashboard';
  const formattedPath = pathName.charAt(0).toUpperCase() + pathName.slice(1);

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-20 bg-surface-low/60 backdrop-blur-xl flex items-center justify-between px-10 z-40 border-b border-outline/50">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-on-surface font-headline">{formattedPath}</h2>
        <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-widest">Monday, Oct 23</span>
      </div>

      <div className="flex items-center gap-8">
        <div className="relative group">
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

        <div className="flex items-center gap-4 pl-6 border-l border-outline">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-on-surface uppercase tracking-tight">Alexander Thorne</p>
            <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest">Premium Member</p>
          </div>
          <div className="w-10 h-10 rounded-sm overflow-hidden border border-outline ring-1 ring-primary/10">
            <img 
              src="https://picsum.photos/seed/athlete/100/100" 
              alt="User Profile" 
              className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
