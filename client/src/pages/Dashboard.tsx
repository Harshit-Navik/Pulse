import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Flame,
  Utensils,
  ChevronRight,
  Plus,
  Info,
  Clock,
  Dumbbell,
  Activity,
  Zap,
  Target,
  Award,
  Scale,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { Footer } from '@/components/layout/Footer';
import { MetricCard } from '@/components/ui/MetricCard';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import { progressAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

// ── Types ──────────────────────────────────────────────────────────

interface DayChart {
  day: string;
  caloriesBurned: number;
  duration: number;
  hasSession: boolean;
}

interface RecentSession {
  _id: string;
  title: string;
  duration: number;
  caloriesBurned: number;
  createdAt: string;
  volume?: string;
  workout?: { image?: string; tag?: string };
}

interface DashboardData {
  user: {
    name: string;
    weight: number | null;
    weightUnit: string;
    fitnessGoal: string | null;
    totalWorkouts: number;
  };
  calorieTarget: number;
  proteinTarget: number;
  nutrition: {
    todayCalories: number;
    todayProtein: number;
    todayCarbs: number;
    todayFats: number;
    mealCount: number;
  };
  weeklyChart: DayChart[];
  weeklyCalories: number;
  activeDaysThisWeek: number;
  streak: number;
  totalWorkouts: number;
  recentSessions: RecentSession[];
}

// ── Skeleton Components ────────────────────────────────────────────

function SkeletonBar() {
  return (
    <div className="flex-1 bg-surface-highest animate-pulse rounded-sm" style={{ height: '60%' }} />
  );
}

function SkeletonText({ w = 'w-32', h = 'h-4' }: { w?: string; h?: string }) {
  return <div className={cn('bg-surface-highest animate-pulse rounded-sm', w, h)} />;
}

// ── Helper ─────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return `${diff} Days Ago`;
}

function getMotivationalTip(data: DashboardData): string {
  const { nutrition, calorieTarget, proteinTarget, streak } = data;
  const calPct = calorieTarget > 0 ? nutrition.todayCalories / calorieTarget : 0;
  const proPct = proteinTarget > 0 ? nutrition.todayProtein / proteinTarget : 0;

  if (streak >= 7) return `🔥 ${streak}-day streak! Elite-level consistency. Keep the momentum.`;
  if (calPct < 0.3 && nutrition.mealCount === 0) return 'Fuel up! You haven\'t logged any meals today. Nutrition drives performance.';
  if (proPct < 0.5) return `Protein at ${Math.round(proPct * 100)}% of target. Prioritize protein in your next meal for optimal recovery.`;
  if (calPct > 0.9) return 'Calorie target nearly reached. Ensure your macros are balanced for the rest of the day.';
  return 'Stay hydrated and consistent. Small daily actions compound into elite results.';
}

// ── Main Component ─────────────────────────────────────────────────

