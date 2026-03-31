import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowUpRight, 
  Clock, 
  Award, 
  Dumbbell,
  Search,
  ChevronDown,
  Plus,
  ChevronUp,
  Loader2,
  Trash2
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { Footer } from '@/components/layout/Footer';
import { WorkoutCard } from '@/components/ui/WorkoutCard';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import { workoutAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const disciplines = ['All Disciplines', 'Strength', 'Cardio', 'Mobility', 'Hybrid', 'Recovery'];

// ── Hardcoded fallback data ────────────────────────────────────────
const fallbackWorkouts = [
  { id: 'neural-hypertrophy', tag: 'STRENGTH', title: 'Neural Hypertrophy 1.0', duration: '65 MINS', difficulty: 'ELITE' as const, equipment: 'FULL GYM', image: '/assets/images/neural-hypertrophy.png' },
  { id: 'vo2-max', tag: 'CARDIO', title: 'VO2 Max Threshold', duration: '45 MINS', difficulty: 'ADVANCED' as const, equipment: 'TREADMILL', image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=600&h=400&fit=crop' },
  { id: 'fascial-release', tag: 'MOBILITY', title: 'Fascial Chain Release', duration: '30 MINS', difficulty: 'BEGINNER' as const, equipment: 'MAT', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&h=400&fit=crop' },
  { id: 'metabolic-engine', tag: 'HYBRID', title: 'Metabolic Engine Builder', duration: '50 MINS', difficulty: 'EXPERT' as const, equipment: 'KETTLEBELLS', image: 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?q=80&w=600&h=400&fit=crop' },
];

type SortOrder = 'latest' | 'oldest';

interface WorkoutItem {
  id: string;
  _id?: string;
  tag: string;
  title: string;
  duration: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ELITE' | 'EXPERT';
  equipment: string;
  image: string;
  createdBy?: string | null;
  isDefault?: boolean;
}

interface WorkoutExerciseForm {
  name: string;
  sets: number;
  reps: string;
  duration?: string;
  rest?: string;
  notes?: string;
}

export default function Workouts() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeDiscipline, setActiveDiscipline] = useState(0);
  const [showMyLibrary, setShowMyLibrary] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest');
  const [fabModalOpen, setFabModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [workouts, setWorkouts] = useState<WorkoutItem[]>(fallbackWorkouts);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Currently editing workout
  const [editTarget, setEditTarget] = useState<WorkoutItem | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDuration, setFormDuration] = useState('');
  const [formTag, setFormTag] = useState('Strength');
  const [formDifficulty, setFormDifficulty] = useState('BEGINNER');
  const [formEquipment, setFormEquipment] = useState('');
  const [formExercises, setFormExercises] = useState<WorkoutExerciseForm[]>([]);

  // ── FETCH ──────────────────────────────────────────────────────
  const fetchWorkouts = useCallback(async () => {
    try {
      const res = await workoutAPI.getAll();
      const data = res.data.data;
      if (data && data.length > 0) {
        setWorkouts(data.map((w: any) => ({ ...w, id: w._id || w.id })));
      } else {
        setWorkouts(fallbackWorkouts);
      }
    } catch {
      setWorkouts(fallbackWorkouts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWorkouts(); }, [fetchWorkouts]);

  // ── CREATE ─────────────────────────────────────────────────────
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDuration.trim()) return;
    setError(null);
    setSubmitting(true);
    try {
      await workoutAPI.create({
        title: formTitle.trim(),
        duration: formDuration.trim().toUpperCase(),
        tag: formTag.toUpperCase(),
        difficulty: formDifficulty,
        equipment: formEquipment.trim() || 'NONE',
        exercises: formExercises,
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&h=600&fit=crop' // Default custom image
      });
      setFabModalOpen(false);
      resetForm();
      await fetchWorkouts();
    } catch (err: any) {
      setError(err.message || 'Failed to create workout');
    } finally {
      setSubmitting(false);
    }
  };

  // ── UPDATE ─────────────────────────────────────────────────────
  const openEdit = async (w: WorkoutItem) => {
    setEditTarget(w);
    setFormTitle(w.title);
    setFormDuration(w.duration);
    setFormTag(w.tag.charAt(0) + w.tag.slice(1).toLowerCase());
    setFormDifficulty(w.difficulty);
    setFormEquipment(w.equipment === 'NONE' ? '' : w.equipment);
    setEditModalOpen(true);
    
    // Fetch full workout to dynamically populate exercises since list view doesn't return them
    try {
      const res = await workoutAPI.getById(w._id || w.id);
      if (res.data.data.exercises) {
        setFormExercises(res.data.data.exercises);
      }
    } catch (e) {
      console.error(e);
      setFormExercises([]);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget || !formTitle.trim() || !formDuration.trim()) return;
    setError(null);
    setSubmitting(true);
    try {
      const targetId = editTarget._id || editTarget.id;
      await workoutAPI.update(targetId, {
        title: formTitle.trim(),
        duration: formDuration.trim().toUpperCase(),
        tag: formTag.toUpperCase(),
        difficulty: formDifficulty,
        equipment: formEquipment.trim() || 'NONE',
        exercises: formExercises,
      });
      setEditModalOpen(false);
      resetForm();
      await fetchWorkouts();
    } catch (err: any) {
      setError(err.message || 'Failed to update workout');
    } finally {
      setSubmitting(false);
    }
  };

  // ── DELETE ─────────────────────────────────────────────────────
  const openDelete = (w: WorkoutItem) => {
    setEditTarget(w);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!editTarget) return;
    setError(null);
    setSubmitting(true);
    try {
      const targetId = editTarget._id || editTarget.id;
      await workoutAPI.delete(targetId);
      setDeleteModalOpen(false);
      setEditTarget(null);
      await fetchWorkouts();
    } catch (err: any) {
      setError(err.message || 'Failed to delete workout');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormTitle(''); setFormDuration(''); setFormTag('Strength');
    setFormDifficulty('BEGINNER'); setFormEquipment(''); setFormExercises([]); setEditTarget(null); setError(null);
  };

  // ── FILTER + SORT ──────────────────────────────────────────────
  const filteredWorkouts = useMemo(() => {
    let list = [...workouts];
    if (showMyLibrary) {
      list = list.filter(w => isOwner(w));
    }
    if (activeDiscipline !== 0) {
      const selectedTag = disciplines[activeDiscipline].toUpperCase();
      list = list.filter(w => w.tag === selectedTag);
    }
    if (sortOrder === 'oldest') list = list.reverse();
    return list;
  }, [workouts, activeDiscipline, sortOrder]);

  // Check if current user owns the workout
  const isOwner = (w: WorkoutItem) => {
    if (!user || !w.createdBy) return false;
    return w.createdBy === (user as any)?._id;
  };

  // ── FORM JSX (shared between create & edit) ────────────────────
  const formFields = (
    <>
      <div className="space-y-2">
        <label htmlFor="workout-name" className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Workout Name</label>
        <input
          id="workout-name"
          type="text"
          value={formTitle}
          onChange={e => setFormTitle(e.target.value)}
          placeholder="e.g. Upper Body Push"
          className="w-full bg-surface-low border border-outline px-6 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-on-surface-variant/20"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="workout-duration" className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Duration</label>
          <input
            id="workout-duration"
            type="text"
            value={formDuration}
            onChange={e => setFormDuration(e.target.value)}
            placeholder="45 mins"
            className="w-full bg-surface-low border border-outline px-6 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-on-surface-variant/20"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="workout-type" className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Discipline</label>
          <select
            id="workout-type"
            value={formTag}
            onChange={e => setFormTag(e.target.value)}
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="workout-difficulty" className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Difficulty</label>
          <select
            id="workout-difficulty"
            value={formDifficulty}
            onChange={e => setFormDifficulty(e.target.value)}
            className="w-full bg-surface-low border border-outline px-6 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all"
          >
            <option value="BEGINNER">Beginner</option>
            <option value="ADVANCED">Advanced</option>
            <option value="EXPERT">Expert</option>
            <option value="ELITE">Elite</option>
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="workout-equipment" className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Equipment</label>
          <input
            id="workout-equipment"
            type="text"
            value={formEquipment}
            onChange={e => setFormEquipment(e.target.value)}
            placeholder="e.g. Full Gym"
            className="w-full bg-surface-low border border-outline px-6 py-4 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-on-surface-variant/20"
          />
        </div>
      </div>

      {/* Dynamic Exercises Form */}
      <div className="space-y-4 pt-6 border-t border-outline">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Exercises ({formExercises.length})</label>
          <button 
            type="button" 
            onClick={() => setFormExercises([...formExercises, { name: '', sets: 1, reps: '', duration: '', rest: '', notes: '' }])}
            className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:text-primary/80 transition-colors"
          >
            + Add Exercise
          </button>
        </div>
        
        {formExercises.map((ex, i) => (
          <div key={i} className="p-4 border border-outline bg-surface-lowest space-y-4 relative group transition-all">
            <button 
              type="button" 
              onClick={() => setFormExercises(formExercises.filter((_, idx) => idx !== i))}
              className="absolute top-2 right-2 p-1 text-on-surface-variant hover:text-red-500 transition-colors z-10"
              title="Remove Exercise"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="pr-6">
              <input type="text" value={ex.name} onChange={e => { const newEx = [...formExercises]; newEx[i].name = e.target.value; setFormExercises(newEx); }} placeholder="Exercise Name" className="w-full bg-surface border border-outline px-3 py-2 text-sm font-medium text-on-surface focus:ring-1 focus:ring-primary outline-none" required />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <input type="number" min="1" value={ex.sets} onChange={e => { const newEx = [...formExercises]; newEx[i].sets = parseInt(e.target.value) || 1; setFormExercises(newEx); }} placeholder="Sets" className="w-full bg-surface border border-outline px-3 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none" required />
              <input type="text" value={ex.reps} onChange={e => { const newEx = [...formExercises]; newEx[i].reps = e.target.value; setFormExercises(newEx); }} placeholder="Reps (e.g. 8-12)" className="w-full bg-surface border border-outline px-3 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none" required />
              <input type="text" value={ex.duration} onChange={e => { const newEx = [...formExercises]; newEx[i].duration = e.target.value; setFormExercises(newEx); }} placeholder="Duration (e.g. 60s)" className="w-full bg-surface border border-outline px-3 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none" />
              <input type="text" value={ex.rest} onChange={e => { const newEx = [...formExercises]; newEx[i].rest = e.target.value; setFormExercises(newEx); }} placeholder="Rest (e.g. 90s)" className="w-full bg-surface border border-outline px-3 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none" />
            </div>
            <input type="text" value={ex.notes || ''} onChange={e => { const newEx = [...formExercises]; newEx[i].notes = e.target.value; setFormExercises(newEx); }} placeholder="Notes (optional)" className="w-full bg-surface border border-outline px-3 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none" />
          </div>
        ))}
      </div>
    </>
  );

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
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button 
                  onClick={() => setShowMyLibrary(false)}
                  className={cn("px-8 py-4 font-black text-[10px] tracking-[0.3em] uppercase transition-all active:scale-95", !showMyLibrary ? "bg-primary text-on-primary hover:brightness-110" : "border border-outline text-on-surface hover:bg-surface-bright")}
                >
                  Browse All
                </button>
                {user && (
                  <button 
                    onClick={() => setShowMyLibrary(true)}
                    className={cn("px-8 py-4 font-black text-[10px] tracking-[0.3em] uppercase transition-all active:scale-95", showMyLibrary ? "bg-primary text-on-primary hover:brightness-110" : "border border-outline text-on-surface hover:bg-surface-bright")}
                  >
                    My Library
                  </button>
                )}
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

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}

          {/* Workout Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredWorkouts.map(w => (
                <WorkoutCard
                  key={w._id || w.id}
                  {...w}
                  id={w._id || w.id}
                  isDefault={w.isDefault !== false}
                  onEdit={isOwner(w) ? () => openEdit(w) : undefined}
                  onDelete={isOwner(w) ? () => openDelete(w) : undefined}
                />
              ))}

              {/* Featured Wide Card */}
              <div className="group flex flex-col md:flex-row md:col-span-2 bg-surface-container border border-primary/20 transition-all duration-500 overflow-hidden relative">
                <div className="md:w-1/2 h-80 md:h-auto overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=800&h=600&fit=crop" 
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
                  <div className="flex flex-wrap gap-6 sm:gap-12 mb-12">
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

              {filteredWorkouts.length === 0 && !loading && (
                <div className="col-span-full flex flex-col items-center justify-center py-24 text-on-surface-variant">
                  <Dumbbell className="w-16 h-16 mb-6 opacity-20" />
                  <p className="font-headline text-2xl font-black uppercase italic tracking-tight mb-2">No Workouts Found</p>
                  <p className="text-sm font-light">Try selecting a different discipline.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <Footer />
      </main>

      {/* FAB */}
      <button 
        onClick={() => { resetForm(); setFabModalOpen(true); }}
        className="fixed bottom-6 right-6 sm:bottom-12 sm:right-12 w-14 h-14 sm:w-16 sm:h-16 bg-primary text-on-primary flex items-center justify-center rounded-sm shadow-2xl transition-all hover:brightness-125 hover:scale-105 active:scale-95 group z-50"
      >
        <Plus className="w-8 h-8 font-black" />
      </button>

      {/* ── Create Workout Modal ──────────────────────────────────── */}
      <Modal isOpen={fabModalOpen} onClose={() => setFabModalOpen(false)} title="Quick Add Workout">
        {error && <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 text-red-500 text-xs font-black uppercase tracking-widest">Error: {error}</div>}
        <form className="space-y-6" onSubmit={handleCreate}>
          {formFields}
          <button 
            type="submit"
            disabled={submitting}
            className="w-full py-5 bg-primary text-on-primary font-black text-[10px] uppercase tracking-[0.4em] hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Add Workout
          </button>
        </form>
      </Modal>

      {/* ── Edit Workout Modal ────────────────────────────────────── */}
      <Modal isOpen={editModalOpen} onClose={() => { setEditModalOpen(false); resetForm(); }} title="Edit Workout">
        {error && <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 text-red-500 text-xs font-black uppercase tracking-widest">Error: {error}</div>}
        <form className="space-y-6" onSubmit={handleUpdate}>
          {formFields}
          <button 
            type="submit"
            disabled={submitting}
            className="w-full py-5 bg-primary text-on-primary font-black text-[10px] uppercase tracking-[0.4em] hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </button>
        </form>
      </Modal>

      {/* ── Delete Confirmation Modal ─────────────────────────────── */}
      <Modal isOpen={deleteModalOpen} onClose={() => { setDeleteModalOpen(false); setEditTarget(null); setError(null); }} title="Delete Workout">
        <div className="space-y-8">
          {error && <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-500 text-xs font-black uppercase tracking-widest">Error: {error}</div>}
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Are you sure you want to delete <span className="font-black text-on-surface">{editTarget?.title}</span>? This action cannot be undone.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => { setDeleteModalOpen(false); setEditTarget(null); setError(null); }}
              className="flex-1 py-4 border border-outline text-on-surface font-black text-[10px] uppercase tracking-[0.3em] hover:bg-surface-bright transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={submitting}
              className="flex-1 py-4 bg-red-600 text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
