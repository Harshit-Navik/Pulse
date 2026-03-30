import React from 'react';
import { cn } from '@/lib/utils';
import { type LucideIcon, Pencil, Trash2 } from 'lucide-react';

export interface MealItem {
  name: string;
  cals: number;
}

export interface MealCardProps {
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
      "bg-surface-container p-8 border-l-2 transition-all duration-300 group relative",
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
        <div className="text-right flex flex-col justify-center items-end gap-4">
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
