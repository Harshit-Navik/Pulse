import React from 'react';
import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';

export interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  color: string;
}

export function MetricCard({ label, value, unit, icon: Icon, color }: MetricCardProps) {
  return (
    <div className="col-span-12 lg:col-span-4 bg-surface-container p-5 sm:p-6 group hover:border-l-4 hover:border-primary transition-all duration-300 min-w-0">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div className={cn("p-3 bg-surface-highest rounded-sm group-hover:bg-primary group-hover:text-white transition-all shrink-0", color)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-[10px] uppercase font-black text-on-surface-variant tracking-[0.3em]">{label}</span>
          <p className="text-2xl sm:text-3xl font-headline font-extrabold text-on-surface leading-none mt-1 break-words">
            {value} {unit && <span className="text-xs font-normal text-on-surface-variant">{unit}</span>}
          </p>
        </div>
      </div>
    </div>
  );
}
