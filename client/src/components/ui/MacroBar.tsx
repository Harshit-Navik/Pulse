import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface MacroBarProps {
  label: string;
  current: number;
  target: number;
  color: string;
}

export function MacroBar({ label, current, target, color }: MacroBarProps) {
  const percentage = Math.min((current / target) * 100, 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
        <span className="text-on-surface">{label}</span>
        <span className="text-on-surface-variant">{current}g <span className="text-on-surface-variant/40">/ {target}g</span></span>
      </div>
      <div className="w-full h-1.5 bg-surface-highest rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full", color)}
        />
      </div>
    </div>
  );
}
