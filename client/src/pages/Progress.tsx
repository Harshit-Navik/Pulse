import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Activity,
  ChevronRight,
  Award,
  Clock,
  Flame,
  Dumbbell,
  Plus,
  Scale,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { Footer } from '@/components/layout/Footer';
import { QuickStat } from '@/components/ui/QuickStat';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import { progressAPI, authAPI } from '@/lib/api';
import type { User } from '@/context/AuthContext';

type Range = 'week' | 'month' | 'year';

interface Session {
  _id: string;
  title: string;
  duration: number;
  caloriesBurned: number;
  createdAt: string;
  volume: string;
}

interface WeightEntry {
  _id: string;
  weight: number;
  unit: string;
  date: string;
}

interface ChartDay {
  day: string;
  caloriesBurned: number;
  duration: number;
  hasSession: boolean;
}

interface StatsData {
  totalWorkouts: number;
  avgDuration: number;
  totalCalories: number;
  weeklyChart: ChartDay[];
  streak: number;
  weeklyCalories: number;
  range?: Range;
}

function formatDateShort(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return `${diff} Days Ago`;
}

function filterWeightsByRange(entries: WeightEntry[], range: Range): WeightEntry[] {
  const now = new Date();
  const cutoff = new Date();
  if (range === 'week') cutoff.setDate(now.getDate() - 7);
  else if (range === 'month') cutoff.setDate(now.getDate() - 30);
  else cutoff.setFullYear(now.getFullYear() - 1);
  return entries
    .filter((e) => new Date(e.date) >= cutoff)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

const rangeLabel: Record<Range, string> = {
  week: 'Last 7 days',
  month: 'Last 30 days',
  year: 'Last 12 months',
};

export default function Progress() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [range, setRange] = useState<Range>('week');

  const [stats, setStats] = useState<StatsData | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);

  const [isAddingWeight, setIsAddingWeight] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [isSubmittingWeight, setIsSubmittingWeight] = useState(false);

  const fetchStats = useCallback(async (r: Range) => {
    setStatsLoading(true);
    try {
      const statsRes = await progressAPI.getStats({ range: r });
      setStats(statsRes.data.data);
    } catch (err) {
      console.error('Failed to fetch progress stats', err);
      setStats(null);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [sessionsRes, weightRes, profileRes] = await Promise.all([
          progressAPI.getSessions(12),
          progressAPI.getWeightHistory(365),
          authAPI.getProfile().catch(() => null),
        ]);
        if (cancelled) return;
        setSessions(sessionsRes.data.data);
        setWeightHistory(weightRes.data.data);
        if (profileRes) {
          setProfileUser(profileRes.data.data as User);
        }
      } catch (err) {
        console.error('Failed to fetch progress data', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    fetchStats(range);
  }, [range, fetchStats]);

  const handleAddWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight || isNaN(Number(newWeight))) return;

    setIsSubmittingWeight(true);
    try {
      await progressAPI.addWeight(Number(newWeight));
      setNewWeight('');
      setIsAddingWeight(false);
      const res = await progressAPI.getWeightHistory(365);
      setWeightHistory(res.data.data);
      const pr = await authAPI.getProfile();
      setProfileUser(pr.data.data as User);
    } catch (err) {
      console.error('Failed to add weight', err);
    } finally {
      setIsSubmittingWeight(false);
    }
  };

  const chartWeights = useMemo(
    () => filterWeightsByRange(weightHistory, range),
    [weightHistory, range]
  );

  const hasWeightData = chartWeights.length > 0;

  let polylinePoints = '';
  let minWeigth = 0;
  let maxWeight = 100;

  if (hasWeightData) {
    const weights = chartWeights.map((e) => e.weight);
    minWeigth = Math.min(...weights) - 5;
    maxWeight = Math.max(...weights) + 5;
    const rangeW = maxWeight - minWeigth;
    polylinePoints = chartWeights
      .map((entry, index) => {
        const x =
          chartWeights.length === 1 ? 400 : (index / (chartWeights.length - 1)) * 800;
        const y = 150 - ((entry.weight - minWeigth) / rangeW) * 150;
        return `${x},${y}`;
      })
      .join(' ');
  }

  const activityChart = stats?.weeklyChart ?? [];
  const chartMaxCal = Math.max(...activityChart.map((d) => d.caloriesBurned), 1);

  const filterClass =
    'px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] border transition-all';

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main className="lg:ml-64 pt-20">
        <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-12">
          <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="font-headline text-4xl md:text-6xl font-black italic tracking-tighter text-on-surface leading-none uppercase">
                Progress
              </h2>
              <p className="mt-6 text-on-surface-variant max-w-lg font-light leading-relaxed">
                Weight, workouts, and calories from your logged sessions and meals. Pick a range to
                update charts.
              </p>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsAddingWeight(true)}
                className="px-8 py-4 bg-primary text-on-primary font-black text-[10px] tracking-[0.3em] uppercase hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Log weight
              </button>
            </div>
          </section>

          <div className="flex flex-wrap gap-2">
            {(['week', 'month', 'year'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={cn(
                  filterClass,
                  range === r
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-outline text-on-surface-variant hover:border-primary/50'
                )}
              >
                {r === 'week' ? 'Weekly' : r === 'month' ? 'Monthly' : 'Yearly'}
              </button>
            ))}
          </div>

          <Modal title="Log weight entry" isOpen={isAddingWeight} onClose={() => setIsAddingWeight(false)}>
            <form onSubmit={handleAddWeight} className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant mb-2 block">
                  Body weight
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="e.g. 75.5"
                    className="w-full bg-surface border border-outline p-4 font-headline text-2xl font-bold text-on-surface focus:border-primary focus:outline-none transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">
                    kg
                  </span>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmittingWeight}
                className="w-full bg-primary text-on-primary p-4 font-black text-[10px] uppercase tracking-[0.3em] hover:brightness-110 transition-all disabled:opacity-50"
              >
                {isSubmittingWeight ? 'Saving...' : 'Save entry'}
              </button>
            </form>
          </Modal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickStat
              label="Total workouts"
              value={loading ? '—' : `${stats?.totalWorkouts ?? 0}`}
              icon={Dumbbell}
            />
            <QuickStat
              label="Avg. duration"
              value={loading ? '—' : `${stats?.avgDuration ?? 0}m`}
              icon={Clock}
            />
            <QuickStat
              label="Calories burned (all time)"
              value={
                loading
                  ? '—'
                  : `${((stats?.totalCalories ?? 0) / 1000).toFixed(1)}k`
              }
              icon={Flame}
            />
          </div>

          {(profileUser?.fitnessGoal || profileUser?.weight) && (
            <div className="bg-surface-container border border-outline p-6 md:p-8">
              <h3 className="font-headline text-lg font-black uppercase italic tracking-tight mb-4">
                Goals &amp; body
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant mb-1">
                    Fitness goal
                  </p>
                  <p className="text-on-surface font-medium">
                    {profileUser?.fitnessGoal || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant mb-1">
                    Current weight (profile)
                  </p>
                  <p className="text-on-surface font-medium">
                    {profileUser?.weight != null
                      ? `${profileUser.weight} kg`
                      : 'Not set — update in Profile'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant mb-1">
                    Activity
                  </p>
                  <p className="text-on-surface font-medium">
                    {profileUser?.activityLevel || '—'}
                  </p>
                </div>
              </div>
              <Link
                to="/profile"
                className="inline-block mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:underline"
              >
                Edit profile
              </Link>
            </div>
          )}

          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8 bg-surface-container p-10 border border-outline relative overflow-hidden">
              <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
                <div>
                  <h4 className="font-headline text-2xl font-black uppercase italic tracking-tight mb-2">
                    Weight
                  </h4>
                  <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.3em]">
                    {rangeLabel[range]} · from your log
                  </p>
                </div>
              </div>

              <div className="h-64 flex flex-col justify-end relative">
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Activity className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                ) : hasWeightData ? (
                  <>
                    <svg
                      className="absolute inset-0 w-full h-full overflow-visible"
                      preserveAspectRatio="none"
                      viewBox="0 0 800 150"
                    >
                      <motion.polyline
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: 'easeInOut' }}
                        points={polylinePoints}
                        fill="none"
                        stroke="currentColor"
                        className="text-primary"
                        strokeWidth="3"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />
                      {chartWeights.map((entry, index) => {
                        const x =
                          chartWeights.length === 1
                            ? 400
                            : (index / (chartWeights.length - 1)) * 800;
                        const y =
                          150 -
                          ((entry.weight - minWeigth) / (maxWeight - minWeigth)) * 150;
                        return (
                          <motion.circle
                            key={entry._id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1 + index * 0.05 }}
                            cx={x}
                            cy={y}
                            r="4"
                            fill="currentColor"
                            className="text-background"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <title>
                              {entry.weight} {entry.unit} — {formatDateShort(entry.date)}
                            </title>
                          </motion.circle>
                        );
                      })}
                    </svg>
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-full h-px bg-on-surface" />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-outline/50 bg-surface-low/30">
                    <Scale className="w-10 h-10 text-on-surface-variant/30 mb-3" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-4 text-center px-4">
                      No weight entries in this range
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsAddingWeight(true)}
                      className="px-6 py-2 bg-surface border border-outline text-on-surface text-[9px] font-black uppercase tracking-widest hover:border-primary transition-colors"
                    >
                      Log weight
                    </button>
                  </div>
                )}
              </div>

              {hasWeightData && (
                <div className="flex justify-between mt-6 px-2 overflow-x-auto gap-4 no-scrollbar">
                  {chartWeights
                    .filter(
                      (_, i) =>
                        i % Math.max(1, Math.floor(chartWeights.length / 6)) === 0
                    )
                    .map((entry) => (
                      <span
                        key={entry._id}
                        className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant whitespace-nowrap"
                      >
                        {formatDateShort(entry.date)}
                      </span>
                    ))}
                </div>
              )}
            </div>

            <div className="col-span-12 lg:col-span-4 bg-surface-container p-10 border border-outline flex flex-col justify-between">
              <div>
                <h4 className="font-headline text-2xl font-black uppercase italic tracking-tight mb-2">
                  Workout consistency
                </h4>
                <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.3em]">
                  {rangeLabel[range]}
                </p>
              </div>

              <div className="flex flex-col gap-4 mt-8">
                <div
                  className={cn(
                    'flex items-end gap-1 h-32 overflow-x-auto pb-1',
                    activityChart.length > 14 && 'min-w-0'
                  )}
                >
                  {loading || statsLoading ? (
                    Array.from({ length: 7 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 min-w-[8px] rounded-sm bg-surface-highest animate-pulse h-1/2"
                      />
                    ))
                  ) : activityChart.length > 0 ? (
                    activityChart.map((day, i) => (
                      <motion.div
                        key={`${day.day}-${i}`}
                        initial={{ height: 0 }}
                        animate={{ height: day.hasSession ? '100%' : '18%' }}
                        transition={{ delay: i * 0.02 }}
                        title={`${day.day}: ${day.caloriesBurned} kcal`}
                        className={cn(
                          'flex-1 min-w-[6px] max-w-[40px] rounded-sm',
                          day.hasSession ? 'bg-primary' : 'bg-surface-highest'
                        )}
                      />
                    ))
                  ) : (
                    <div className="w-full text-center text-[10px] text-on-surface-variant py-8">
                      No activity in this range
                    </div>
                  )}
                </div>
                <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-on-surface-variant gap-1 overflow-x-auto">
                  {activityChart.map((d, i) => (
                    <span key={i} className="truncate max-w-[3rem]">
                      {d.day}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 p-6 bg-surface-low border border-outline/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                      Streak
                    </p>
                    <p className="text-sm font-bold text-on-surface">
                      {stats?.streak ?? 0} day{stats?.streak !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container p-10 border border-outline">
            <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
              <div>
                <h4 className="font-headline text-2xl font-black uppercase italic tracking-tight mb-2 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  Calories burned
                </h4>
                <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.3em]">
                  {rangeLabel[range]} · from workout sessions
                </p>
              </div>
              <p className="font-headline text-3xl font-black text-on-surface">
                {(stats?.weeklyCalories ?? 0).toLocaleString()}{' '}
                <span className="text-sm font-normal text-on-surface-variant italic">kcal</span>
              </p>
            </div>
            <div className="h-48 flex items-end justify-between gap-1 overflow-x-auto">
              {loading || statsLoading ? (
                Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 min-w-[8px] bg-surface-highest animate-pulse rounded-sm"
                    style={{ height: '40%' }}
                  />
                ))
              ) : activityChart.length > 0 ? (
                activityChart.map((day, i) => {
                  const h =
                    chartMaxCal > 0
                      ? Math.max((day.caloriesBurned / chartMaxCal) * 100, day.hasSession ? 10 : 4)
                      : 0;
                  return (
                    <div
                      key={`cal-${i}`}
                      className={cn(
                        'flex-1 min-w-[6px] max-w-[48px] rounded-sm transition-all',
                        day.caloriesBurned > 0 ? 'bg-primary/90' : 'bg-surface-highest'
                      )}
                      style={{ height: `${h}%` }}
                      title={`${day.day}: ${day.caloriesBurned} kcal`}
                    />
                  );
                })
              ) : (
                <div className="w-full flex flex-col items-center justify-center py-12 text-on-surface-variant text-sm">
                  Log workouts to see calories burned over time.
                </div>
              )}
            </div>
          </div>

          <section>
            <h3 className="font-headline text-3xl font-black uppercase italic tracking-tighter mb-8">
              Recent sessions
            </h3>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-surface-container p-6 h-32 animate-pulse border border-outline"
                  />
                ))}
              </div>
            ) : sessions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sessions.map((session) => (
                  <Link
                    key={session._id}
                    to="/workouts"
                    className="bg-surface-container p-6 border border-outline hover:bg-surface-bright transition-all group"
                  >
                    <p className="text-[9px] text-primary font-black uppercase tracking-[0.3em] mb-2">
                      {formatDate(session.createdAt)}
                    </p>
                    <h5
                      className="font-headline text-lg font-black uppercase italic tracking-tight mb-6 leading-tight group-hover:text-primary transition-colors truncate"
                      title={session.title}
                    >
                      {session.title}
                    </h5>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-4">
                        <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {session.duration}m
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-1">
                          <Flame className="w-3 h-3" /> {session.caloriesBurned}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-outline group-hover:text-primary transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-surface-container border border-dashed border-outline p-12 flex flex-col items-center justify-center text-center">
                <Dumbbell className="w-12 h-12 text-on-surface-variant/30 mb-4" />
                <h4 className="font-headline text-xl font-black uppercase italic tracking-tight">
                  No sessions yet
                </h4>
                <p className="text-sm text-on-surface-variant mt-2 font-light max-w-md">
                  Start a workout from the Workouts page to build your history.
                </p>
                <Link
                  to="/workouts"
                  className="mt-6 px-8 py-3 bg-primary text-on-primary text-[10px] font-black uppercase tracking-[0.3em] hover:brightness-110"
                >
                  Browse workouts
                </Link>
              </div>
            )}
          </section>
        </div>

        <Footer />
      </main>
    </div>
  );
}
