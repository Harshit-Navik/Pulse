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
  Circle
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  completed: boolean;
}

interface WorkoutData {
  id: string;
  tag: string;
  title: string;
  duration: string;
  difficulty: string;
  equipment: string;
  image: string;
  description: string;
  exercises: Exercise[];
}

const workoutDatabase: Record<string, WorkoutData> = {
  'neural-hypertrophy': {
    id: 'neural-hypertrophy',
    tag: 'STRENGTH',
    title: 'Neural Hypertrophy 1.0',
    duration: '65 MINS',
    difficulty: 'ELITE',
    equipment: 'FULL GYM',
    image: 'https://picsum.photos/seed/strength/1200/600?grayscale',
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
    image: 'https://picsum.photos/seed/cardio/1200/600?grayscale',
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
    image: 'https://picsum.photos/seed/mobility/1200/600?grayscale',
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
    image: 'https://picsum.photos/seed/hybrid/1200/600?grayscale',
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const workout = id ? workoutDatabase[id] : null;

  useEffect(() => {
    if (workout) {
      setExercises(workout.exercises.map(e => ({ ...e })));
    }
  }, [id]);

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
    <div className="min-h-screen bg-background">
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
          <section className="relative h-80 md:h-96 overflow-hidden border border-outline">
            <img 
              src={workout.image} 
              alt={workout.title} 
              className="w-full h-full object-cover grayscale brightness-40 contrast-125"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 md:p-12">
              <span className="bg-primary px-3 py-1 text-[9px] font-black tracking-[0.2em] uppercase text-on-primary mb-4 inline-block">{workout.tag}</span>
              <h1 className="font-headline text-3xl md:text-5xl font-black text-on-surface uppercase italic tracking-tighter leading-none mb-4">{workout.title}</h1>
              <p className="text-on-surface-variant text-sm max-w-xl font-light leading-relaxed">{workout.description}</p>
            </div>
          </section>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface-container p-6 border border-outline">
              <p className="text-[9px] text-on-surface-variant font-black uppercase tracking-[0.3em] mb-1">Duration</p>
              <p className="text-2xl font-headline font-black text-on-surface italic">{workout.duration}</p>
            </div>
            <div className="bg-surface-container p-6 border border-outline">
              <p className="text-[9px] text-on-surface-variant font-black uppercase tracking-[0.3em] mb-1">Difficulty</p>
              <p className="text-2xl font-headline font-black text-on-surface italic">{workout.difficulty}</p>
            </div>
            <div className="bg-surface-container p-6 border border-outline">
              <p className="text-[9px] text-on-surface-variant font-black uppercase tracking-[0.3em] mb-1">Equipment</p>
              <p className="text-2xl font-headline font-black text-on-surface italic">{workout.equipment}</p>
            </div>
            <div className="bg-surface-container p-6 border border-outline">
              <p className="text-[9px] text-on-surface-variant font-black uppercase tracking-[0.3em] mb-1">Exercises</p>
              <p className="text-2xl font-headline font-black text-on-surface italic">{exercises.length}</p>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Exercise List */}
            <div className="col-span-12 lg:col-span-8 space-y-4">
              <h3 className="font-headline text-2xl font-black uppercase italic tracking-tight mb-6">Exercise Protocol</h3>
              
              {/* Progress bar */}
              <div className="mb-8">
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

              {exercises.map((exercise, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => toggleExercise(i)}
                  className={cn(
                    "bg-surface-container p-6 border border-outline flex items-center gap-6 cursor-pointer transition-all duration-300 group",
                    exercise.completed ? "border-primary/30 opacity-60" : "hover:border-primary/20"
                  )}
                >
                  <div className="flex-shrink-0">
                    {exercise.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    ) : (
                      <Circle className="w-6 h-6 text-outline group-hover:text-primary/40 transition-colors" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={cn(
                      "font-headline text-lg font-black uppercase italic tracking-tight transition-colors",
                      exercise.completed ? "line-through text-on-surface-variant" : "text-on-surface group-hover:text-primary"
                    )}>
                      {exercise.name}
                    </p>
                  </div>
                  <div className="flex gap-6 text-right">
                    <div>
                      <p className="text-[9px] text-on-surface-variant font-black uppercase tracking-[0.2em]">Sets</p>
                      <p className="text-sm font-bold text-on-surface">{exercise.sets}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-on-surface-variant font-black uppercase tracking-[0.2em]">Reps</p>
                      <p className="text-sm font-bold text-on-surface">{exercise.reps}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-on-surface-variant font-black uppercase tracking-[0.2em]">Rest</p>
                      <p className="text-sm font-bold text-on-surface">{exercise.rest}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Timer Sidebar */}
            <div className="col-span-12 lg:col-span-4">
              <div className="bg-surface-container p-8 border border-outline sticky top-28">
                <h4 className="font-headline text-xl font-black uppercase italic tracking-tight mb-8 text-center">Session Timer</h4>
                
                <div className="text-center mb-10">
                  <p className="text-6xl font-headline font-black text-on-surface italic tracking-tighter">
                    {formatTime(timerSeconds)}
                  </p>
                  <p className="text-[9px] text-on-surface-variant font-black uppercase tracking-[0.4em] mt-2">Elapsed Time</p>
                </div>

                <div className="flex justify-center gap-4">
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
    </div>
  );
}
