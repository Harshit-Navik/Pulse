import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface WorkoutCardProps {
  id: string;
  tag: string;
  title: string;
  duration: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ELITE' | 'EXPERT';
  equipment: string;
  image: string;
}

export function WorkoutCard({ id, tag, title, duration, difficulty, equipment, image }: WorkoutCardProps) {
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
        <div className="absolute top-6 left-6">
          <span className="bg-primary px-3 py-1 text-[9px] font-black tracking-[0.2em] uppercase text-on-primary">{tag}</span>
        </div>
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