export default function Dashboard() {
  const { user: authUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fabModalOpen, setFabModalOpen] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    progressAPI.getDashboard()
      .then((res) => {
        setData(res.data.data);
        setError(false);
      })
      .catch((err) => {
        console.error("Dashboard fetch error:", err);
        setError(true);
        if (err.response?.status === 404) {
           setData({
              user: { name: authUser?.name || 'Athlete', weight: null, weightUnit: 'kg', fitnessGoal: null, totalWorkouts: 0 },
              calorieTarget: 2200, proteinTarget: 150,
              nutrition: { todayCalories: 0, todayProtein: 0, todayCarbs: 0, todayFats: 0, mealCount: 0 },
              weeklyChart: [], weeklyCalories: 0, activeDaysThisWeek: 0, streak: 0, totalWorkouts: 0, recentSessions: []
           });
        }
      })
      .finally(() => setLoading(false));
  }, [authUser?.name]);

  // ── Derived values ───────────────────────────────────────────────
  const calPct = data
    ? Math.min((data.nutrition.todayCalories / data.calorieTarget) * 100, 100)
    : 0;
  const ringCircumference = 552.92;
  const ringOffset = ringCircumference * (1 - calPct / 100);

  const chartMax = data
    ? Math.max(...data.weeklyChart.map((d) => d.caloriesBurned), 1)
    : 1;

  const displayName = authUser?.name?.split(' ')[0] || data?.user?.name?.split(' ')[0] || 'Athlete';
  const fitnessGoal = data?.user?.fitnessGoal || null;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main className="lg:ml-64 pt-20">
        <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-12">

          {/* ── Hero Header ─────────────────────────────────────────── */}
          <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-xl"
            >
              <h1 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tighter text-on-surface leading-[0.9] uppercase italic">
                Precision <br />
                <span className="text-primary">Performance.</span>
              </h1>
              <div className="mt-6 border-l border-primary/40 pl-4 space-y-1">
                {loading ? (
                  <>
                    <SkeletonText w="w-48" h="h-3" />
                    <SkeletonText w="w-60" h="h-3" />
                  </>
                ) : (
                  <>
                    <p className="text-on-surface-variant font-body text-sm font-light">
                      Welcome back, <span className="text-on-surface font-bold">{displayName}</span>
                      {data?.user?.weight && (
                        <span className="text-on-surface-variant/60"> · {data.user.weight}{data.user.weightUnit}</span>
                      )}
                      {fitnessGoal && (
                        <span className="text-primary font-semibold"> · {fitnessGoal}</span>
                      )}
                    </p>
                    <p className="text-on-surface-variant text-sm font-light leading-relaxed">
                      {data?.totalWorkouts === 0
                        ? 'Start your first workout to begin tracking your performance.'
                        : `${data?.totalWorkouts} total sessions · ${data?.activeDaysThisWeek ?? 0} active days this week · ${data?.streak ?? 0}-day streak`}
                    </p>
                  </>
                )}
              </div>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button className="bg-primary text-on-primary px-8 py-4 font-black text-[10px] uppercase tracking-[0.3em] hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/20">
                Start Workout
              </button>
              <button className="bg-surface border border-outline text-on-surface px-8 py-4 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-surface-bright transition-all active:scale-95">
                View Plan
              </button>
            </div>
          </section>

          {/* ── Stats Grid ──────────────────────────────────────────── */}
          <div className="grid grid-cols-12 gap-6">

            {/* Weekly Calories Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="col-span-12 lg:col-span-8 bg-surface-container p-8 flex flex-col justify-between border-t border-primary/30 relative overflow-hidden group"
            >
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] font-black text-primary mb-2 block">
                    Weekly Calories Burned
                  </span>
                  <h4 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight">
                    {loading ? (
                      <SkeletonText w="w-32" h="h-9" />
                    ) : (
                      <>
                        {(data?.weeklyCalories ?? 0).toLocaleString()}{' '}
                        <span className="text-sm font-normal text-on-surface-variant italic">kcal this week</span>
                      </>
                    )}
                  </h4>
                </div>
                <TrendingUp className="text-primary w-8 h-8" />
              </div>

              <div className="mt-12 h-48 flex items-end justify-between gap-3">
                {loading ? (
                  Array.from({ length: 7 }).map((_, i) => <SkeletonBar key={i} />)
                ) : data?.weeklyChart && data.weeklyChart.length > 0 ? (
                  data.weeklyChart.map((day, i) => {
                    const isToday = i === data.weeklyChart.length - 1;
                    const heightPct = chartMax > 0
                      ? Math.max((day.caloriesBurned / chartMax) * 100, day.hasSession ? 8 : 0)
                      : 0;
                    return (
                      <div
                        key={i}
                        className={cn(
                          'flex-1 relative group/bar transition-all duration-500 cursor-default',
                          isToday && day.hasSession ? 'bg-primary' : day.hasSession ? 'bg-surface-bright border border-primary/30' : 'bg-surface-highest'
                        )}
                        style={{ height: `${heightPct}%`, minHeight: day.hasSession ? '8%' : '4%' }}
                        title={`${day.day}: ${day.caloriesBurned} kcal`}
                      >
                        {isToday && (
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] text-primary font-black uppercase whitespace-nowrap">
                            Today
                          </span>
                        )}
                        {day.caloriesBurned > 0 && (
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] text-on-surface-variant font-black uppercase whitespace-nowrap opacity-0 group-hover/bar:opacity-100 transition-opacity">
                            {day.caloriesBurned}
                          </span>
                        )}
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <Dumbbell className="w-10 h-10 text-on-surface-variant/20 mb-3" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/40">
                      No sessions this week
                    </p>
                  </div>
                )}
              </div>

              {/* Day labels */}
              {!loading && data?.weeklyChart && (
                <div className="flex justify-between mt-3 px-0 gap-3">
                  {data.weeklyChart.map((d, i) => (
                    <span
                      key={i}
                      className={cn(
                        'flex-1 text-center text-[9px] font-black uppercase tracking-wider',
                        i === data.weeklyChart.length - 1 ? 'text-primary' : 'text-on-surface-variant/50'
                      )}
                    >
                      {d.day}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Daily Calorie Ring */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="col-span-12 lg:col-span-4 bg-surface-container p-8 flex flex-col items-center justify-center relative overflow-hidden"
            >
              <div className="relative w-48 h-48">
                <svg className="w-full h-full -rotate-90">
                  <circle className="text-surface-highest" cx="96" cy="96" fill="none" r="88" stroke="currentColor" strokeWidth="2" />
                  <motion.circle
                    className="text-primary"
                    cx="96" cy="96" fill="none" r="88"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray={ringCircumference}
                    initial={{ strokeDashoffset: ringCircumference }}
                    animate={{ strokeDashoffset: loading ? ringCircumference : ringOffset }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                    strokeLinecap="square"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {loading ? (
                    <SkeletonText w="w-16" h="h-10" />
                  ) : (
                    <>
                      <span className="text-5xl font-headline font-black text-on-surface italic">
                        {Math.round(calPct)}%
                      </span>
                      <span className="text-[9px] uppercase tracking-[0.4em] text-primary font-black">
                        {data?.nutrition.mealCount === 0 ? 'No Meals' : 'Calorie Goal'}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="mt-8 text-center">
                <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.3em] mb-1">
                  Calories Consumed
                </p>
                {loading ? (
                  <SkeletonText w="w-36" h="h-7" />
                ) : (
                  <p className="text-2xl font-headline font-bold text-on-surface">
                    {(data?.nutrition.todayCalories ?? 0).toLocaleString()}{' '}
                    <span className="text-sm font-normal text-on-surface-variant italic">
                      / {(data?.calorieTarget ?? 2200).toLocaleString()}
                    </span>
                  </p>
                )}
              </div>
            </motion.div>

            {/* Metric Cards Row */}
            <MetricCard
              label="Weekly Calories Burned"
              value={loading ? '—' : (data?.weeklyCalories ?? 0).toLocaleString()}
              unit="kcal"
              icon={Flame}
              color="text-primary"
            />
            <MetricCard
              label="Today's Protein"
              value={loading ? '—' : `${data?.nutrition.todayProtein ?? 0}`}
              unit={`/ ${data?.proteinTarget ?? 150}g`}
              icon={Utensils}
              color="text-emerald-400"
            />
            <MetricCard
              label="Current Streak"
              value={loading ? '—' : `${data?.streak ?? 0}`}
              unit="days"
              icon={Award}
              color="text-amber-400"
            />
          </div>

          {/* ── Bottom Section ──────────────────────────────────────── */}
          <div className="grid grid-cols-12 gap-10">

            {/* Recent Sessions */}
            <div className="col-span-12 lg:col-span-7">
              <div className="flex items-center justify-between mb-8">
                <h5 className="font-headline text-2xl font-black tracking-tight uppercase italic">
                  Recent Sessions
                </h5>
                <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.4em]">
                  Last {data?.recentSessions?.length ?? '—'}
                </span>
              </div>

              <div className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-surface-container p-6 flex items-center gap-6 animate-pulse">
                      <div className="w-16 h-16 bg-surface-low rounded-sm flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-surface-highest rounded w-24" />
                        <div className="h-5 bg-surface-highest rounded w-48" />
                        <div className="h-3 bg-surface-highest rounded w-32" />
                      </div>
                    </div>
                  ))
                ) : !data || data.recentSessions.length === 0 ? (
                  <div className="bg-surface-container p-12 flex flex-col items-center justify-center border border-dashed border-outline/50">
                    <Dumbbell className="w-10 h-10 text-on-surface-variant/20 mb-4" />
                    <p className="text-sm font-black uppercase tracking-[0.3em] text-on-surface-variant/40">
                      No sessions yet
                    </p>
                    <p className="text-xs text-on-surface-variant/30 mt-1 font-light">
                      Complete a workout to see it here
                    </p>
                  </div>
                ) : (
                  data.recentSessions.map((session) => (
                    <RecentSessionItem key={session._id} session={session} />
                  ))
                )}
              </div>
            </div>

            {/* Today's Nutrition Panel */}
            <div className="col-span-12 lg:col-span-5 bg-surface-container p-8 rounded-sm border border-outline relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/10 transition-colors" />
              <h5 className="font-headline text-2xl font-black tracking-tight mb-8 uppercase italic">
                Today's Nutrition
              </h5>

              {loading ? (
                <div className="space-y-6 animate-pulse">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="h-3 bg-surface-highest rounded w-16" />
                        <div className="h-3 bg-surface-highest rounded w-12" />
                      </div>
                      <div className="h-1.5 bg-surface-highest rounded w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6 relative z-10">
                  <NutritionBar
                    label="Calories"
                    current={data?.nutrition.todayCalories ?? 0}
                    target={data?.calorieTarget ?? 2200}
                    unit="kcal"
                    color="bg-primary"
                  />
                  <NutritionBar
                    label="Protein"
                    current={data?.nutrition.todayProtein ?? 0}
                    target={data?.proteinTarget ?? 150}
                    unit="g"
                    color="bg-emerald-500"
                  />
                  <NutritionBar
                    label="Carbs"
                    current={data?.nutrition.todayCarbs ?? 0}
                    target={Math.round((data?.calorieTarget ?? 2200) * 0.45 / 4)}
                    unit="g"
                    color="bg-blue-500"
                  />
                  <NutritionBar
                    label="Fats"
                    current={data?.nutrition.todayFats ?? 0}
                    target={Math.round((data?.calorieTarget ?? 2200) * 0.25 / 9)}
                    unit="g"
                    color="bg-amber-500"
                  />

                  <div className="mt-6 p-5 border border-primary/20 bg-primary/5 rounded-sm">
                    <div className="flex items-center gap-2 mb-3 text-primary">
                      <Info className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                        {data && data.nutrition.mealCount > 0 ? `${data.nutrition.mealCount} Meal${data.nutrition.mealCount > 1 ? 's' : ''} Logged` : 'Pulse Tip'}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant italic leading-relaxed">
                      {data ? getMotivationalTip(data) : 'Stay consistent.'}
                    </p>
                  </div>
                </div>
              )}

              {error && !loading && (
                <p className="text-xs text-red-400 mt-4 font-light">
                  Could not load live data. Check your connection.
                </p>
              )}
            </div>
          </div>

        </div>
        <Footer />
      </main>

      {/* FAB */}
      <button
        onClick={() => setFabModalOpen(true)}
        className="fixed bottom-6 right-6 sm:bottom-12 sm:right-12 w-14 h-14 sm:w-16 sm:h-16 bg-primary text-on-primary flex items-center justify-center rounded-sm shadow-2xl transition-all hover:brightness-125 hover:scale-105 active:scale-95 group z-50"
      >
        <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-500" />
      </button>

      {/* Quick Action Modal */}
      <Modal isOpen={fabModalOpen} onClose={() => setFabModalOpen(false)} title="Quick Action">
        <div className="space-y-4">
          <button className="w-full p-6 bg-surface-low border border-outline text-left hover:border-primary/40 transition-all group">
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Workout</p>
            <p className="font-headline text-lg font-black uppercase italic tracking-tight group-hover:text-primary transition-colors">Start a New Session</p>
          </button>
          <button className="w-full p-6 bg-surface-low border border-outline text-left hover:border-primary/40 transition-all group">
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Nutrition</p>
            <p className="font-headline text-lg font-black uppercase italic tracking-tight group-hover:text-primary transition-colors">Log a Meal</p>
          </button>
          <button className="w-full p-6 bg-surface-low border border-outline text-left hover:border-primary/40 transition-all group">
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Progress</p>
            <p className="font-headline text-lg font-black uppercase italic tracking-tight group-hover:text-primary transition-colors">Record Measurement</p>
          </button>
        </div>
      </Modal>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────

const RecentSessionItem: React.FC<{ session: RecentSession }> = ({ session }) => {
  const imgSrc = session.workout?.image || `https://picsum.photos/seed/${session._id}/200/200?grayscale`;
  const tag = session.workout?.tag || 'General';

  return (
    <div className="bg-surface-container p-6 flex items-center justify-between group cursor-pointer border-l-2 border-transparent hover:border-primary transition-all duration-300 overflow-hidden">
      <div className="flex items-center gap-4 sm:gap-6 min-w-0">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-surface-low rounded-sm overflow-hidden border border-outline flex-shrink-0">
          <img
            src={imgSrc}
            alt={session.title}
            className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 transition-all duration-500"
          />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-primary font-black tracking-[0.3em] uppercase mb-1">{tag}</p>
          <h6 className="font-headline text-base sm:text-lg font-extrabold tracking-tight uppercase italic truncate">
            {session.title}
          </h6>
          <div className="flex flex-wrap gap-4 mt-2">
            <span className="text-[9px] text-on-surface-variant uppercase font-black flex items-center gap-1">
              <Clock className="w-3 h-3" /> {session.duration > 0 ? `${session.duration}m` : 'N/A'}
            </span>
            {session.caloriesBurned > 0 && (
              <span className="text-[9px] text-on-surface-variant uppercase font-black flex items-center gap-1">
                <Flame className="w-3 h-3" /> {session.caloriesBurned} kcal
              </span>
            )}
            <span className="text-[9px] text-on-surface-variant uppercase font-black flex items-center gap-1">
              <Activity className="w-3 h-3" /> {formatDate(session.createdAt)}
            </span>
          </div>
        </div>
      </div>
      <ChevronRight className="text-outline group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
    </div>
  );
}

interface NutritionBarProps {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

function NutritionBar({ label, current, target, unit, color }: NutritionBarProps) {
  const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant">{label}</span>
        <span className="text-[10px] font-black text-on-surface">
          {current}<span className="text-on-surface-variant font-normal"> / {target}{unit}</span>
        </span>
      </div>
      <div className="w-full h-1 bg-surface-highest rounded-full overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', color)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
