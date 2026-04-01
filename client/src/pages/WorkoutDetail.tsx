import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Dumbbell, 
  Zap,
  CheckCircle2,
  Circle,
  Loader2,
  Plus
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { Footer } from '@/components/layout/Footer';
import { Modal } from '@/components/ui/Modal';
import { workoutAPI, progressAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  duration?: string;
  rest?: string;
  notes?: string;
  completed: boolean;
}

interface WorkoutData {
  id: string;
  _id?: string;
  createdBy?: string;
  isDefault?: boolean;
  tag: string;
  title: string;
  duration: string;
  difficulty: string;
  equipment: string;
  image: string;
  description: string;
  exercises: Exercise[];
}

function isMongoId(s: string) {
  return /^[a-f\d]{24}$/i.test(s);
}

/** Parse "65 MINS" / "45 mins" → minutes */
function parsePlanDurationMinutes(s: string): number {
  const m = s.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 45;
}

/** Rough kcal estimate from time + tag + share of exercises completed (not medical-grade). */
function estimateCaloriesBurned(
  durationMinutes: number,
  tag: string,
  progressPct: number
): number {
  const mult =
    tag === 'CARDIO' ? 10 : tag === 'MOBILITY' ? 3.5 : tag === 'HYBRID' ? 8.5 : 7.5;
  const completionFactor = 0.65 + 0.35 * (progressPct / 100);
  return Math.round(Math.min(900, Math.max(80, durationMinutes * mult * completionFactor)));
}

const workoutDatabase: Record<string, WorkoutData> = {
  'neural-hypertrophy': {
    id: 'neural-hypertrophy',
    tag: 'STRENGTH',
    title: 'Neural Hypertrophy 1.0',
    duration: '65 MINS',
    difficulty: 'ELITE',
    equipment: 'FULL GYM',
    image: '/assets/images/neural-hypertrophy.png',
    description: 'A high-intensity neural drive program designed to maximize motor unit recruitment and mechanical tension for advanced hypertrophy.',
    exercises: [
      { name: 'Barbell Back Squat', sets: 5, reps: '5', rest: '3 min', completed: false },
      { name: 'Romanian Deadlift', sets: 4, reps: '8', rest: '2 min', completed: false },
      { name: 'Weighted Pull-Ups', sets: 4, reps: '6', rest: '2.5 min', completed: false },
      { name: 'Incline Dumbbell Press', sets: 4, reps: '8', rest: '2 min', completed: false },
      { name: 'Barbell Row', sets: 3, reps: '10', rest: '90 sec', completed: false },
      { name: 'Face Pulls', sets: 3, reps: '15', rest: '60 sec', completed: false },
    ],
  },
  'vo2-max': {
    id: 'vo2-max',
    tag: 'CARDIO',
    title: 'VO2 Max Threshold',
    duration: '45 MINS',
    difficulty: 'ADVANCED',
    equipment: 'TREADMILL',
    image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=1200&h=600&fit=crop',
    description: 'Interval-based conditioning protocol to push your aerobic ceiling and improve cardiovascular output at lactate threshold.',
    exercises: [
      { name: 'Dynamic Warm-Up', sets: 1, reps: '5 min', rest: '-', completed: false },
      { name: 'Treadmill Intervals (90% MHR)', sets: 6, reps: '3 min on / 2 min rest', rest: '2 min', completed: false },
      { name: 'Incline Walk Recovery', sets: 1, reps: '5 min', rest: '-', completed: false },
      { name: 'Assault Bike Sprint', sets: 4, reps: '30 sec on / 90 sec off', rest: '90 sec', completed: false },
      { name: 'Cool Down Jog', sets: 1, reps: '5 min', rest: '-', completed: false },
    ],
  },
  'fascial-release': {
    id: 'fascial-release',
    tag: 'MOBILITY',
    title: 'Fascial Chain Release',
    duration: '30 MINS',
    difficulty: 'BEGINNER',
    equipment: 'MAT',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&h=600&fit=crop',
    description: 'A restorative session targeting the myofascial chains to improve range of motion, reduce adhesions, and accelerate recovery.',
    exercises: [
      { name: 'Foam Roll — Thoracic Spine', sets: 1, reps: '3 min', rest: '-', completed: false },
      { name: 'Cat-Cow Flow', sets: 3, reps: '10', rest: '30 sec', completed: false },
      { name: "World's Greatest Stretch", sets: 3, reps: '5 each side', rest: '30 sec', completed: false },
      { name: '90/90 Hip Switch', sets: 3, reps: '8 each side', rest: '30 sec', completed: false },
      { name: 'Pigeon Pose Hold', sets: 2, reps: '60 sec each', rest: '-', completed: false },
    ],
  },
  'metabolic-engine': {
    id: 'metabolic-engine',
    tag: 'HYBRID',
    title: 'Metabolic Engine Builder',
    duration: '50 MINS',
    difficulty: 'EXPERT',
    equipment: 'KETTLEBELLS',
    image: 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?q=80&w=1200&h=600&fit=crop',
    description: 'A metabolic conditioning circuit combining strength and cardio elements for maximum caloric output and functional endurance.',
    exercises: [
      { name: 'Kettlebell Swing', sets: 5, reps: '15', rest: '45 sec', completed: false },
      { name: 'Goblet Squat', sets: 4, reps: '12', rest: '60 sec', completed: false },
      { name: 'Turkish Get-Up', sets: 3, reps: '3 each side', rest: '90 sec', completed: false },
      { name: 'Clean & Press', sets: 4, reps: '8 each side', rest: '60 sec', completed: false },
      { name: 'Renegade Row', sets: 3, reps: '10', rest: '60 sec', completed: false },
      { name: 'Kettlebell Snatch', sets: 3, reps: '8 each side', rest: '90 sec', completed: false },
    ],
  },
};

