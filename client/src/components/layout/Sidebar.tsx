import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Utensils, 
  TrendingUp, 
  User, 
  X,
  Calculator,
  Bot,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Workouts', icon: Dumbbell, path: '/workouts' },
  { name: 'Exercises', icon: BookOpen, path: '/exercises' },
  { name: 'Nutrition', icon: Utensils, path: '/nutrition' },
  { name: 'Progress', icon: TrendingUp, path: '/progress' },
  { name: 'BMI Calc', icon: Calculator, path: '/bmi' },
  { name: 'AI Coach', icon: Bot, path: '/chatbot' },
  { name: 'Profile', icon: User, path: '/profile' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed left-0 top-0 h-screen w-64 bg-surface-low flex flex-col py-8 border-r border-outline z-[60] transition-transform duration-300 ease-in-out touch-manipulation",
        // Desktop always visible; mobile drawer uses max-lg only so overrides never fight
        "lg:translate-x-0",
        isOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full"
      )}>
        <div className="mb-12 px-8 flex items-center justify-between">
          <Link to="/" className="block">
            <img src="/images/logo.svg" alt="App Logo" className="h-8 w-auto object-contain mb-1" />
            <p className="text-[10px] tracking-[0.3em] uppercase text-on-surface-variant font-bold">Performance</p>
          </Link>
          {/* Close button for mobile */}
          <button 
            type="button"
            onClick={onClose}
            className="lg:hidden inline-flex items-center justify-center min-h-11 min-w-11 p-2 text-on-surface-variant hover:text-on-surface transition-colors touch-manipulation rounded-sm shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-4 px-8 py-4 min-h-11 transition-all duration-300 group relative",
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

      </aside>
    </>
  );
}
