import React from 'react';
import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';

export interface MealItem {
  name: string;
  cals: number;
}

export interface MealCardProps {
  time: string;
  type: string;
  items: MealItem[];
  totalCals: number;
  icon: LucideIcon;
  active?: boolean;
}

export function MealCard({ time, type, items, totalCals, icon: Icon, active }: MealCardProps) {
  return (
    <div className={cn(
      "bg-surface-container p-8 border-l-2 transition-all duration-300 group",
      active ? "border-primary" : "border-transparent hover:border-outline"
    )}>
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div className="flex gap-8">
          <div className="w-14 h-14 bg-surface-low rounded-sm flex items-center justify-center border border-outline group-hover:bg-primary group-hover:text-white transition-all">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">{time}</span>
              <span className="w-1 h-1 bg-outline rounded-full"></span>
              <span className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.3em]">{type}</span>
            </div>
            <h6 className="font-headline text-xl font-black uppercase italic tracking-tight mb-4">{type} Optimization</h6>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-sm text-on-surface-variant font-light">
                  <span className="w-1 h-1 bg-primary rounded-full"></span>
                  <span>{item.name}</span>
                  <span className="text-[10px] font-bold text-on-surface-variant/40">{item.cals} kcal</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="text-right flex flex-col justify-center">
          <p className="text-3xl font-headline font-black text-on-surface italic">{totalCals}</p>
          <p className="text-[9px] uppercase tracking-[0.3em] font-black text-on-surface-variant">Total kcal</p>
        </div>
      </div>
    </div>
  );
}
