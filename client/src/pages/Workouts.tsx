import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowUpRight, 
  Clock, 
  Award, 
  Dumbbell,
  Search,
  ChevronDown,
  Plus,
  ChevronUp
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { Footer } from '@/components/layout/Footer';
import { WorkoutCard } from '@/components/ui/WorkoutCard';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';

const disciplines = ['All Disciplines', 'Strength', 'Cardio', 'Mobility', 'Hybrid', 'Recovery'];

const allWorkouts = [
  { id: 'neural-hypertrophy', tag: 'STRENGTH', title: 'Neural Hypertrophy 1.0', duration: '65 MINS', difficulty: 'ELITE' as const, equipment: 'FULL GYM', image: 'https://picsum.photos/seed/strength/600/400?grayscale' },
  { id: 'vo2-max', tag: 'CARDIO', title: 'VO2 Max Threshold', duration: '45 MINS', difficulty: 'ADVANCED' as const, equipment: 'TREADMILL', image: 'https://picsum.photos/seed/cardio/600/400?grayscale' },
  { id: 'fascial-release', tag: 'MOBILITY', title: 'Fascial Chain Release', duration: '30 MINS', difficulty: 'BEGINNER' as const, equipment: 'MAT', image: 'https://picsum.photos/seed/mobility/600/400?grayscale' },
  { id: 'metabolic-engine', tag: 'HYBRID', title: 'Metabolic Engine Builder', duration: '50 MINS', difficulty: 'EXPERT' as const, equipment: 'KETTLEBELLS', image: 'https://picsum.photos/seed/hybrid/600/400?grayscale' },
];

type SortOrder = 'latest' | 'oldest';

export default function Workouts() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeDiscipline, setActiveDiscipline] = useState(0);
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest');
  const [fabModalOpen, setFabModalOpen] = useState(false);

  const filteredWorkouts = useMemo(() => {
    let list = [...allWorkouts];
    // Filter
    if (activeDiscipline !== 0) {
      const selectedTag = disciplines[activeDiscipline].toUpperCase();
      list = list.filter(w => w.tag === selectedTag);
    }
    // Sort
    if (sortOrder === 'oldest') {
      list = list.reverse();
    }
    return list;
  }, [activeDiscipline, sortOrder]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <main className="lg:ml-64 pt-20">
        <div className="p-6 md:p-12 max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <section className="mb-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl"
              >
                <h2 className="font-headline text-4xl md:text-6xl font-black italic tracking-tighter text-on-surface mb-6 leading-none uppercase">Peak Conditioning</h2>
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
          <section className="mb-12 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-outline pb-8 gap-6">
            <div className="flex gap-6 md:gap-10 overflow-x-auto no-scrollbar">
              {disciplines.map((d, i) => (
                <button 
                  key={d}
                  onClick={() => setActiveDiscipline(i)}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest pb-8 -mb-8 transition-all whitespace-nowrap",
                    i === activeDiscipline ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-on-surface"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-6 text-on-surface-variant">
              <span className="text-[9px] uppercase tracking-[0.4em] font-black">Sort By</span>
              <button 
                onClick={() => setSortOrder(prev => prev === 'latest' ? 'oldest' : 'latest')}
                className="flex items-center gap-2 text-[10px] font-black text-on-surface uppercase tracking-widest"
              >
                {sortOrder === 'latest' ? 'Latest' : 'Oldest'} 
                {sortOrder === 'latest' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>
          </section>

          {/* Workout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWorkouts.map(w => (
              <WorkoutCard key={w.id} {...w} />
            ))}

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
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <div className="inline-block self-start border border-primary text-primary px-3 py-1 text-[9px] font-black tracking-[0.4em] uppercase mb-8">PRO PROGRAM</div>
                <h3 className="font-headline text-3xl md:text-4xl font-black text-on-surface mb-6 leading-none uppercase italic tracking-tighter">The 12-Week Apex Protocol</h3>
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

            {filteredWorkouts.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-24 text-on-surface-variant">
                <Dumbbell className="w-16 h-16 mb-6 opacity-20" />
                <p className="font-headline text-2xl font-black uppercase italic tracking-tight mb-2">No Workouts Found</p>
                <p className="text-sm font-light">Try selecting a different discipline.</p>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </main>

      {/* FAB */}
      <button 
        onClick={() => setFabModalOpen(true)}
        className="fixed bottom-12 right-12 w-16 h-16 bg-primary text-on-primary flex items-center justify-center shadow-2xl transition-transform active:scale-90 group z-50 hover:brightness-110"
      >
        <Plus className="w-8 h-8 font-black" />
      </button>

      {/* Add Workout Modal */}
      <Modal isOpen={fabModalOpen} onClose={() => setFabModalOpen(false)} title="Quick Add Workout">
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setFabModalOpen(false); }}>
          <div className="space-y-2">
            <label htmlFor="workout-name" className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Workout Name</label>
            <input 
              id="workout-name"
              type="text" 
              placeholder="e.g. Upper Body Push"
              className="w-full bg-surface-low border border-outline px-6 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-on-surface-variant/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="workout-duration" className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Duration</label>
              <input 
                id="workout-duration"
                type="text" 
                placeholder="45 mins"
                className="w-full bg-surface-low border border-outline px-6 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-on-surface-variant/20"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="workout-type" className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Discipline</label>
              <select 
                id="workout-type"
                className="w-full bg-surface-low border border-outline px-6 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all"
              >
                <option>Strength</option>
                <option>Cardio</option>
                <option>Mobility</option>
                <option>Hybrid</option>
                <option>Recovery</option>
              </select>
            </div>
          </div>
          <button 
            type="submit"
            className="w-full py-5 bg-primary text-on-primary font-black text-[10px] uppercase tracking-[0.4em] hover:brightness-110 transition-all active:scale-[0.98]"
          >
            Add Workout
          </button>
        </form>
      </Modal>
    </div>
  );
}
