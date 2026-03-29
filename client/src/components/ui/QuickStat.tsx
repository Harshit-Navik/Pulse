import React from 'react';
import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';

export interface QuickStatProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend: string;
}

export function QuickStat({ label, value, icon: Icon, trend }: QuickStatProps) {
  return (
    <div className="bg-surface-container p-8 border border-outline group hover:border-primary/40 transition-all">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-surface-low border border-outline group-hover:bg-primary group-hover:text-white transition-all">
          <Icon className="w-5 h-5" />
        </div>
        <span className={cn(
          "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-sm",
          trend.startsWith('+') ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"
        )}>
          {trend}
        </span>
      </div>
      <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.3em] mb-1">{label}</p>
      <p className="text-4xl font-headline font-black text-on-surface italic">{value}</p>
    </div>
  );
}
