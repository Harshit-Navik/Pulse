import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Utensils, 
  TrendingUp, 
  User, 
  Award 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Workouts', icon: Dumbbell, path: '/workouts' },
  { name: 'Nutrition', icon: Utensils, path: '/nutrition' },
  { name: 'Progress', icon: TrendingUp, path: '/progress' },
  { name: 'Profile', icon: User, path: '/profile' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface-low flex flex-col py-8 border-r border-outline z-50">
      <div className="mb-12 px-8">
        <Link to="/" className="block">
          <h1 className="text-2xl font-black italic text-primary uppercase tracking-widest font-headline">PULSE</h1>
          <p className="text-[10px] tracking-[0.3em] uppercase text-on-surface-variant font-bold mt-1">Performance</p>
        </Link>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-4 px-8 py-4 transition-all duration-300 group relative",
                isActive 
                  ? "text-primary border-r-4 border-primary bg-gradient-to-r from-primary/10 to-transparent" 
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-highest/50"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "fill-primary/20")} />
              <span className="text-sm font-bold uppercase tracking-tight font-headline">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-8">
        <div className="p-4 bg-surface-bright rounded-sm border border-outline/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-sm bg-primary/10 flex items-center justify-center">
              <Award className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Elite Status</p>
              <p className="text-xs text-on-surface font-bold">Day 42 Streak</p>
            </div>
          </div>
          <div className="w-full bg-surface h-1 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-2/3 shadow-[0_0_8px_rgba(255,59,59,0.5)]"></div>
          </div>
        </div>
      </div>
    </aside>
  );
}
