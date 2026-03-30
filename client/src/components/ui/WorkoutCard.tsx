import React from 'react';
import { ArrowUpRight, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface WorkoutCardProps {
  id: string;
  tag: string;
  title: string;
  duration: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ELITE' | 'EXPERT';
  equipment: string;
  image: string;
  isDefault?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function WorkoutCard({ id, tag, title, duration, difficulty, equipment, image, isDefault = true, onEdit, onDelete }: WorkoutCardProps) {
  const navigate = useNavigate();

  return (
    <div className="group flex flex-col bg-surface-container border border-outline hover:border-primary/40 transition-all duration-500">
      <div className="relative h-72 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale brightness-75 contrast-125"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          <span className="bg-primary px-3 py-1 text-[9px] font-black tracking-[0.2em] uppercase text-on-primary w-fit">{tag}</span>
          <span className={cn(
            "px-3 py-1 text-[9px] font-black tracking-[0.2em] uppercase w-fit border backdrop-blur-sm",
            isDefault ? "bg-surface/80 text-on-surface-variant border-outline" : "bg-primary/20 text-primary border-primary/30"
          )}>
            {isDefault ? "System" : "Custom"}
          </span>
        </div>
        {/* Edit / Delete buttons — shown only when callbacks are provided */}
        {(onEdit || onDelete) && (
          <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {onEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="w-9 h-9 bg-surface/90 backdrop-blur-sm border border-outline flex items-center justify-center hover:bg-primary hover:text-on-primary hover:border-primary transition-all"
                title="Edit Workout"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="w-9 h-9 bg-surface/90 backdrop-blur-sm border border-outline flex items-center justify-center hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                title="Delete Workout"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
      <div className="p-10 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-8">
          <h3 className="font-headline text-2xl font-black text-on-surface uppercase tracking-tight group-hover:text-primary transition-colors italic leading-none">{title}</h3>
          <ArrowUpRight className="text-on-surface-variant group-hover:text-primary transition-colors w-5 h-5" />
        </div>
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-[0.2em] font-black text-on-surface-variant mb-2">Duration</span>
            <span className="text-xs font-bold text-on-surface uppercase">{duration}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-[0.2em] font-black text-on-surface-variant mb-2">Difficulty</span>
            <span className="text-xs font-bold text-on-surface uppercase">{difficulty}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-[0.2em] font-black text-on-surface-variant mb-2">Equipment</span>
            <span className="text-xs font-bold text-on-surface uppercase">{equipment}</span>
          </div>
        </div>
        <button 
          onClick={() => navigate(`/workouts/${id}`)}
          className="mt-auto w-full py-5 bg-gradient-to-br from-primary to-red-900 text-on-primary font-black text-[10px] tracking-[0.3em] uppercase transition-all hover:scale-[1.02] active:scale-95"
        >
          Start Workout
        </button>
      </div>
    </div>
  );
}
