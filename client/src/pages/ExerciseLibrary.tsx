import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Dumbbell, AlertTriangle, Lightbulb } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { Footer } from '@/components/layout/Footer';
import { ExerciseCard } from '@/components/ui/ExerciseCard';
import { Modal } from '@/components/ui/Modal';
import { exercises, Exercise } from '@/data/exercises';
import { cn } from '@/lib/utils';

export default function ExerciseLibrary() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMuscle, setActiveMuscle] = useState<string>('All');
  
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  // Extract unique muscle groups for filter tabs
  const muscleGroups = useMemo(() => {
    const groups = new Set<string>();
    groups.add('All');
    exercises.forEach(ex => groups.add(ex.targetMuscle));
    return Array.from(groups);
  }, []);

  const filteredExercises = useMemo(() => {
    return exercises.filter(ex => {
      const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            ex.targetMuscle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMuscle = activeMuscle === 'All' || ex.targetMuscle === activeMuscle;
      return matchesSearch && matchesMuscle;
    });
  }, [searchQuery, activeMuscle]);

  return (
    <div className="min-h-screen bg-background min-w-0 overflow-x-clip">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <main className="lg:ml-64 pt-20">
        <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-12">
          
          {/* Header Section */}
          <section className="relative">
            <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-on-surface mb-6 break-words">
              Exercise Vault
            </h1>
            <p className="text-on-surface-variant text-sm md:text-base font-light max-w-3xl leading-relaxed">
              Master your form and discover the optimal movements for building strength, endurance, and functional athleticism. Browse by muscle group or locate specific exercises.
            </p>
          </section>

          {/* Controls */}
          <section className="bg-surface-container p-6 md:p-8 border-l-4 border-primary">
            <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
              
              <div className="relative w-full lg:w-96 flex-shrink-0 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search over 25+ movements..." 
                  className="w-full bg-surface-low border border-outline rounded-sm pl-12 pr-4 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-on-surface-variant/40"
                />
              </div>

              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none w-full border-l border-outline pl-0 lg:pl-6">
                <Filter className="w-5 h-5 text-on-surface-variant shrink-0" />
                <div className="flex gap-2 min-w-max">
                  {muscleGroups.map(group => (
                    <button
                      key={group}
                      onClick={() => setActiveMuscle(group)}
                      className={cn(
                        "px-6 py-2 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300",
                        activeMuscle === group 
                          ? "bg-primary text-on-primary shadow-[0_0_15px_rgba(255,59,59,0.3)]" 
                          : "bg-surface border border-outline text-on-surface-variant hover:text-on-surface hover:border-primary/50"
                      )}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </section>

          {/* Grid */}
          <section>
            {filteredExercises.length === 0 ? (
              <div className="p-16 border-2 border-dashed border-outline flex flex-col items-center justify-center bg-surface-container/50">
                <Dumbbell className="w-12 h-12 mb-4 text-on-surface-variant/30" />
                <p className="font-headline text-xl font-black uppercase italic tracking-tight text-on-surface-variant mb-2">No exercises found</p>
                <p className="text-sm text-on-surface-variant font-light">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <motion.div 
                layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                <AnimatePresence>
                  {filteredExercises.map((exercise) => (
                    <ExerciseCard 
                      key={exercise.id} 
                      exercise={exercise} 
                      onViewForm={setSelectedExercise} 
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </section>

        </div>
        <Footer />
      </main>

      {/* Detail Modal */}
      <Modal 
        isOpen={!!selectedExercise} 
        onClose={() => setSelectedExercise(null)} 
        title={selectedExercise?.name || ''}
      >
        {selectedExercise && (
          <div className="max-h-[65vh] overflow-y-auto pr-4 space-y-8 scrollbar-thin scrollbar-thumb-surface-highest scrollbar-track-transparent">
            <div className="w-full h-48 bg-surface-lowest rounded-sm overflow-hidden relative">
              <img 
                src={selectedExercise.image || "/images/default-exercise.jpg"} 
                alt={selectedExercise.name} 
                onError={(e) => {
                  e.currentTarget.src = "/images/default-exercise.jpg";
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80" />
            </div>

            {/* Muscle Groups */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant">Target:</span>
              <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest border border-primary/30 rounded-sm">
                {selectedExercise.targetMuscle}
              </span>
              {selectedExercise.secondaryMuscles.length > 0 && (
                <>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant ml-2">Secondary:</span>
                  {selectedExercise.secondaryMuscles.map(m => (
                    <span key={m} className="px-3 py-1 bg-surface-highest text-on-surface-variant text-[10px] font-bold uppercase tracking-widest border border-outline rounded-sm">
                      {m}
                    </span>
                  ))}
                </>
              )}
            </div>

            {/* Form Instructions */}
            <div className="bg-surface p-6 border border-outline">
              <h4 className="flex items-center gap-2 font-headline text-xl font-black uppercase italic tracking-tight text-on-surface mb-4">
                <Dumbbell className="w-5 h-5 text-primary" />
                Execution Steps
              </h4>
              <ol className="space-y-4">
                {selectedExercise.steps.map((step, idx) => (
                  <li key={idx} className="flex gap-4">
                    <span className="font-headline text-lg font-black text-primary italic">0{idx + 1}</span>
                    <span className="text-sm text-on-surface-variant leading-relaxed font-light">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Mistakes & Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-900/10 p-6 border border-red-500/30">
                <h4 className="flex items-center gap-2 font-headline text-sm font-black uppercase italic tracking-tight text-red-500 mb-4">
                  <AlertTriangle className="w-4 h-4" />
                  Common Mistakes
                </h4>
                <ul className="space-y-3">
                  {selectedExercise.mistakes.map((mistake, idx) => (
                    <li key={idx} className="text-xs text-on-surface-variant/80 font-light flex gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-emerald-900/10 p-6 border border-emerald-500/30">
                <h4 className="flex items-center gap-2 font-headline text-sm font-black uppercase italic tracking-tight text-emerald-500 mb-4">
                  <Lightbulb className="w-4 h-4" />
                  Pro Tips
                </h4>
                <ul className="space-y-3">
                  {selectedExercise.tips.map((tip, idx) => (
                    <li key={idx} className="text-xs text-on-surface-variant/80 font-light flex gap-2">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        )}
      </Modal>

    </div>
  );
}
