import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface SessionCardProps {
  title: string;
  date: string;
  duration: string;
  volume: string;
}

export function SessionCard({ title, date, duration, volume }: SessionCardProps) {
  return (
    <div className="bg-surface-container p-6 border border-outline hover:bg-surface-bright transition-all cursor-pointer group">
      <p className="text-[9px] text-primary font-black uppercase tracking-[0.3em] mb-2">{date}</p>
      <h5 className="font-headline text-lg font-black uppercase italic tracking-tight mb-6 leading-tight group-hover:text-primary transition-colors">{title}</h5>
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">{duration}</span>
          <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">{volume}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-outline group-hover:text-primary transition-all" />
      </div>
    </div>
  );
}