export default function WorkoutDetail() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [workout, setWorkout] = useState<WorkoutData | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [exForm, setExForm] = useState({ name: '', sets: 1, reps: '', duration: '', rest: '', notes: '' });

  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [loggingSession, setLoggingSession] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchWorkout = async () => {
      try {
        const res = await workoutAPI.getById(id);
        const data = res.data.data;
        setWorkout({ ...data, id: data._id || data.id });
        setExercises(data.exercises.map((e: any) => ({ ...e, completed: false })));
      } catch (error) {
        // Fallback to local
        const localWorkout = workoutDatabase[id];
        if (localWorkout) {
          setWorkout(localWorkout);
          setExercises(localWorkout.exercises.map(e => ({ ...e, completed: false })));
        } else {
          setWorkout(null);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkout();
  }, [id]);

  const isOwner = user && workout && workout.createdBy === user._id && !workout.isDefault;

  const handleLogSession = async () => {
    if (!workout || !user) {
      alert('Sign in to save this workout to your progress.');
      navigate('/login');
      return;
    }
    if (completedCount < 1 && timerSeconds < 45) {
      alert('Check off at least one exercise or run the timer for a bit so we can log your session.');
      return;
    }
    const planMins = parsePlanDurationMinutes(workout.duration);
    const elapsedMins = Math.max(1, Math.round(timerSeconds / 60));
    const durationMinutes = Math.min(Math.max(elapsedMins, 1), planMins * 2);
    const caloriesBurned = estimateCaloriesBurned(durationMinutes, workout.tag, progressPercentage);
    const workoutRef =
      id && isMongoId(id) ? id : workout._id && isMongoId(String(workout._id)) ? String(workout._id) : undefined;

    const sessionExercises = exercises.map((e) => ({
      name: e.name,
      sets: e.sets,
      reps: e.reps || `${e.sets} sets`,
      rest: e.rest || '-',
      completed: e.completed,
    }));

    setLoggingSession(true);
    try {
      await progressAPI.logSession({
        workout: workoutRef || null,
        title: workout.title,
        duration: durationMinutes,
        volume: `${completedCount}/${exercises.length} exercises`,
        caloriesBurned,
        exercises: sessionExercises,
      });
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to log workout';
      alert(msg);
    } finally {
      setLoggingSession(false);
    }
  };

  const handleAddExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !exForm.name.trim()) return;
    setSubmitting(true);
    try {
      const res = await workoutAPI.addExercise(id, { ...exForm, sets: Number(exForm.sets) || 1 });
      const updatedWorkout = res.data.data;
      setWorkout(updatedWorkout);
      setExercises(updatedWorkout.exercises.map((ex: any) => ({ ...ex, completed: false })));
      setAddModalOpen(false);
      setExForm({ name: '', sets: 1, reps: '', duration: '', rest: '', notes: '' });
    } catch (err: any) {
      alert(err.message || 'Failed to add exercise');
    } finally {
      setSubmitting(false);
    }
  };

  // Timer logic
  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerRunning]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const toggleExercise = (index: number) => {
    setExercises(prev => prev.map((e, i) => i === index ? { ...e, completed: !e.completed } : e));
  };

  const completedCount = exercises.filter(e => e.completed).length;
  const progressPercentage = exercises.length > 0 ? (completedCount / exercises.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant">Intializing Protocol...</p>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-headline text-4xl font-black uppercase italic tracking-tight text-on-surface mb-4">Workout Not Found</h2>
          <p className="text-on-surface-variant mb-8">The workout you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/workouts')}
            className="px-8 py-4 bg-primary text-on-primary font-black text-[10px] uppercase tracking-[0.3em] hover:brightness-110 transition-all"
          >
            Back to Workouts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background min-w-0 overflow-x-clip">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main className="lg:ml-64 pt-20">
        <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-12">

          {/* Back Button */}
          <button 
            onClick={() => navigate('/workouts')}
            className="flex items-center gap-3 text-on-surface-variant hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to Workouts</span>
          </button>

          {/* Hero */}
          <section className="relative min-h-[16rem] h-64 sm:h-80 md:h-96 overflow-hidden border border-outline">
            <img 
              src={workout.image} 
              alt={workout.title} 
              className="absolute inset-0 w-full h-full object-cover grayscale brightness-40 contrast-125"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5 sm:p-8 md:p-12 max-w-full z-10">
              <span className="bg-primary px-3 py-1 text-[9px] font-black tracking-[0.2em] uppercase text-on-primary mb-4 inline-block">{workout.tag}</span>
              <h1 className="font-headline text-2xl sm:text-3xl md:text-5xl font-black text-on-surface uppercase italic tracking-tighter leading-none mb-4 break-words">{workout.title}</h1>
              <p className="text-on-surface-variant text-sm max-w-xl font-light leading-relaxed">{workout.description}</p>
            </div>
          </section>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface-container p-6 border border-outline">
              <p className="text-[9px] text-on-surface-variant font-black uppercase tracking-[0.3em] mb-1">Duration</p>
              <p className="text-lg sm:text-2xl font-headline font-black text-on-surface italic break-words">{workout.duration}</p>
            </div>
            <div className="bg-surface-container p-6 border border-outline">
              <p className="text-[9px] text-on-surface-variant font-black uppercase tracking-[0.3em] mb-1">Difficulty</p>
              <p className="text-lg sm:text-2xl font-headline font-black text-on-surface italic break-words">{workout.difficulty}</p>
            </div>
            <div className="bg-surface-container p-6 border border-outline min-w-0">
              <p className="text-[9px] text-on-surface-variant font-black uppercase tracking-[0.3em] mb-1">Equipment</p>
              <p className="text-lg sm:text-2xl font-headline font-black text-on-surface italic break-words">{workout.equipment}</p>
            </div>
            <div className="bg-surface-container p-6 border border-outline">
              <p className="text-[9px] text-on-surface-variant font-black uppercase tracking-[0.3em] mb-1">Exercises</p>
              <p className="text-2xl font-headline font-black text-on-surface italic">{exercises.length}</p>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Exercise List */}
            <div className="col-span-12 lg:col-span-8 space-y-4">
              <section className="mb-20">
                <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
                  <div>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant mb-2">Protocol</h2>
                    <h3 className="font-headline text-2xl font-black uppercase text-on-surface leading-none tracking-tight items-center flex gap-4">
                      Exercises <span className="text-primary text-sm bg-primary/10 px-3 py-1">{exercises.length}</span>
                    </h3>
                  </div>
                  
                  {isOwner && (
                    <button
                      onClick={() => setAddModalOpen(true)}
                      className="flex items-center gap-2 bg-surface-lowest border border-outline px-4 py-2 hover:bg-surface hover:border-primary/40 transition-all active:scale-95 group"
                    >
                      <Plus className="w-4 h-4 text-primary group-hover:scale-125 transition-transform" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant group-hover:text-primary transition-colors mt-0.5">Add Exercise</span>
                    </button>
                  )}
                </div>
                
                <div className="space-y-4 relative">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                    <span className="text-on-surface-variant">Progress</span>
                    <span className="text-primary">{completedCount}/{exercises.length} Complete</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-highest rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary"
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </section>

              {exercises.map((exercise, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => toggleExercise(i)}
                  className={cn(
                    "bg-surface-container p-4 sm:p-6 border border-outline flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 cursor-pointer transition-all duration-300 group min-w-0",
                    exercise.completed ? "border-primary/30 opacity-60" : "hover:border-primary/20"
                  )}
                >
                  <div className="flex items-start gap-4 min-w-0 flex-1 sm:flex-1">
                    <div className="flex-shrink-0 pt-0.5">
                      {exercise.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                      ) : (
                        <Circle className="w-6 h-6 text-outline group-hover:text-primary/40 transition-colors" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={cn(
                        "font-headline text-base sm:text-lg font-black uppercase italic tracking-tight transition-colors break-words",
                        exercise.completed ? "line-through text-on-surface-variant" : "text-on-surface group-hover:text-primary"
                      )}>
                        {exercise.name}
                      </p>
                      {exercise.notes && (
                        <p className="text-xs text-on-surface-variant mt-1 italic">{exercise.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 sm:gap-6 sm:text-right flex-shrink-0 justify-start sm:justify-end w-full sm:w-auto pl-10 sm:pl-0">
                    {exercise.sets > 0 && (
                      <div>
                        <p className="text-[9px] text-on-surface-variant font-black uppercase tracking-[0.2em]">Sets</p>
                        <p className="text-sm font-bold text-on-surface">{exercise.sets}</p>
                      </div>
                    )}
                    {exercise.reps && (
                      <div>
                        <p className="text-[9px] text-on-surface-variant font-black uppercase tracking-[0.2em]">Reps</p>
                        <p className="text-sm font-bold text-on-surface">{exercise.reps}</p>
                      </div>
                    )}
                    {exercise.duration && (
                      <div>
                        <p className="text-[9px] text-on-surface-variant font-black uppercase tracking-[0.2em]">Time</p>
                        <p className="text-sm font-bold text-on-surface">{exercise.duration}</p>
                      </div>
                    )}
                    {exercise.rest && exercise.rest !== '-' && (
                      <div>
                        <p className="text-[9px] text-on-surface-variant font-black uppercase tracking-[0.2em]">Rest</p>
                        <p className="text-sm font-bold text-on-surface">{exercise.rest}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Timer Sidebar */}
            <div className="col-span-12 lg:col-span-4">
              <div className="bg-surface-container p-5 sm:p-8 border border-outline lg:sticky lg:top-28">
                <h4 className="font-headline text-xl font-black uppercase italic tracking-tight mb-8 text-center">Session Timer</h4>
                
                <div className="text-center mb-10">
                  <p className="text-4xl sm:text-5xl md:text-6xl font-headline font-black text-on-surface italic tracking-tighter tabular-nums">
                    {formatTime(timerSeconds)}
                  </p>
                  <p className="text-[9px] text-on-surface-variant font-black uppercase tracking-[0.4em] mt-2">Elapsed Time</p>
                </div>

                <div className="flex justify-center gap-4 flex-wrap">
                  <button
                    onClick={() => setTimerRunning(!timerRunning)}
                    className={cn(
                      "px-8 py-4 font-black text-[10px] uppercase tracking-[0.3em] transition-all active:scale-95",
                      timerRunning 
                        ? "bg-surface-highest text-on-surface hover:bg-surface-bright" 
                        : "bg-primary text-on-primary hover:brightness-110"
                    )}
                  >
                    {timerRunning ? (
                      <span className="flex items-center gap-2"><Pause className="w-4 h-4" /> Pause</span>
                    ) : (
                      <span className="flex items-center gap-2"><Play className="w-4 h-4" /> Start</span>
                    )}
                  </button>
                  <button
                    onClick={() => { setTimerRunning(false); setTimerSeconds(0); }}
                    className="px-6 py-4 border border-outline text-on-surface-variant font-black text-[10px] uppercase tracking-[0.3em] hover:bg-surface-bright transition-all active:scale-95"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <p className="mt-6 text-center text-[9px] text-on-surface-variant font-light leading-relaxed px-1">
                  Checking exercises only saves on this screen. Use <span className="font-bold text-on-surface">Log to progress</span> to update Dashboard &amp; Progress.
                </p>

                <button
                  type="button"
                  onClick={() => handleLogSession()}
                  disabled={loggingSession}
                  className={cn(
                    'mt-4 w-full py-4 font-black text-[10px] uppercase tracking-[0.25em] transition-all border',
                    loggingSession
                      ? 'border-outline text-on-surface-variant cursor-wait'
                      : 'border-primary bg-primary/10 text-primary hover:bg-primary hover:text-on-primary'
                  )}
                >
                  {loggingSession ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving…
                    </span>
                  ) : (
                    'Log to progress'
                  )}
                </button>

                {/* Quick Stats */}
                <div className="mt-10 pt-8 border-t border-outline space-y-6">
                  <div className="flex justify-between">
                    <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Completed</span>
                    <span className="text-sm font-black text-primary">{completedCount}/{exercises.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Progress</span>
                    <span className="text-sm font-black text-on-surface">{Math.round(progressPercentage)}%</span>
                  </div>
                </div>

                {progressPercentage === 100 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8 p-6 bg-primary/10 border border-primary/30 text-center"
                  >
                    <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
                    <p className="font-headline text-lg font-black uppercase italic text-primary">Workout Complete!</p>
                    <p className="text-xs text-on-surface-variant mt-1">Time: {formatTime(timerSeconds)}</p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </main>

      {/* Add Exercise Modal */}
      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add Exercise">
        <form onSubmit={handleAddExercise} className="space-y-6">
          <div className="space-y-4">
            <input 
              type="text" 
              value={exForm.name} 
              onChange={e => setExForm({ ...exForm, name: e.target.value })} 
              placeholder="EXERCISE NAME *" 
              className="w-full bg-surface-lowest border border-outline px-4 py-3 text-xs font-black tracking-widest uppercase focus:border-primary outline-none transition-colors" 
              required 
            />
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="number" 
                min="1" 
                value={exForm.sets} 
                onChange={e => setExForm({ ...exForm, sets: parseInt(e.target.value) || 1 })} 
                placeholder="SETS *" 
                className="w-full bg-surface-lowest border border-outline px-4 py-3 text-xs font-black tracking-widest uppercase focus:border-primary outline-none transition-colors" 
                required 
              />
              <input 
                type="text" 
                value={exForm.reps} 
                onChange={e => setExForm({ ...exForm, reps: e.target.value })} 
                placeholder="REPS (E.G. 8-12)" 
                className="w-full bg-surface-lowest border border-outline px-4 py-3 text-xs font-black tracking-widest uppercase focus:border-primary outline-none transition-colors" 
              />
              <input 
                type="text" 
                value={exForm.duration} 
                onChange={e => setExForm({ ...exForm, duration: e.target.value })} 
                placeholder="TIME (E.G. 60S)" 
                className="w-full bg-surface-lowest border border-outline px-4 py-3 text-xs font-black tracking-widest uppercase focus:border-primary outline-none transition-colors" 
              />
              <input 
                type="text" 
                value={exForm.rest} 
                onChange={e => setExForm({ ...exForm, rest: e.target.value })} 
                placeholder="REST (E.G. 90S)" 
                className="w-full bg-surface-lowest border border-outline px-4 py-3 text-xs font-black tracking-widest uppercase focus:border-primary outline-none transition-colors" 
              />
            </div>
            <input 
              type="text" 
              value={exForm.notes} 
              onChange={e => setExForm({ ...exForm, notes: e.target.value })} 
              placeholder="NOTES (OPTIONAL)" 
              className="w-full bg-surface-lowest border border-outline px-4 py-3 text-xs font-black tracking-widest uppercase focus:border-primary outline-none transition-colors" 
            />
          </div>
          
          <div className="flex gap-4 pt-4 border-t border-outline">
            <button 
              type="button" 
              onClick={() => setAddModalOpen(false)} 
              className="px-6 py-3 border border-outline text-on-surface font-black text-[10px] tracking-[0.3em] uppercase hover:bg-surface-lowest transition-all w-1/2"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting || !exForm.name.trim()} 
              className={cn("px-6 py-3 font-black text-[10px] tracking-[0.3em] uppercase transition-all w-1/2", 
                submitting || !exForm.name.trim() ? "bg-surface-bright text-on-surface-variant cursor-not-allowed" : "bg-primary text-on-primary hover:brightness-110 active:scale-95"
              )}
            >
              {submitting ? "Adding..." : "Add to Workout"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
