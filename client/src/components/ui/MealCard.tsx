import React from 'react';
import { cn } from '@/lib/utils';
import { type LucideIcon, Pencil, Trash2 } from 'lucide-react';

export interface MealItem {
  name: string;
  cals: number;
}

export interface MealCardProps {
  key?: React.Key;
  id?: string;
  time: string;
  type: string;
  items: MealItem[];
  totalCals: number;
  icon: LucideIcon;
  active?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function MealCard({ time, type, items, totalCals, icon: Icon, active, onEdit, onDelete }: MealCardProps) {
  return (
    <div className={cn(
      "bg-surface-container p-5 sm:p-8 border-l-2 transition-all duration-300 group relative min-w-0",
      active ? "border-primary" : "border-transparent hover:border-outline"
    )}>
      <div className="flex flex-col md:flex-row justify-between gap-6 sm:gap-8 min-w-0">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 min-w-0 flex-1">
          <div className="w-14 h-14 bg-surface-low rounded-sm flex items-center justify-center border border-outline group-hover:bg-primary group-hover:text-white transition-all shrink-0">
            <Icon className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
              <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">{time}</span>
              <span className="w-1 h-1 bg-outline rounded-full shrink-0"></span>
              <span className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.3em]">{type}</span>
            </div>
            <h6 className="font-headline text-lg sm:text-xl font-black uppercase italic tracking-tight mb-4 break-words">{type} Optimization</h6>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-on-surface-variant font-light min-w-0">
                  <span className="w-1 h-1 bg-primary rounded-full shrink-0"></span>
                  <span className="min-w-0 break-words">{item.name}</span>
                  <span className="text-[10px] font-bold text-on-surface-variant/40 whitespace-nowrap">{item.cals} kcal</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="text-left md:text-right flex flex-row md:flex-col justify-between md:justify-center items-start md:items-end gap-4 shrink-0">
          <div>
            <p className="text-3xl font-headline font-black text-on-surface italic">{totalCals}</p>
            <p className="text-[9px] uppercase tracking-[0.3em] font-black text-on-surface-variant">Total kcal</p>
          </div>
          {/* Edit / Delete actions */}
          {(onEdit || onDelete) && (
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {onEdit && (
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(); }}
                  className="w-8 h-8 bg-surface-low border border-outline flex items-center justify-center hover:bg-primary hover:text-on-primary hover:border-primary transition-all"
                  title="Edit Meal"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(); }}
                  className="w-8 h-8 bg-surface-low border border-outline flex items-center justify-center hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                  title="Delete Meal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
