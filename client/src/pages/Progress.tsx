import React, { useState, useEffect } from 'react';
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
  Scale
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { Footer } from '@/components/layout/Footer';
import { QuickStat } from '@/components/ui/QuickStat';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import { progressAPI } from '@/lib/api';

// ── Types ──────────────────────────────────────────────────────────

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

interface StatsData {
  totalWorkouts: number;
  avgDuration: number;
  totalCalories: number;
  weeklyChart: { day: string; caloriesBurned: number; duration: number; hasSession: boolean }[];
  streak: number;
}

// ── Helpers ────────────────────────────────────────────────────────

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

// ── Main Component ─────────────────────────────────────────────────

export default function Progress() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [stats, setStats] = useState<StatsData | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Add weight logic
  const [isAddingWeight, setIsAddingWeight] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [isSubmittingWeight, setIsSubmittingWeight] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, sessionsRes, weightRes] = await Promise.all([
        progressAPI.getStats().catch(err => {
          if (err.response?.status === 404 || err.response?.status === 401) return { data: { data: { totalWorkouts: 0, avgDuration: 0, totalCalories: 0, weeklyChart: [], streak: 0 } } };
          throw err;
        }),
        progressAPI.getSessions(8).catch(err => {
          if (err.response?.status === 404 || err.response?.status === 401) return { data: { data: [] } };
          throw err;
        }),
        progressAPI.getWeightHistory(30).catch(err => {
          if (err.response?.status === 404 || err.response?.status === 401) return { data: { data: [] } };
          throw err;
        })
      ]);
      setStats(statsRes.data.data);
      setSessions(sessionsRes.data.data);
      setWeightHistory(weightRes.data.data);
    } catch (err) {
      console.error("Failed to fetch progress data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight || isNaN(Number(newWeight))) return;
    
    setIsSubmittingWeight(true);
    try {
      await progressAPI.addWeight(Number(newWeight));
      setNewWeight('');
      setIsAddingWeight(false);
      // Refresh only weight history
      const res = await progressAPI.getWeightHistory(30);
      setWeightHistory(res.data.data);
    } catch (err) {
      console.error("Failed to add weight", err);
    } finally {
      setIsSubmittingWeight(false);
    }
  };

  // ── Compute Chart SVG Path ───────────────────────────────────────
  const chartData = [...weightHistory].reverse(); // oldest to newest
  const hasWeightData = chartData.length > 0;
  
  let polylinePoints = '';
  // Default bounds
  let minWeigth = 0;
  let maxWeight = 100;
  
  if (hasWeightData) {
    const weights = chartData.map(e => e.weight);
    minWeigth = Math.min(...weights) - 5;
    maxWeight = Math.max(...weights) + 5;
    const range = maxWeight - minWeigth;
    
    polylinePoints = chartData.map((entry, index) => {
      // x from 0 to 800
      const x = chartData.length === 1 ? 400 : (index / (chartData.length - 1)) * 800;
      // y from 0 to 150 (inverted, 0 is top)
      const y = 150 - ((entry.weight - minWeigth) / range) * 150;
      return `${x},${y}`;
    }).join(' ');
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <main className="lg:ml-64 pt-20">
        <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-12">
          
          {/* Header */}
          <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="font-headline text-4xl md:text-6xl font-black italic tracking-tighter text-on-surface leading-none uppercase">Performance Metrics</h2>
              <p className="mt-6 text-on-surface-variant max-w-md font-light leading-relaxed">
                Your biological data mapped over time. Analyzing trends in strength, endurance, and systemic recovery.
              </p>
            </motion.div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button 
                onClick={() => setIsAddingWeight(true)}
                className="px-8 py-4 bg-primary text-on-primary font-black text-[10px] tracking-[0.3em] uppercase hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Log Weight
              </button>
            </div>
          </section>

          {/* Add Weight Modal */}
          <Modal title="Log Weight Entry" isOpen={isAddingWeight} onClose={() => setIsAddingWeight(false)}>
            <form onSubmit={handleAddWeight} className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant mb-2 block">
                  Body Weight
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
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">kg</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmittingWeight}
                className="w-full bg-primary text-on-primary p-4 font-black text-[10px] uppercase tracking-[0.3em] hover:brightness-110 transition-all disabled:opacity-50"
              >
                {isSubmittingWeight ? "Saving..." : "Save Entry"}
              </button>
            </form>
          </Modal>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickStat 
              label="Total Workouts" 
              value={loading ? "—" : `${stats?.totalWorkouts || 0}`} 
              icon={Dumbbell} 
              trend={"+"} 
            />
            <QuickStat 
              label="Avg. Duration" 
              value={loading ? "—" : `${stats?.avgDuration || 0}m`} 
              icon={Clock} 
              trend={"+"} 
            />
            <QuickStat 
              label="Total Calories" 
              value={loading ? "—" : `${((stats?.totalCalories || 0)/1000).toFixed(1)}k`} 
              icon={Flame} 
              trend={"+"} 
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-12 gap-8">
            
            {/* Weight Chart */}
            <div className="col-span-12 lg:col-span-8 bg-surface-container p-10 border border-outline relative overflow-hidden">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h4 className="font-headline text-2xl font-black uppercase italic tracking-tight mb-2">Weight Progress</h4>
                  <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.3em]">Last 30 Entries</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Weight</span>
                  </div>
                </div>
              </div>
              
              <div className="h-64 flex flex-col justify-end relative">
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Activity className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                ) : hasWeightData ? (
                  <>
                    <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 150">
                      <motion.polyline 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        points={polylinePoints}
                        fill="none" 
                        stroke="#FF3B3B" 
                        strokeWidth="3"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />
                      {/* Points */}
                      {chartData.map((entry, index) => {
                        const x = chartData.length === 1 ? 400 : (index / (chartData.length - 1)) * 800;
                        const y = 150 - ((entry.weight - minWeigth) / (maxWeight - minWeigth)) * 150;
                        return (
                          <motion.circle
                            key={entry._id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1 + (index * 0.05) }}
                            cx={x}
                            cy={y}
                            r="4"
                            fill="#1A1A1A"
                            stroke="#FF3B3B"
                            strokeWidth="2"
                            className="hover:scale-150 transition-transform cursor-pointer"
                          >
                            <title>{entry.weight} {entry.unit} - {formatDateShort(entry.date)}</title>
                          </motion.circle>
                        )
                      })}
                    </svg>
                    {/* Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                      {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-full h-px bg-on-surface"></div>)}
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-outline/50 bg-surface-low/30">
                    <Scale className="w-10 h-10 text-on-surface-variant/30 mb-3" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-4">No weight data available</p>
                    <button 
                      onClick={() => setIsAddingWeight(true)}
                      className="px-6 py-2 bg-surface border border-outline text-on-surface text-[9px] font-black uppercase tracking-widest hover:border-primary transition-colors"
                    >
                      Log first entry
                    </button>
                  </div>
                )}
              </div>
              
              {hasWeightData && (
                <div className="flex justify-between mt-6 px-2 overflow-x-auto no-scrollbar gap-4">
                  {chartData.filter((_, i) => i % Math.max(1, Math.floor(chartData.length / 5)) === 0).map(entry => (
                    <span key={entry._id} className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant whitespace-nowrap">
                      {formatDateShort(entry.date)}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Consistency Card */}
            <div className="col-span-12 lg:col-span-4 bg-surface-container p-10 border border-outline flex flex-col justify-between">
              <div>
                <h4 className="font-headline text-2xl font-black uppercase italic tracking-tight mb-2">Consistency</h4>
                <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.3em]">7-Day Frequency</p>
              </div>
              
              <div className="flex flex-col gap-4 mt-10">
                <div className="flex items-end gap-2 h-32">
                  {loading ? (
                    Array.from({length: 7}).map((_, i) => (
                       <div key={i} className="flex-1 rounded-sm bg-surface-highest animate-pulse h-1/2" />
                    ))
                  ) : (
                    stats?.weeklyChart?.map((day, i) => (
                      <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: day.hasSession ? '100%' : '15%' }}
                        transition={{ delay: i * 0.1 }}
                        className={cn("flex-1 rounded-sm", day.hasSession ? "bg-primary" : "bg-surface-highest")}
                      />
                    ))
                  )}
                </div>
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-on-surface-variant">
                  {stats?.weeklyChart?.map((d, i) => (
                    <span key={i}>{d.day.charAt(0)}</span>
                  )) || <span>M</span>}
                </div>
              </div>

              <div className="mt-10 p-6 bg-surface-low border border-outline/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Milestone</p>
                    <p className="text-sm font-bold text-on-surface">{stats?.streak || 0} Day Streak</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Sessions List */}
          <section>
            <h3 className="font-headline text-3xl font-black uppercase italic tracking-tighter mb-8">Recent Sessions</h3>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({length: 4}).map((_, i) => (
                  <div key={i} className="bg-surface-container p-6 h-32 animate-pulse border border-outline"></div>
                ))}
              </div>
            ) : sessions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sessions.map(session => (
                   <div key={session._id} className="bg-surface-container p-6 border border-outline hover:bg-surface-bright transition-all cursor-pointer group">
                     <p className="text-[9px] text-primary font-black uppercase tracking-[0.3em] mb-2">{formatDate(session.createdAt)}</p>
                     <h5 className="font-headline text-lg font-black uppercase italic tracking-tight mb-6 leading-tight group-hover:text-primary transition-colors truncate" title={session.title}>{session.title}</h5>
                     <div className="flex justify-between items-center">
                       <div className="flex gap-4">
                         <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-1"><Clock className="w-3 h-3"/> {session.duration}m</span>
                         <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-1"><Flame className="w-3 h-3"/> {session.caloriesBurned}</span>
                       </div>
                       <ChevronRight className="w-4 h-4 text-outline group-hover:text-primary transition-all" />
                     </div>
                   </div>
                ))}
              </div>
            ) : (
               <div className="bg-surface-container border border-dashed border-outline p-12 flex flex-col items-center justify-center text-center">
                 <Dumbbell className="w-12 h-12 text-on-surface-variant/30 mb-4" />
                 <h4 className="font-headline text-xl font-black uppercase italic tracking-tight">No recorded sessions</h4>
                 <p className="text-sm text-on-surface-variant mt-2 font-light">Complete your first workout to start tracking your performance history.</p>
               </div>
            )}
          </section>
        </div>

        <Footer />
      </main>
    </div>
  );
}
