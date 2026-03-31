import React from 'react';
import { motion } from 'motion/react';
import { Target, Zap, ArrowRight, PlayCircle } from 'lucide-react';
import { Exercise } from '@/data/exercises';

interface ExerciseCardProps {
  key?: string | number;
  exercise: Exercise;
  onViewForm: (exercise: Exercise) => void;
}

export function ExerciseCard({ exercise, onViewForm }: ExerciseCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
      className="bg-surface-container border border-outline rounded-sm overflow-hidden flex flex-col group hover:border-primary/50 transition-all duration-300 shadow-lg"
    >
      <div className="relative h-48 overflow-hidden bg-surface-lowest">
        <img 
          src={exercise.image || "/images/default-exercise.jpg"} 
          alt={exercise.name} 
          onError={(e) => {
            e.currentTarget.src = "/images/default-exercise.jpg";
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div className="flex gap-2 flex-wrap">
            <span className="px-2 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 text-[9px] uppercase tracking-widest font-black text-primary rounded-sm flex items-center gap-1">
              <Target className="w-3 h-3" />
              {exercise.targetMuscle}
            </span>
            <span className="px-2 py-1 bg-surface-highest/60 backdrop-blur-md border border-outline text-[9px] uppercase tracking-widest font-bold text-on-surface-variant rounded-sm flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {exercise.difficulty}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <h4 className="font-headline text-lg font-black uppercase italic tracking-tight text-on-surface mb-2">{exercise.name}</h4>
        <p className="text-sm text-on-surface-variant line-clamp-2 font-light flex-1">
          {exercise.description}
        </p>
        
        <button 
          onClick={() => onViewForm(exercise)}
          className="mt-6 w-full py-3 bg-surface border border-outline hover:border-primary/50 text-[10px] font-black uppercase tracking-[0.3em] text-on-surface group hover:text-primary transition-all duration-300 flex items-center justify-center gap-2 rounded-sm"
        >
          <PlayCircle className="w-4 h-4" />
          View Form
          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all duration-300" />
        </button>
      </div>
    </motion.div>
  );
}
