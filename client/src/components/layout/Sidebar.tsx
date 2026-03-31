import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Utensils, 
  TrendingUp, 
  User, 
  Award,
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
        "fixed left-0 top-0 h-screen w-64 bg-surface-low flex flex-col py-8 border-r border-outline z-[60] transition-transform duration-300 ease-in-out",
        // On mobile: hidden by default, slide in when isOpen
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="mb-12 px-8 flex items-center justify-between">
          <Link to="/" className="block">
            <h1 className="text-2xl font-black italic text-primary uppercase tracking-widest font-headline">PULSE</h1>
            <p className="text-[10px] tracking-[0.3em] uppercase text-on-surface-variant font-bold mt-1">Performance</p>
          </Link>
          {/* Close button for mobile */}
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-on-surface-variant hover:text-on-surface transition-colors"
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
    </>
  );
}
