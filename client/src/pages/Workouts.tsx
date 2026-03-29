import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowUpRight, 
  Clock, 
  Award, 
  Dumbbell,
  Search,
  ChevronDown,
  Plus
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { Footer } from '@/components/layout/Footer';

const disciplines = ['All Disciplines', 'Strength', 'Cardio', 'Mobility', 'Hybrid', 'Recovery'];

export default function Workouts() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />
      
      <main className="ml-64 pt-20">
        <div className="p-12 max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <section className="mb-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl"
              >
                <h2 className="font-headline text-6xl font-black italic tracking-tighter text-on-surface mb-6 leading-none uppercase">Peak Conditioning</h2>
                <p className="text-on-surface-variant text-lg max-w-xl leading-relaxed font-light">
                  Precision-engineered workout programs designed for maximum metabolic output and functional strength. Choose your discipline.
                </p>
              </motion.div>
              
              <div className="flex gap-4">
                <button className="px-8 py-4 bg-primary text-on-primary font-black text-[10px] tracking-[0.3em] uppercase transition-all hover:brightness-110 active:scale-95">
                  Browse All
                </button>
                <button className="px-8 py-4 border border-outline text-on-surface font-black text-[10px] tracking-[0.3em] uppercase hover:bg-surface-bright transition-all active:scale-95">
                  My Library
                </button>
              </div>
            </div>
          </section>

          {/* Filters */}
          <section className="mb-12 flex items-center justify-between border-b border-outline pb-8">
            <div className="flex gap-10 overflow-x-auto no-scrollbar">
              {disciplines.map((d, i) => (
                <button 
                  key={d}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest pb-8 -mb-8 transition-all whitespace-nowrap",
                    i === 0 ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-on-surface"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-6 text-on-surface-variant">
              <span className="text-[9px] uppercase tracking-[0.4em] font-black">Sort By</span>
              <button className="flex items-center gap-2 text-[10px] font-black text-on-surface uppercase tracking-widest">
                Latest <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </section>

          {/* Workout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <WorkoutCard 
              tag="STRENGTH"
              title="Neural Hypertrophy 1.0"
              duration="65 MINS"
              difficulty="ELITE"
              equipment="FULL GYM"
              image="https://picsum.photos/seed/strength/600/400?grayscale"
            />
            <WorkoutCard 
              tag="CARDIO"
              title="VO2 Max Threshold"
              duration="45 MINS"
              difficulty="ADVANCED"
              equipment="TREADMILL"
              image="https://picsum.photos/seed/cardio/600/400?grayscale"
            />
            <WorkoutCard 
              tag="MOBILITY"
              title="Fascial Chain Release"
              duration="30 MINS"
              difficulty="BEGINNER"
              equipment="MAT"
              image="https://picsum.photos/seed/mobility/600/400?grayscale"
            />

            {/* Featured Wide Card */}
            <div className="group flex flex-col md:flex-row md:col-span-2 bg-surface-container border border-primary/20 transition-all duration-500 overflow-hidden relative">
              <div className="md:w-1/2 h-80 md:h-auto overflow-hidden">
                <img 
                  src="https://picsum.photos/seed/apex/800/600?grayscale" 
                  alt="Apex Protocol" 
                  className="w-full h-full object-cover grayscale brightness-50 contrast-125 group-hover:scale-105 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="md:w-1/2 p-12 flex flex-col justify-center">
                <div className="inline-block self-start border border-primary text-primary px-3 py-1 text-[9px] font-black tracking-[0.4em] uppercase mb-8">PRO PROGRAM</div>
                <h3 className="font-headline text-4xl font-black text-on-surface mb-6 leading-none uppercase italic tracking-tighter">The 12-Week Apex Protocol</h3>
                <p className="text-on-surface-variant text-sm mb-10 leading-relaxed font-light">
                  The complete transformation framework. Integrating periodized strength, zone 2 conditioning, and precision recovery protocols for professional-level results.
                </p>
                <div className="flex gap-12 mb-12">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-[0.3em] font-black text-on-surface-variant mb-2">Phase</span>
                    <span className="text-sm font-black text-on-surface uppercase italic">01 Baseline</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-[0.3em] font-black text-on-surface-variant mb-2">Level</span>
                    <span className="text-sm font-black text-on-surface uppercase italic">Professional</span>
                  </div>
                </div>
                <button className="self-start px-12 py-5 bg-gradient-to-br from-primary to-red-900 text-on-primary font-black text-[10px] tracking-[0.4em] uppercase transition-all hover:scale-105 active:scale-95">
                  Enroll in Protocol
                </button>
              </div>
            </div>

            <WorkoutCard 
              tag="HYBRID"
              title="Metabolic Engine Builder"
              duration="50 MINS"
              difficulty="EXPERT"
              equipment="KETTLEBELLS"
              image="https://picsum.photos/seed/hybrid/600/400?grayscale"
            />
          </div>
        </div>

        <Footer />
      </main>

      {/* FAB */}
      <button className="fixed bottom-12 right-12 w-16 h-16 bg-primary text-on-primary flex items-center justify-center shadow-2xl transition-transform active:scale-90 group z-50 hover:brightness-110">
        <Plus className="w-8 h-8 font-black" />
      </button>
    </div>
  );
}

function WorkoutCard({ tag, title, duration, difficulty, equipment, image }: any) {
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
        <button className="mt-auto w-full py-5 bg-gradient-to-br from-primary to-red-900 text-on-primary font-black text-[10px] tracking-[0.3em] uppercase transition-all hover:scale-[1.02] active:scale-95">
          Start Workout
        </button>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
